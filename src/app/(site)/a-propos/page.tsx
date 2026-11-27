import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, getTeam, getValues } from "@/lib/data";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import ServiceIcon from "@/components/ServiceIcon";
import CtaBand from "@/components/CtaBand";

export const revalidate = 30;
export const metadata: Metadata = { title: "À propos" };

export default async function AboutPage() {
  const [s, team, values] = await Promise.all([getSettings(), getTeam(), getValues()]);
  const a = s.about;
  return (
    <>
      <PageHero crumb="Accueil / À propos" title={s.pages.about_title} text={s.pages.about_text} />
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-x-[8%] top-[6%] aspect-square rounded-full bg-teal/15" aria-hidden="true" />
            <img src={a.image} alt="" className="relative w-full" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow mb-3">{a.eyebrow}</p>
            <h2 className="text-4xl text-navy sm:text-5xl">{a.title}<br /><span className="text-teal-deep">{a.title_accent}</span></h2>
            <p className="prose-lines mt-6 text-xl leading-relaxed text-ink">{a.text}</p>
            {a.text2 && <p className="prose-lines mt-5 text-xl leading-relaxed text-ink">{a.text2}</p>}
            <div className="mt-9 flex flex-wrap gap-4"><Link href="/realisations" className="btn btn-primary">Nos réalisations<span aria-hidden="true">→</span></Link><Link href="/contact" className="btn btn-ghost">Nous contacter</Link></div>
          </div>
        </div>
      </section>
      {values.length > 0 && (
        <section className="bg-mist px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHead eyebrow={a.values_eyebrow} title={a.values_title} center />
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {values.map((v: any, i: number) => (
                <li key={v.id || i} className="card p-8">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal-deep"><ServiceIcon name={v.icon} className="h-8 w-8" /></span>
                  <h3 className="mt-6 text-2xl">{v.title}</h3><p className="mt-3 text-lg text-ink">{v.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {team.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHead eyebrow={a.team_eyebrow} title={a.team_title} center />
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m: any, i: number) => (
                <li key={m.id || i} className="card overflow-hidden text-center">
                  <img src={m.photo_url || "/placeholders/avatar.svg"} alt={m.name} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="p-6"><h3 className="text-xl">{m.name}</h3><p className="mt-1 font-bold text-teal-deep">{m.role}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand s={s} />
    </>
  );
}
