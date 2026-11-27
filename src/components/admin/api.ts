"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

/** Met à jour immédiatement le site public après une modification. */
export async function revalidateSite() { try { await fetch("/api/revalidate", { method: "POST" }); } catch { /* le site se mettra à jour sous 30 s */ } }

async function prepare(file: File, max = 2000): Promise<{ blob: Blob; type: string; ext: string }> {
  if (file.type === "image/svg+xml") return { blob: file, type: file.type, ext: "svg" };
  if (file.type === "image/gif") return { blob: file, type: file.type, ext: "gif" };
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas"); canvas.width = Math.round(bmp.width * k); canvas.height = Math.round(bmp.height * k);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const keepAlpha = file.type === "image/png" || file.type === "image/webp";
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b as Blob), keepAlpha ? "image/webp" : "image/jpeg", 0.88));
  const type = blob.type || (keepAlpha ? "image/png" : "image/jpeg");
  return { blob, type, ext: type === "image/webp" ? "webp" : type === "image/png" ? "png" : "jpg" };
}

/** Réduit l'image si besoin, l'envoie dans la médiathèque et renvoie son adresse publique. */
export async function uploadImage(file: File, folder = "general"): Promise<string> {
  const supabase = supabaseBrowser();
  const { blob, type, ext } = await prepare(file);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
