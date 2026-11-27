"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const GROUPS = [
  { title: "Aperçu", items: [["/admin", "Tableau de bord"], ["/admin/demandes", "Demandes de devis"], ["/admin/clients", "Clients et projets"]] },
  { title: "Contenu du site", items: [["/admin/parametres", "Réglages et textes"], ["/admin/services", "Services"], ["/admin/projets", "Réalisations"], ["/admin/categories", "Catégories"], ["/admin/methode", "Méthode de travail"], ["/admin/valeurs", "Valeurs"], ["/admin/equipe", "Équipe"], ["/admin/temoignages", "Témoignages"], ["/admin/medias", "Médiathèque"]] },
];
export function SignOut({ className }: { className?: string }) {
  const router = useRouter();
  return <button className={className} onClick={async () => { await supabaseBrowser().auth.signOut(); router.push("/admin/login"); router.refresh(); }}>Se déconnecter</button>;
}
export default function AdminNav({ name }: { name: string }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const nav = (
    <nav aria-label="Administration" className="space-y-7">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="px-3 text-sm font-bold text-bright">{g.title}</p>
          <ul className="mt-2 space-y-1">{g.items.map(([href, label]) => (
            <li key={href}><Link href={href} onClick={() => setOpen(false)} aria-current={path === href ? "page" : undefined} className={cn("block rounded-xl px-3 py-2.5 text-[1.02rem] font-bold text-white/80 transition hover:bg-white/10 hover:text-white", path === href && "bg-white/15 text-white")}>{label}</Link></li>
          ))}</ul>
        </div>
      ))}
    </nav>
  );
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-night px-5 py-3 text-white lg:hidden">
        <span className="font-bold">Administration</span>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="rounded-lg border border-white/30 px-4 py-2 font-bold">{open ? "Fermer" : "Menu"}</button>
      </div>
      {open && <div className="bg-night px-5 pb-6 lg:hidden">{nav}<SignOut className="mt-6 rounded-xl border border-white/30 px-4 py-2.5 font-bold text-white" /></div>}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-between overflow-y-auto bg-night p-6 text-white lg:flex">
        <div>
          <Link href="/admin" aria-label="Administration"><img src="/brand/logo-dark.svg" alt="Sakina Studio" className="h-12 w-auto" /></Link>
          <p className="mb-8 mt-2 text-sm text-white/60">Espace d&apos;administration</p>
          {nav}
        </div>
        <div className="mt-8 border-t border-white/15 pt-5">
          <p className="truncate text-sm text-white/70">{name}</p>
          <div className="mt-3 flex flex-wrap gap-2"><Link href="/" target="_blank" className="rounded-xl border border-white/30 px-3.5 py-2 text-sm font-bold hover:bg-white/10">Voir le site ↗</Link><SignOut className="rounded-xl border border-white/30 px-3.5 py-2 text-sm font-bold hover:bg-white/10" /></div>
        </div>
      </aside>
    </>
  );
}
