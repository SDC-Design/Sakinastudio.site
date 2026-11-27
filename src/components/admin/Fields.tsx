"use client";
import { useRef, useState } from "react";
import { uploadImage } from "./api";
import { ICON_OPTIONS } from "@/components/ServiceIcon";
import { cn } from "@/lib/utils";

export type Opt = { value: string; label: string };
export type FieldDef = {
  key: string; label: string;
  type: "text" | "textarea" | "number" | "select" | "boolean" | "image" | "images" | "lines" | "date" | "url" | "email" | "slug" | "icon";
  help?: string; placeholder?: string; options?: Opt[]; optionsFrom?: { table: string; value: string; label: string };
  rows?: number; folder?: string; required?: boolean; slugFrom?: string; wide?: boolean;
};

export function ImageInput({ value, onChange, folder = "general", label }: { value: string; onChange: (v: string) => void; folder?: string; label: string }) {
  const ref = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function pick(files: FileList | null) {
    if (!files?.[0]) return; setBusy(true); setErr("");
    try { onChange(await uploadImage(files[0], folder)); } catch (e: any) { setErr(e.message || "Échec du téléversement"); }
    setBusy(false); if (ref.current) ref.current.value = "";
  }
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] [background-size:16px_16px]">
        {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <span className="px-2 text-center text-sm text-ink">Aucune image</span>}
      </div>
      <div className="min-w-[14rem] flex-1 space-y-2.5">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-dark !px-4 !py-2 !text-base" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "Envoi…" : value ? "Remplacer" : "Téléverser"}</button>
          {value && <button type="button" className="btn btn-ghost !px-4 !py-2 !text-base" onClick={() => onChange("")}>Retirer</button>}
        </div>
        <input ref={ref} type="file" accept="image/*" className="sr-only" aria-label={`Choisir : ${label}`} onChange={(e) => pick(e.target.files)} />
        <input className="field !py-2 !text-sm" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="ou coller l'adresse (URL) d'une image" aria-label={`Adresse de l'image : ${label}`} />
        {err && <p role="alert" className="text-sm font-bold text-red-700">{err}</p>}
      </div>
    </div>
  );
}

function ImagesInput({ value, onChange, folder, label }: { value: string[]; onChange: (v: string[]) => void; folder?: string; label: string }) {
  const ref = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const list = value || [];
  async function add(files: FileList | null) {
    if (!files?.length) return; setBusy(true); setErr("");
    try { const urls: string[] = []; for (const f of Array.from(files)) urls.push(await uploadImage(f, folder)); onChange([...list, ...urls]); } catch (e: any) { setErr(e.message || "Échec du téléversement"); }
    setBusy(false); if (ref.current) ref.current.value = "";
  }
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {list.map((u, i) => (
          <li key={u + i} className="relative overflow-hidden rounded-xl border border-line bg-mist">
            <img src={u} alt="" className="aspect-square w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-night/80 p-1.5 text-white">
              <button type="button" className="rounded px-2 py-0.5 text-sm hover:bg-white/20 disabled:opacity-30" disabled={i === 0} onClick={() => { const a = [...list]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange(a); }} aria-label="Déplacer avant">←</button>
              <button type="button" className="rounded px-2 py-0.5 text-sm hover:bg-red-500" onClick={() => onChange(list.filter((_, k) => k !== i))} aria-label="Retirer l'image">Retirer</button>
              <button type="button" className="rounded px-2 py-0.5 text-sm hover:bg-white/20 disabled:opacity-30" disabled={i === list.length - 1} onClick={() => { const a = [...list]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; onChange(a); }} aria-label="Déplacer après">→</button>
            </div>
          </li>
        ))}
        <li><button type="button" onClick={() => ref.current?.click()} disabled={busy} className="grid aspect-square w-full place-items-center rounded-xl border-2 border-dashed border-teal/60 text-center text-sm font-bold text-teal-deep hover:bg-teal/10">{busy ? "Envoi…" : "+ Ajouter des images"}</button></li>
      </ul>
      <input ref={ref} type="file" multiple accept="image/*" className="sr-only" aria-label={`Ajouter des images : ${label}`} onChange={(e) => add(e.target.files)} />
      {err && <p role="alert" className="mt-2 text-sm font-bold text-red-700">{err}</p>}
    </div>
  );
}

export function FieldInput({ f, value, onChange, opts }: { f: FieldDef; value: any; onChange: (v: any) => void; opts?: Opt[] }) {
  const id = "f-" + f.key; const wide = f.wide || ["textarea", "lines", "image", "images"].includes(f.type);
  const input = (() => {
    switch (f.type) {
      case "textarea": return <textarea id={id} className="field" rows={f.rows || 4} value={value ?? ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
      case "lines": return <textarea id={id} className="field" rows={f.rows || 4} value={value ?? ""} placeholder={f.placeholder || "Un élément par ligne"} onChange={(e) => onChange(e.target.value)} />;
      case "number": return <input id={id} type="number" className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
      case "date": return <input id={id} type="date" className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
      case "boolean": return (
        <button id={id} type="button" role="switch" aria-checked={!!value} onClick={() => onChange(!value)} className="flex items-center gap-3">
          <span className={cn("relative h-7 w-12 rounded-full transition", value ? "bg-teal" : "bg-slate-300")}><span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all", value ? "left-[1.4rem]" : "left-0.5")} /></span>
          <span className="font-bold">{value ? "Oui" : "Non"}</span>
        </button>);
      case "select": case "icon": {
        const o = f.type === "icon" ? ICON_OPTIONS : opts || f.options || [];
        return <select id={id} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)}><option value="">— Choisir —</option>{o.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>;
      }
      case "image": return <ImageInput value={value || ""} onChange={onChange} folder={f.folder} label={f.label} />;
      case "images": return <ImagesInput value={value || []} onChange={onChange} folder={f.folder} label={f.label} />;
      default: return <input id={id} type={f.type === "url" ? "url" : f.type === "email" ? "email" : "text"} className="field" value={value ?? ""} placeholder={f.placeholder || (f.type === "slug" ? "généré automatiquement depuis le titre" : undefined)} onChange={(e) => onChange(e.target.value)} />;
    }
  })();
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      {f.label && <label htmlFor={id} className="label">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>}
      {input}
      {f.help && <p className="mt-1.5 text-sm text-ink">{f.help}</p>}
    </div>
  );
}

/** Conversion valeurs de la base ⇄ valeurs du formulaire (listes en lignes de texte, etc.). */
export function toDraft(fields: FieldDef[], row: any) {
  const d: any = { ...row };
  for (const f of fields) {
    const v = row?.[f.key];
    d[f.key] = f.type === "lines" ? (Array.isArray(v) ? v.join("\n") : v ?? "") : f.type === "images" ? v || [] : f.type === "boolean" ? !!v : v ?? "";
  }
  return d;
}
export function fromDraft(fields: FieldDef[], d: any) {
  const out: any = {};
  for (const f of fields) {
    const v = d[f.key];
    if (f.type === "lines") out[f.key] = String(v || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
    else if (f.type === "images") out[f.key] = (v || []).filter(Boolean);
    else if (f.type === "number") out[f.key] = v === "" || v == null ? null : Number(v);
    else if (f.type === "boolean") out[f.key] = !!v;
    else out[f.key] = f.required ? String(v ?? "").trim() : String(v ?? "").trim() || null;
  }
  return out;
}
