"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn, waLink, telLink } from "@/lib/utils";

const STATUS = [["nouvelle", "Nouvelle"], ["en_cours", "En cours"], ["traitee", "Traitée"], ["archivee", "Archivée"]] as const;
const COLORS: Record<string, string> = { nouvelle: "bg-teal/20 text-teal-deep", en_cours: "bg-amber-100 text-amber-800", traitee: "bg-emerald-100 text-emerald-800", archivee: "bg-slate-200 text-slate-600" };

export default function LeadsManager() {
  const supabase = supabaseBrowser();
  const [rows, setRows] = useState<any[] | null>(null); const [filter, setFilter] = useState(""); const [error, setError] = useState(""); const [open, setOpen] = useState<string>("");
  const load = useCallback(async () => {
    const { data, error: e } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (e) { setError(e.message); setRows([]); } else { setError(""); setRows(data || []); }
  }, [supabase]);
  useEffect(() => { load(); }, [load]);
  async function setStatus(id: string, status: string) { await supabase.from("leads").update({ status }).eq("id", id); load(); }
  async function remove(r: any) {
    if (!confirm(`Supprimer la demande de ${r.name} ?`)) return;
    if (r.attachment_path) await supabase.storage.from("attachments").remove([r.attachment_path]);
    await supabase.from("leads").delete().eq("id", r.id); load();
  }
  async function attachment(r: any) { const { data } = await supabase.storage.from("attachments").createSignedUrl(r.attachment_path, 600); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }
  const shown = (rows || []).filter((r) => !filter || r.status === filter);
  const filters: [string, string][] = [["", "Toutes"], ...STATUS.map((s) => [s[0], s[1]] as [string, string])];
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Demandes de devis</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink">Les messages envoyés depuis le formulaire de contact du site.</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map(([v, l]) => <button key={v} onClick={() => setFilter(v)} aria-pressed={filter === v} className={cn("rounded-full border-2 px-4 py-2 font-bold", filter === v ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-teal")}>{l} ({v ? (rows || []).filter((r) => r.status === v).length : rows?.length ?? 0})</button>)}
      </div>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-5 py-4 font-bold text-red-700">{error}</p>}
      {rows && shown.length === 0 && !error && <div className="card mt-8 p-10 text-center text-lg text-ink">Aucune demande pour le moment.</div>}
      <ul className="mt-6 space-y-4">
        {shown.map((r) => (
          <li key={r.id} className="card p-5">
            <button className="flex w-full flex-wrap items-center justify-between gap-3 text-left" onClick={() => setOpen(open === r.id ? "" : r.id)} aria-expanded={open === r.id}>
              <span><span className="text-xl font-bold">{r.name}</span><span className="ml-3 text-ink">{new Date(r.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}</span></span>
              <span className="flex items-center gap-3">{r.service && <span className="hidden text-ink sm:inline">{r.service}</span>}<span className={cn("rounded-full px-3.5 py-1 text-sm font-bold", COLORS[r.status])}>{STATUS.find((s) => s[0] === r.status)?.[1]}</span></span>
            </button>
            {open === r.id && (
              <div className="mt-5 space-y-5 border-t border-line pt-5">
                <dl className="grid gap-4 text-lg sm:grid-cols-2">
                  {r.phone && <div><dt className="text-sm font-bold text-teal-deep">Téléphone</dt><dd><a className="font-bold underline" href={telLink(r.phone)}>{r.phone}</a></dd></div>}
                  {r.email && <div><dt className="text-sm font-bold text-teal-deep">E-mail</dt><dd><a className="font-bold underline" href={`mailto:${r.email}`}>{r.email}</a></dd></div>}
                  {r.service && <div><dt className="text-sm font-bold text-teal-deep">Service</dt><dd>{r.service}</dd></div>}
                  {r.budget && <div><dt className="text-sm font-bold text-teal-deep">Budget</dt><dd>{r.budget}</dd></div>}
                </dl>
                <div><p className="text-sm font-bold text-teal-deep">Message</p><p className="prose-lines mt-1 rounded-xl bg-mist p-4 text-lg">{r.message}</p></div>
                <div className="flex flex-wrap items-center gap-3">
                  {r.phone && <a className="btn btn-primary !py-2.5" target="_blank" rel="noopener noreferrer" href={waLink(r.phone, `Bonjour ${r.name}, merci pour votre demande.`)}>Répondre sur WhatsApp</a>}
                  {r.email && <a className="btn btn-dark !py-2.5" href={`mailto:${r.email}?subject=${encodeURIComponent("Votre demande de devis")}`}>Répondre par e-mail</a>}
                  {r.attachment_path && <button className="btn btn-ghost !py-2.5" onClick={() => attachment(r)}>Ouvrir le fichier joint</button>}
                  <label className="ml-auto flex items-center gap-2 font-bold">Statut
                    <select className="field !w-auto !py-2" value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  </label>
                  <button className="rounded-xl px-4 py-2.5 font-bold text-red-700 hover:bg-red-50" onClick={() => remove(r)}>Supprimer</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
