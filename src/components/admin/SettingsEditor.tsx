"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { DEFAULTS } from "@/lib/defaults";
import { FieldInput, fromDraft, toDraft } from "./Fields";
import { SETTINGS_SCHEMA } from "./schema";
import { revalidateSite } from "./api";
import { cn } from "@/lib/utils";

export default function SettingsEditor() {
  const supabase = supabaseBrowser();
  const [active, setActive] = useState(SETTINGS_SCHEMA[0].key);
  const [drafts, setDrafts] = useState<Record<string, any> | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null); const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) setMsg({ ok: false, text: /relation|schema cache/i.test(error.message) ? "La base de données n'est pas encore installée : exécutez supabase/schema.sql puis supabase/seed.sql dans Supabase." : error.message });
      const d: Record<string, any> = {};
      for (const g of SETTINGS_SCHEMA) { const row = data?.find((r: any) => r.key === g.key); d[g.key] = toDraft(g.fields, { ...DEFAULTS[g.key], ...(row?.value || {}) }); }
      setDrafts(d);
    })();
  }, [supabase]);

  const group = SETTINGS_SCHEMA.find((g) => g.key === active)!;
  async function save() {
    if (!drafts) return; setSaving(true); setMsg(null);
    const raw = fromDraft(group.fields, drafts[active]); const value: any = {}; for (const k in raw) value[k] = raw[k] === null ? "" : raw[k];
    const { error } = await supabase.from("site_settings").upsert({ key: active, value, updated_at: new Date().toISOString() });
    if (error) setMsg({ ok: false, text: error.message }); else { await revalidateSite(); setMsg({ ok: true, text: "Modifications enregistrées. Le site public est à jour." }); }
    setSaving(false);
  }
  function reset() { if (confirm("Rétablir les textes d'origine de cet onglet ? Vos modifications non enregistrées seront perdues.")) setDrafts((d: any) => ({ ...d, [active]: toDraft(group.fields, DEFAULTS[active]) })); }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Réglages du site</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink">Modifiez ici tous les textes, coordonnées et visuels du site. Choisissez un onglet, modifiez, puis enregistrez.</p>
      <div role="tablist" aria-label="Groupes de réglages" className="mt-8 flex flex-wrap gap-2">
        {SETTINGS_SCHEMA.map((g) => (
          <button key={g.key} role="tab" aria-selected={active === g.key} onClick={() => { setActive(g.key); setMsg(null); }} className={cn("rounded-full border-2 px-5 py-2.5 font-bold transition", active === g.key ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-teal")}>{g.label}</button>
        ))}
      </div>
      {!drafts ? <p className="mt-10 text-ink" role="status">Chargement…</p> : (
        <form key={active} onSubmit={(e) => { e.preventDefault(); save(); }} className="card mt-6 p-7 sm:p-9">
          <h2 className="text-2xl">{group.label}</h2>{group.intro && <p className="mt-2 text-lg text-ink">{group.intro}</p>}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {group.fields.map((f) => <FieldInput key={f.key} f={{ ...f, key: `${active}_${f.key}` }} value={drafts[active][f.key]} onChange={(v) => setDrafts((d: any) => ({ ...d, [active]: { ...d[active], [f.key]: v } }))} />)}
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <button className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer cet onglet"}</button>
            <button type="button" className="btn btn-ghost" onClick={reset}>Rétablir les textes d&apos;origine</button>
            {msg && <p role={msg.ok ? "status" : "alert"} className={cn("font-bold", msg.ok ? "text-teal-deep" : "text-red-700")}>{msg.text}</p>}
          </div>
        </form>
      )}
      {drafts && msg && !msg.ok && <p role="alert" className="mt-4 font-bold text-red-700">{msg.text}</p>}
    </div>
  );
}
