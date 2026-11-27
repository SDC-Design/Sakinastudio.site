"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import CrudManager from "./CrudManager";
import type { FieldDef } from "./Fields";
import { cn } from "@/lib/utils";

const PROJECT_FIELDS: FieldDef[] = [
  { key: "title", label: "Nom du projet", type: "text", required: true }, { key: "description", label: "Description visible par le client", type: "textarea", rows: 4 },
  { key: "status", label: "Statut", type: "select", options: ["En cours", "À valider", "Livré", "En pause"].map((v) => ({ value: v, label: v })) },
  { key: "progress", label: "Avancement (0 à 100 %)", type: "number" }, { key: "due_date", label: "Livraison prévue", type: "date" },
];

export default function ClientsManager() {
  const supabase = supabaseBrowser();
  const [clients, setClients] = useState<any[] | null>(null); const [sel, setSel] = useState<any>(null); const [project, setProject] = useState<any>(null); const [error, setError] = useState("");
  useEffect(() => {
    supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false }).then(({ data, error: e }) => { if (e) setError(e.message); setClients(data || []); });
  }, [supabase]);
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Clients et projets</h1>
      <p className="mt-2 max-w-3xl text-lg text-ink">Vos clients créent eux-mêmes leur compte depuis la page « Espace client » du site. Ils apparaissent ici : choisissez un client pour lui associer des projets, des fichiers à télécharger et lui répondre.</p>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-5 py-4 font-bold text-red-700">{error}</p>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[20rem_1fr]">
        <aside aria-label="Liste des clients">
          <h2 className="text-xl">Clients inscrits</h2>
          {clients === null && <p className="mt-3 text-ink">Chargement…</p>}
          {clients?.length === 0 && <p className="card mt-4 p-5 text-ink">Aucun client inscrit pour le moment.</p>}
          <ul className="mt-4 space-y-2">{clients?.map((c) => (
            <li key={c.id}><button onClick={() => { setSel(c); setProject(null); }} aria-pressed={sel?.id === c.id} className={cn("card w-full p-4 text-left transition", sel?.id === c.id ? "border-teal ring-2 ring-teal/40" : "hover:border-teal")}><span className="block font-bold">{c.full_name || "(sans nom)"}</span><span className="block truncate text-ink">{c.email}</span></button></li>
          ))}</ul>
        </aside>
        <div>
          {!sel ? <div className="card p-10 text-center text-lg text-ink">Sélectionnez un client à gauche.</div> : (
            <div className="space-y-10">
              <CrudManager key={sel.id} hideHeader table="client_projects" title={`Projets de ${sel.full_name || sel.email}`} singular="un projet" fields={PROJECT_FIELDS} filter={{ client_id: sel.id }} publishable={false} affectsSite={false}
                subtitleKey="status" extraActions={[{ label: "Fichiers et messages", onClick: (r) => setProject(r) }]} />
              {project && <Workspace key={project.id} project={project} onClose={() => setProject(null)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Workspace({ project, onClose }: { project: any; onClose: () => void }) {
  const supabase = supabaseBrowser();
  const [files, setFiles] = useState<any[]>([]); const [msgs, setMsgs] = useState<any[]>([]); const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const load = useCallback(async () => {
    setFiles((await supabase.from("client_files").select("*").eq("project_id", project.id).order("created_at", { ascending: false })).data || []);
    setMsgs((await supabase.from("client_messages").select("*").eq("project_id", project.id).order("created_at")).data || []);
  }, [supabase, project.id]);
  useEffect(() => { load(); }, [load]);
  async function upload(list: FileList | null) {
    if (!list?.length) return; setBusy(true); setErr("");
    for (const f of Array.from(list)) {
      const safe = f.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_"); const path = `${project.client_id}/${project.id}/${Date.now()}-${safe}`;
      const up = await supabase.storage.from("client-files").upload(path, f); if (up.error) { setErr(up.error.message); continue; }
      await supabase.from("client_files").insert({ project_id: project.id, name: f.name, storage_path: path });
    }
    setBusy(false); load();
  }
  async function delFile(f: any) { if (!confirm(`Supprimer « ${f.name} » ?`)) return; await supabase.storage.from("client-files").remove([f.storage_path]); await supabase.from("client_files").delete().eq("id", f.id); load(); }
  async function send(e: React.FormEvent) { e.preventDefault(); if (!text.trim()) return; const { error } = await supabase.from("client_messages").insert({ project_id: project.id, sender: "agence", body: text.trim() }); if (error) setErr(error.message); else { setText(""); load(); } }
  return (
    <section className="card p-7" aria-label={`Fichiers et messages : ${project.title}`}>
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl">{project.title}</h2><button className="btn btn-ghost !py-2" onClick={onClose}>Fermer</button></div>
      {err && <p role="alert" className="mt-4 font-bold text-red-700">{err}</p>}
      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <div>
          <h3 className="text-xl">Fichiers livrables</h3>
          <ul className="mt-3 divide-y divide-line">{files.map((f) => <li key={f.id} className="flex items-center justify-between gap-3 py-2.5"><span className="truncate font-bold">{f.name}</span><button className="rounded-lg px-3 py-1.5 font-bold text-red-700 hover:bg-red-50" onClick={() => delFile(f)}>Supprimer</button></li>)}{files.length === 0 && <li className="py-3 text-ink">Aucun fichier.</li>}</ul>
          <label className="btn btn-dark mt-4 cursor-pointer !py-2.5">{busy ? "Envoi…" : "+ Ajouter des fichiers"}<input type="file" multiple className="sr-only" onChange={(e) => upload(e.target.files)} disabled={busy} /></label>
        </div>
        <div>
          <h3 className="text-xl">Messages</h3>
          <ul className="mt-3 max-h-72 space-y-3 overflow-y-auto">{msgs.map((m) => <li key={m.id} className={cn("max-w-[90%] rounded-2xl px-4 py-3", m.sender === "agence" ? "ml-auto bg-navy text-white" : "bg-mist")}><p className="text-xs font-bold opacity-75">{m.sender === "agence" ? "Vous (agence)" : "Client"} · {new Date(m.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</p><p className="prose-lines">{m.body}</p></li>)}{msgs.length === 0 && <li className="text-ink">Aucun message.</li>}</ul>
          <form onSubmit={send} className="mt-4 flex gap-3"><label htmlFor="rep" className="sr-only">Réponse</label><textarea id="rep" className="field" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Répondre au client…" /><button className="btn btn-primary self-end !py-2.5">Envoyer</button></form>
        </div>
      </div>
    </section>
  );
}
