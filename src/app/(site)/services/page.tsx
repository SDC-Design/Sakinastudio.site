import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ServiceIcon from "@/components/ServiceIcon";
import CtaBand from "@/components/CtaBand";
import { lines } from "@/lib/utils";

export const revalidate = 30;
export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <PageHero crumb="Accueil / Services" title={s.pages.services_title} text={s.pages.services_text} />
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl divide-y divide-line">
          {services.map((sv: any, i: number) => (
            <section key={sv.slug} id={sv.slug} className="scroll-mt-28 grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20">
              <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal to-navy text-white ${i % 2 ? "lg:order-2" : ""}`}>
                <img src="/brand/monogram-white.svg" alt="" aria-hidden="true" className="absolute -right-10 -top-10 h-[120%] w-auto opacity-[0.14]" />
                <span className="absolute left-8 top-6 text-4xl font-bold text-white/55">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative grid h-36 w-36 place-items-center rounded-full bg-white/15 backdrop-blur-sm"><ServiceIcon name={sv.icon} className="h-20 w-20" stroke={0.09} /></span>
              </div>
              <div>
                <h2 className="text-4xl text-navy sm:text-5xl">{sv.title}</h2>
                <p className="mt-5 text-xl leading-relaxed text-ink">{sv.description || sv.summary}</p>
                <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {lines(sv.deliverables).map((d) => (
                    <li key={d} className="flex items-center gap-3 text-lg font-bold"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal/15 text-teal-deep"><svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg></span>{d}</li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href={`/realisations?categorie=${sv.slug}`} className="btn btn-dark">Voir les réalisations<span aria-hidden="true">→</span></Link>
                  <Link href="/contact#devis" className="btn btn-ghost">Demander un devis</Link>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      <CtaBand s={s} />
    </>
  );
}
