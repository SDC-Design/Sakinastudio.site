"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const fr = (m: string) => (/Invalid login/i.test(m) ? "E-mail ou mot de passe incorrect." : /not confirmed/i.test(m) ? "Veuillez d'abord confirmer votre adresse e-mail (lien envoyé par e-mail)." : /already registered/i.test(m) ? "Un compte existe déjà avec cet e-mail." : /Password should/i.test(m) ? "Le mot de passe doit contenir au moins 6 caractères." : m);
const STATUS: Record<string, string> = { "En cours": "bg-teal/15 text-teal-deep", "À valider": "bg-amber-100 text-amber-700", "Livré": "bg-emerald-100 text-emerald-700" };

export default function ClientArea() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<any>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => setUser(null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);
  if (user === undefined) return <p className="py-16 text-center text-lg text-ink" role="status">Chargement…</p>;
  return user ? <Dashboard user={user} /> : <AuthForm />;
}

function AuthForm() {
  const supabase = supabaseBrowser();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const fd = new FormData(e.currentTarget); const email = String(fd.get("email")).trim(); const password = String(fd.get("password") || "");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
      } else if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({ email, password, options: { data: { full_name: String(fd.get("name") || "") }, emailRedirectTo: `${location.origin}/auth/callback?next=/espace-client` } });
        if (error) throw error;
        setMsg({ ok: true, text: data.session ? "Compte créé." : "Compte créé. Consultez votre boîte e-mail pour confirmer votre adresse, puis connectez-vous." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/espace-client/reinitialiser` }); if (error) throw error;
        setMsg({ ok: true, text: "Si un compte existe pour cet e-mail, un lien de réinitialisation vient d'être envoyé." });
      }
    } catch (err: any) { setMsg({ ok: false, text: fr(err?.message || "Une erreur est survenue.") }); }
    setBusy(false);
  }
  const titles = { login: "Connexion", signup: "Créer mon compte", forgot: "Mot de passe oublié" };
  return (
    <div className="mx-auto max-w-md">
      <div className="card p-8 sm:p-10">
        <h2 className="text-3xl">{titles[mode]}</h2>
        {mode === "signup" && <p className="mt-2 text-ink">Votre agence vous associera ensuite vos projets à ce compte.</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          {mode === "signup" && <div><label className="label" htmlFor="name">Nom complet</label><input id="name" name="name" className="field" autoComplete="name" required /></div>}
          <div><label className="label" htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" className="field" autoComplete="email" required /></div>
          {mode !== "forgot" && <div><label className="label" htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" className="field" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></div>}
          {msg && <p role={msg.ok ? "status" : "alert"} className={cn("rounded-xl px-4 py-3 font-bold", msg.ok ? "bg-teal/10 text-teal-deep" : "bg-red-50 text-red-700")}>{msg.text}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Veuillez patienter…" : mode === "login" ? "Me connecter" : mode === "signup" ? "Créer mon compte" : "Envoyer le lien"}</button>
        </form>
        <div className="mt-6 flex flex-wrap justify-between gap-3 text-[0.97rem] font-bold text-teal-deep">
          {mode !== "login" && <button type="button" className="hover:underline" onClick={() => { setMode("login"); setMsg(null); }}>← Connexion</button>}
          {mode === "login" && <button type="button" className="hover:underline" onClick={() => { setMode("signup"); setMsg(null); }}>Créer un compte</button>}
          {mode === "login" && <button type="button" className="hover:underline" onClick={() => { setMode("forgot"); setMsg(null); }}>Mot de passe oublié ?</button>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user }: { user: any }) {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[] | null>(null);
  const [sel, setSel] = useState<string>("");
  useEffect(() => {
    supabase.from("profiles").select("full_name,role").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
    supabase.from("client_projects").select("*").order("position").order("created_at", { ascending: false }).then(({ data }) => { setProjects(data || []); if (data?.length) setSel(data[0].id); });
  }, [supabase, user.id]);
  const project = projects?.find((p) => p.id === sel);
  const name = profile?.full_name || user.email;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-3xl sm:text-4xl">Bonjour, {name}</h2><p className="mt-1 text-lg text-ink">Voici l&apos;avancement de vos projets.</p></div>
        <div className="flex flex-wrap gap-3">
          {profile?.role === "admin" && <Link href="/admin" className="btn btn-dark !py-2.5">Administration</Link>}
          <button className="btn btn-ghost !py-2.5" onClick={() => supabase.auth.signOut()}>Me déconnecter</button>
        </div>
      </div>
      {projects === null && <p className="mt-10 text-ink" role="status">Chargement de vos projets…</p>}
      {projects?.length === 0 && <div className="card mt-10 p-10 text-center"><h3 className="text-2xl">Aucun projet pour le moment</h3><p className="mx-auto mt-3 max-w-lg text-lg text-ink">Vos projets apparaîtront ici dès que l&apos;agence les aura associés à votre compte ({user.email}). Contactez-nous si vous attendez un accès.</p><Link href="/contact" className="btn btn-primary mt-6">Nous contacter</Link></div>}
      {projects && projects.length > 0 && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[22rem_1fr]">
          <ul className="space-y-4" aria-label="Mes projets">
            {projects.map((p) => (
              <li key={p.id}>
                <button onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className={cn("card w-full p-5 text-left transition", sel === p.id ? "border-teal ring-2 ring-teal/40" : "hover:border-teal")}>
                  <span className="flex items-start justify-between gap-3"><span className="text-lg font-bold">{p.title}</span><span className={cn("shrink-0 rounded-full px-3 py-1 text-sm font-bold", STATUS[p.status] || "bg-mist text-ink")}>{p.status}</span></span>
                  <span className="mt-4 block h-2 rounded-full bg-line"><span className="block h-2 rounded-full bg-teal" style={{ width: `${p.progress}%` }} /></span>
                  <span className="mt-2 block text-sm text-ink">{p.progress} % {p.due_date ? `· livraison prévue le ${new Date(p.due_date).toLocaleDateString("fr-FR")}` : ""}</span>
                </button>
              </li>
            ))}
          </ul>
          {project && <ProjectDetail key={project.id} project={project} user={user} />}
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project, user }: { project: any; user: any }) {
  const supabase = supabaseBrowser();
  const [files, setFiles] = useState<any[]>([]); const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const loadMessages = useCallback(async () => { const { data } = await supabase.from("client_messages").select("*").eq("project_id", project.id).order("created_at"); setMessages(data || []); }, [supabase, project.id]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("client_files").select("*").eq("project_id", project.id).order("created_at", { ascending: false });
      const withUrls = await Promise.all((data || []).map(async (f) => ({ ...f, url: (await supabase.storage.from("client-files").createSignedUrl(f.storage_path, 3600)).data?.signedUrl })));
      setFiles(withUrls);
    })();
    loadMessages(); const t = setInterval(loadMessages, 20000); return () => clearInterval(t);
  }, [supabase, project.id, loadMessages]);
  async function send(e: React.FormEvent) {
    e.preventDefault(); if (!text.trim()) return; setBusy(true); setErr("");
    const { error } = await supabase.from("client_messages").insert({ project_id: project.id, sender: "client", body: text.trim(), author_id: user.id });
    if (error) setErr("Le message n'a pas pu être envoyé."); else { setText(""); await loadMessages(); }
    setBusy(false);
  }
  return (
    <div className="space-y-8">
      <section className="card p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl">{project.title}</h3><span className={cn("rounded-full px-4 py-1.5 font-bold", STATUS[project.status] || "bg-mist text-ink")}>{project.status}</span></div>
        {project.description && <p className="prose-lines mt-4 text-lg text-ink">{project.description}</p>}
        <div className="mt-5 h-3 rounded-full bg-line" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement"><div className="h-3 rounded-full bg-teal" style={{ width: `${project.progress}%` }} /></div>
      </section>
      <section className="card p-7" aria-labelledby="fichiers">
        <h3 id="fichiers" className="text-2xl">Fichiers</h3>
        {files.length === 0 ? <p className="mt-3 text-ink">Aucun fichier disponible pour le moment.</p> : (
          <ul className="mt-5 divide-y divide-line">{files.map((f) => (<li key={f.id} className="flex items-center justify-between gap-4 py-3.5"><span className="font-bold">{f.name}</span>{f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" download className="btn btn-primary !px-5 !py-2.5 !text-base">Télécharger</a> : <span className="text-ink">Indisponible</span>}</li>))}</ul>
        )}
      </section>
      <section className="card p-7" aria-labelledby="messages">
        <h3 id="messages" className="text-2xl">Messages</h3>
        <ul className="mt-5 max-h-96 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && <li className="text-ink">Aucun message. Écrivez-nous ci-dessous.</li>}
          {messages.map((m) => (
            <li key={m.id} className={cn("max-w-[85%] rounded-2xl px-5 py-3.5", m.sender === "client" ? "ml-auto bg-teal/15" : "bg-mist")}>
              <p className="text-sm font-bold text-teal-deep">{m.sender === "client" ? "Vous" : "Sakina Studio"} · {new Date(m.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</p>
              <p className="prose-lines mt-1 text-lg">{m.body}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={send} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="msg" className="sr-only">Votre message</label>
          <textarea id="msg" value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={4000} className="field flex-1" placeholder="Votre message à l'équipe…" />
          <button className="btn btn-primary sm:self-end" disabled={busy || !text.trim()}>Envoyer</button>
        </form>
        {err && <p role="alert" className="mt-3 font-bold text-red-700">{err}</p>}
      </section>
    </div>
  );
}
