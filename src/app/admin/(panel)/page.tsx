import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await supabaseServer();
  const count = async (t: string, f?: (q: any) => any) => { let q: any = supabase.from(t).select("id", { count: "exact", head: true }); if (f) q = f(q); const { count: c } = await q; return c ?? 0; };
  const [newLeads, leads, projects, services, clients] = await Promise.all([count("leads", (q) => q.eq("status", "nouvelle")), count("leads"), count("projects"), count("services"), count("profiles", (q) => q.eq("role", "client"))]);
  const { data: latest } = await supabase.from("leads").select("id,name,service,created_at,status").order("created_at", { ascending: false }).limit(5);
  const stats = [["Nouvelles demandes", newLeads, "/admin/demandes"], ["Demandes au total", leads, "/admin/demandes"], ["Réalisations", projects, "/admin/projets"], ["Services", services, "/admin/services"], ["Clients inscrits", clients, "/admin/clients"]];
  const shortcuts = [["/admin/parametres", "Modifier les textes et coordonnées"], ["/admin/projets", "Ajouter une réalisation"], ["/admin/medias", "Gérer les images"], ["/admin/clients", "Suivre un projet client"]];
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Tableau de bord</h1>
      <p className="mt-2 text-lg text-ink">Bienvenue dans l&apos;administration de Sakina Studio.</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{stats.map(([l, n, h]: any) => (<li key={l}><Link href={h} className="card block p-5 transition hover:border-teal"><span className="block text-4xl font-bold text-navy">{n}</span><span className="mt-1 block font-bold text-ink">{l}</span></Link></li>))}</ul>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="card p-7"><h2 className="text-2xl">Accès rapides</h2><ul className="mt-5 space-y-3">{shortcuts.map(([h, l]) => <li key={h}><Link href={h} className="flex items-center justify-between rounded-xl border border-line px-5 py-3.5 text-lg font-bold hover:border-teal hover:bg-teal/5">{l}<span aria-hidden="true">→</span></Link></li>)}</ul></section>
        <section className="card p-7"><div className="flex items-center justify-between"><h2 className="text-2xl">Dernières demandes</h2><Link href="/admin/demandes" className="font-bold text-teal-deep hover:underline">Tout voir</Link></div>
          {!latest?.length ? <p className="mt-5 text-ink">Aucune demande pour le moment.</p> : <ul className="mt-5 divide-y divide-line">{latest.map((l: any) => <li key={l.id} className="flex items-center justify-between gap-3 py-3"><span><span className="block font-bold">{l.name}</span><span className="text-ink">{l.service || "Service non précisé"}</span></span><span className="text-sm text-ink">{new Date(l.created_at).toLocaleDateString("fr-FR")}</span></li>)}</ul>}
        </section>
      </div>
    </div>
  );
}
