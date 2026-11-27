"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [["Accueil", "/"], ["Services", "/services"], ["Réalisations", "/realisations"], ["À propos", "/a-propos"], ["Contact", "/contact"]] as const;

export default function Header({ logo, name }: { logo: string; name: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => setOpen(false), [path]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300", scrolled || open ? "bg-night/95 shadow-lg backdrop-blur-md" : "bg-transparent")}>
      <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label={`${name} — accueil`} className="shrink-0"><img src={logo} alt={name} className="h-12 w-auto" width={140} height={60} /></Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
              className={cn("relative py-2 text-[1.05rem] font-bold text-white/80 transition-colors hover:text-white", active(href) && "text-white")}>
              {label}
              {active(href) && <span className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-bright" />}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/espace-client" className="flex items-center gap-2 text-[1.02rem] font-bold text-white/85 transition-colors hover:text-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>
            Espace client
          </Link>
          <Link href="/contact#devis" className="btn btn-primary !py-3">Demander un devis</Link>
        </div>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} className="grid h-11 w-11 place-items-center rounded-full text-white lg:hidden">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h10" />}</svg>
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" aria-label="Menu mobile" className="border-t border-white/10 px-5 pb-6 pt-3 lg:hidden">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={cn("block rounded-xl px-3 py-3.5 text-lg font-bold text-white/85", active(href) && "bg-white/10 text-white")}>{label}</Link>
          ))}
          <Link href="/espace-client" className="block rounded-xl px-3 py-3.5 text-lg font-bold text-white/85">Espace client</Link>
          <Link href="/contact#devis" className="btn btn-primary mt-3 w-full">Demander un devis</Link>
        </nav>
      )}
    </header>
  );
}
