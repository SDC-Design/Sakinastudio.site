import Link from "next/link";
import { telLink } from "@/lib/utils";
import InstallButton from "./InstallButton";

export default function Footer({ s, services }: { s: any; services: any[] }) {
  const g = s.general; const year = new Date().getFullYear();
  const socials = [["Facebook", g.facebook], ["Instagram", g.instagram], ["LinkedIn", g.linkedin], ["TikTok", g.tiktok], ["YouTube", g.youtube]].filter(([, u]) => u);
  return (
    <footer className="relative bg-night text-ice">
      <div className="h-1 bg-gradient-to-r from-teal to-navy" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <img src={g.logo_dark_url} alt={g.name} className="h-14 w-auto" width={140} height={60} />
          <p className="mt-5 max-w-xs text-[1.05rem] leading-relaxed text-ice/75">{s.footer.text}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map(([n, u]: any) => (<li key={n}><a href={u} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-ice/85 transition hover:border-bright hover:text-bright">{n}</a></li>))}
            </ul>
          )}
          <div className="mt-6"><InstallButton /></div>
        </div>
        <nav aria-label="Pied de page : navigation">
          <h2 className="text-sm font-bold text-bright">Navigation</h2>
          <ul className="mt-4 space-y-3 text-[1.05rem] text-ice/80">
            {[["Accueil", "/"], ["Services", "/services"], ["Réalisations", "/realisations"], ["À propos", "/a-propos"], ["Contact", "/contact"], ["Espace client", "/espace-client"]].map(([l, h]) => (<li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>))}
          </ul>
        </nav>
        <nav aria-label="Pied de page : expertises">
          <h2 className="text-sm font-bold text-bright">Expertises</h2>
          <ul className="mt-4 space-y-3 text-[1.05rem] text-ice/80">
            {services.map((sv) => (<li key={sv.slug}><Link href={`/services#${sv.slug}`} className="hover:text-white">{sv.short_title || sv.title}</Link></li>))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold text-bright">Contact</h2>
          <ul className="mt-4 space-y-3 text-[1.05rem] text-ice/80">
            {g.phone1 && <li><a href={telLink(g.phone1)} className="hover:text-white">{g.phone1}</a></li>}
            {g.phone2 && <li><a href={telLink(g.phone2)} className="hover:text-white">{g.phone2}</a></li>}
            {g.email && <li><a href={`mailto:${g.email}`} className="hover:text-white">{g.email}</a></li>}
            <li>{g.address1}<br />{g.address2}</li>
            {g.hours && <li className="text-ice/60">{g.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-ice/60 sm:px-8">
          <p>© {year} {s.footer.copyright}</p>
          <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
