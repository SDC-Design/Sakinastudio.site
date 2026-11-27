"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { uploadImage } from "./api";
import { cn } from "@/lib/utils";

const FOLDERS = [["general", "Général"], ["hero", "Accueil"], ["projets", "Réalisations"], ["services", "Services"], ["equipe", "Équipe"], ["temoignages", "Témoignages"]];

export default function MediaManager() {
  const supabase = supabaseBrowser();
  const [folder, setFolder] = useState("general"); const [files, setFiles] = useState<any[] | null>(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase.storage.from("media").list(folder, { limit: 300, sortBy: { column: "created_at", order: "desc" } });
    if (error) { setMsg(error.message); setFiles([]); return; }
    setFiles((data || []).filter((f) => f.name !== ".emptyFolderPlaceholder" && f.id).map((f) => ({ ...f, path: `${folder}/${f.name}`, url: supabase.storage.from("media").getPublicUrl(`${folder}/${f.name}`).data.publicUrl })));
  }, [supabase, folder]);
  useEffect(() => { setFiles(null); load(); }, [load]);
  async function upload(list: FileList | null) {
    if (!list?.length) return; setBusy(true); setMsg("");
    try { for (const f of Array.from(list)) await uploadImage(f, folder); } catch (e: any) { setMsg(e.message); }
    setBusy(false); load();
  }
  async function del(f: any) { if (!confirm("Supprimer cette image ? Elle disparaîtra des pages qui l'utilisent.")) return; await supabase.storage.from("media").remove([f.path]); load(); }
  async function copy(u: string) { await navigator.clipboard.writeText(u); setMsg("Adresse copiée."); setTimeout(() => setMsg(""), 2000); }
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Médiathèque</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink">Toutes les images du site. Les images trop grandes sont réduites automatiquement. Pour changer une image sur le site, utilisez le champ image du contenu concerné (réalisation, réglages…).</p>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        {FOLDERS.map(([v, l]) => <button key={v} onClick={() => setFolder(v)} aria-pressed={folder === v} className={cn("rounded-full border-2 px-4 py-2 font-bold", folder === v ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-teal")}>{l}</button>)}
        <label className="btn btn-primary ml-auto cursor-pointer !py-2.5">{busy ? "Envoi…" : "+ Téléverser des images"}<input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files)} disabled={busy} /></label>
      </div>
      {msg && <p role="status" className="mt-4 font-bold text-teal-deep">{msg}</p>}
      {files === null && <p className="mt-8 text-ink">Chargement…</p>}
      {files?.length === 0 && <div className="card mt-8 p-10 text-center text-lg text-ink">Aucune image dans ce dossier.</div>}
      <ul className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {files?.map((f) => (
          <li key={f.path} className="card overflow-hidden"><img src={f.url} alt="" className="aspect-[4/3] w-full bg-mist object-cover" loading="lazy" />
            <div className="p-3"><p className="truncate text-sm text-ink" title={f.name}>{f.name}</p><div className="mt-2 flex gap-2"><button className="flex-1 rounded-lg border border-line px-2 py-1.5 text-sm font-bold hover:bg-mist" onClick={() => copy(f.url)}>Copier l&apos;adresse</button><button className="rounded-lg px-2 py-1.5 text-sm font-bold text-red-700 hover:bg-red-50" onClick={() => del(f)}>Supprimer</button></div></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
