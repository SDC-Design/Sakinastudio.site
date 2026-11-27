"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { FieldInput, fromDraft, toDraft, type FieldDef, type Opt } from "./Fields";
import { revalidateSite } from "./api";
import { slugify, cn } from "@/lib/utils";

type Props = {
  table: string; title: string; intro?: string; singular: string; fields: FieldDef[];
  titleKey?: string; subtitleKey?: string; imageKey?: string; filter?: Record<string, any>; defaults?: Record<string, any>;
  reorder?: boolean; publishable?: boolean; orderBy?: string; ascending?: boolean; extraActions?: { label: string; onClick: (row: any) => void }[]; hideHeader?: boolean; affectsSite?: boolean;
};

export default function CrudManager({ table, title, intro, singular, fields, titleKey = "title", subtitleKey, imageKey, filter, defaults, reorder = true, publishable = true, orderBy = "position", ascending = true, extraActions, hideHeader, affectsSite = true }: Props) {
  const supabase = supabaseBrowser();
  const [rows, setRows] = useState<any[] | null>(null); const [error, setError] = useState("");
  const [draft, setDraft] = useState<any | null>(null); const [saving, setSaving] = useState(false);
  const [dyn, setDyn] = useState<Record<string, Opt[]>>({});

  const load = useCallback(async () => {
    let q: any = supabase.from(table).select("*"); if (filter) q = q.match(filter);
    const { data, error: e } = await q.order(orderBy, { ascending });
    if (e) { setError(/relation .* does not exist|schema cache/i.test(e.message) ? "La base de données n'est pas encore installée : exécutez supabase/schema.sql dans Supabase (voir le guide)." : e.message); setRows([]); } else { setError(""); setRows(data || []); }
  }, [supabase, table, orderBy, ascending, JSON.stringify(filter)]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fields.filter((f) => f.optionsFrom).forEach(async (f) => {
      const o = f.optionsFrom!; const { data } = await supabase.from(o.table).select(`${o.value},${o.label}`);
      setDyn((d) => ({ ...d, [f.key]: (data || []).map((r: any) => ({ value: r[o.value], label: r[o.label] || r[o.value] })) }));
    });
  }, [supabase, fields]);

  const done = async () => { await load(); if (affectsSite) await revalidateSite(); };
  const openNew = () => setDraft({ ...toDraft(fields, {}), ...(defaults || {}), published: true, __new: true });
  const openEdit = (r: any) => setDraft({ ...toDraft(fields, r), id: r.id, published: r.published });

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!draft) return; setError("");
    for (const f of fields) if (f.required && !String(draft[f.key] ?? "").trim() && f.type !== "slug") { setError(`Le champ « ${f.label} » est obligatoire.`); return; }
    const d = { ...draft };
    for (const f of fields) if (f.type === "slug" && !String(d[f.key] || "").trim() && f.slugFrom) d[f.key] = slugify(d[f.slugFrom]);
    const payload: any = { ...fromDraft(fields, d), ...(filter || {}) };
    if (publishable) payload.published = !!draft.published;
    setSaving(true);
    const dup = (m: string) => (m.includes("duplicate") ? "Cette adresse (slug) existe déjà : modifiez-la." : m);
    if (draft.__new) {
      if (reorder) payload.position = (rows || []).reduce((m, r) => Math.max(m, r.position ?? 0), -1) + 1;
      const { error: err } = await supabase.from(table).insert(payload);
      if (err) { setError(dup(err.message)); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from(table).update(payload).eq("id", draft.id);
      if (err) { setError(dup(err.message)); setSaving(false); return; }
    }
    setSaving(false); setDraft(null); await done();
  }
  async function remove(r: any) {
    if (!confirm(`Supprimer définitivement « ${r[titleKey] || singular} » ?`)) return;
    const { error: err } = await supabase.from(table).delete().eq("id", r.id); if (err) setError(err.message); else await done();
  }
  async function togglePub(r: any) { await supabase.from(table).update({ published: !r.published }).eq("id", r.id); await done(); }
  async function move(i: number, dir: -1 | 1) {
    if (!rows) return; const a = [...rows]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]];
    setRows(a); await Promise.all(a.map((r, k) => supabase.from(table).update({ position: k }).eq("id", r.id))); await done();
  }

  return (
    <section>
      {!hideHeader && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-3xl sm:text-4xl">{title}</h1>{intro && <p className="mt-2 max-w-2xl text-lg text-ink">{intro}</p>}</div>
          <button className="btn btn-primary" onClick={openNew}>+ Ajouter {singular}</button>
        </div>
      )}
      {hideHeader && <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl">{title}</h2><button className="btn btn-primary !py-2.5" onClick={openNew}>+ Ajouter {singular}</button></div>}
      {error && !draft && <p role="alert" className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-bold text-red-700">{error}</p>}
      {rows === null && <p className="text-ink" role="status">Chargement…</p>}
      {rows && rows.length === 0 && !error && <div className="card p-10 text-center"><p className="text-lg text-ink">Aucun élément pour le moment.</p><button className="btn btn-primary mt-5" onClick={openNew}>+ Ajouter {singular}</button></div>}
      <ul className="space-y-3">
        {rows?.map((r, i) => (
          <li key={r.id} className={cn("card flex flex-wrap items-center gap-4 p-4", r.published === false && "opacity-70")}>
            {imageKey && <img src={r[imageKey] || "/placeholders/avatar.svg"} alt="" className="h-16 w-20 shrink-0 rounded-lg bg-mist object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold">{r[titleKey] || "(sans titre)"} {r.published === false && <span className="ml-2 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">Masqué</span>}</p>
              {subtitleKey && <p className="truncate text-ink">{String(r[subtitleKey] ?? "")}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {reorder && <><button className="rounded-lg border border-line px-3 py-2 font-bold hover:bg-mist disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Monter">↑</button><button className="rounded-lg border border-line px-3 py-2 font-bold hover:bg-mist disabled:opacity-30" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Descendre">↓</button></>}
              {publishable && <button className="rounded-lg border border-line px-3.5 py-2 font-bold hover:bg-mist" onClick={() => togglePub(r)}>{r.published === false ? "Publier" : "Masquer"}</button>}
              {extraActions?.map((a) => <button key={a.label} className="rounded-lg border border-teal px-3.5 py-2 font-bold text-teal-deep hover:bg-teal/10" onClick={() => a.onClick(r)}>{a.label}</button>)}
              <button className="rounded-lg bg-navy px-4 py-2 font-bold text-white hover:bg-night" onClick={() => openEdit(r)}>Modifier</button>
              <button className="rounded-lg px-3.5 py-2 font-bold text-red-700 hover:bg-red-50" onClick={() => remove(r)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>

      {draft && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-night/60" role="dialog" aria-modal="true" aria-label={draft.__new ? `Ajouter ${singular}` : `Modifier ${singular}`}>
          <form onSubmit={save} className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-7 py-5"><h2 className="text-2xl">{draft.__new ? `Ajouter ${singular}` : `Modifier ${singular}`}</h2><button type="button" onClick={() => { setDraft(null); setError(""); }} className="rounded-full px-3 py-1 text-3xl leading-none hover:bg-mist" aria-label="Fermer">×</button></div>
            <div className="grid flex-1 content-start gap-6 overflow-y-auto px-7 py-7 sm:grid-cols-2">
              {fields.map((f) => <FieldInput key={f.key} f={f} value={draft[f.key]} opts={dyn[f.key]} onChange={(v) => setDraft((d: any) => ({ ...d, [f.key]: v }))} />)}
              {publishable && <div className="sm:col-span-2"><span className="label">Visible sur le site</span><FieldInput f={{ key: "published", label: "", type: "boolean" }} value={draft.published} onChange={(v) => setDraft((d: any) => ({ ...d, published: v }))} /></div>}
            </div>
            <div className="border-t border-line bg-mist px-7 py-5">
              {error && <p role="alert" className="mb-3 font-bold text-red-700">{error}</p>}
              <div className="flex flex-wrap justify-end gap-3"><button type="button" className="btn btn-ghost !py-2.5" onClick={() => { setDraft(null); setError(""); }}>Annuler</button><button className="btn btn-primary !py-2.5" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button></div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
