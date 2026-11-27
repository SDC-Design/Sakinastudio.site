import Link from "next/link";
import { getCategories, getProcess, getProjects, getServices, getSettings, getTestimonials } from "@/lib/data";
import { lines } from "@/lib/utils";
import ServiceIcon from "@/components/ServiceIcon";
import SectionHead from "@/components/SectionHead";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";

export const revalidate = 30;

export default async function HomePage() {
  const [s, services, featured, all, categories, steps, testimonials] = await Promise.all([getSettings(), getServices(), getProjects({ featured: true, limit: 6 }), getProjects({ limit: 6 }), getCategories(), getProcess(), getTestimonials()]);
  const projects = featured.length ? featured : all;
  const h = s.home; const names: Record<string, string> = Object.fromEntries(categories.map((c: any) => [c.slug, c.name]));
  const chips = services.slice(0, 4);
  const jsonLd = { "@context": "https://schema.org", "@type": "ProfessionalService", name: s.general.name, description: s.seo.description, telephone: s.general.phone1, email: s.general.email || undefined, address: { "@type": "PostalAddress", streetAddress: `${s.general.address1}, ${s.general.address2}`, addressCountry: "SN" } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HÉROS */}
      <section className="relative overflow-hidden bg-gradient-to-br from-night to-navy text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-[44rem] w-[44rem] rounded-full bg-teal/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-teal/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-40">
          <div>
            <p className="rise inline-flex items-center gap-2.5 rounded-full border border-bright/50 bg-white/5 px-4 py-2 text-[0.95rem] font-bold text-bright"><span className="h-2 w-2 rounded-full bg-bright" aria-hidden="true" />{h.hero_badge}</p>
            <h1 className="rise rise-2 mt-7 text-6xl sm:text-7xl xl:text-[5.5rem]">{h.hero_title_1}<br />{h.hero_title_2} <span className="text-bright">{h.hero_title_accent}</span></h1>
            <p className="rise rise-3 mt-7 max-w-xl text-xl leading-relaxed text-ice/85">{h.hero_text}</p>
            <div className="rise rise-3 mt-10 flex flex-wrap gap-4">
              <Link href="/realisations" className="btn btn-primary">{h.hero_cta1}<span aria-hidden="true">→</span></Link>
              <Link href="/contact#devis" className="btn btn-outline">{h.hero_cta2}</Link>
            </div>
            <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className={i > 1 ? "border-l border-white/20 pl-10" : ""}>
                  <dt className="sr-only">{h[`stat${i}_label`]}</dt>
                  <dd><span className="block text-4xl font-bold">{h[`stat${i}_value`]}</span><span className="text-ice/70">{h[`stat${i}_label`]}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-[44rem]">
            <div className="absolute inset-[8%] rounded-full bg-teal/30 blur-2xl" aria-hidden="true" />
            <img src={h.hero_image} alt="" className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" width={1100} height={743} fetchPriority="high" />
            {chips.map((c: any, i: number) => (
              <div key={c.slug} className={`bob absolute hidden items-center gap-3 rounded-full bg-white py-2.5 pl-2.5 pr-5 text-navy shadow-lift sm:flex ${["left-[-2%] top-[10%]", "right-[-2%] top-[2%]", "right-[0%] bottom-[14%]", "left-[2%] bottom-[8%]"][i]}`} style={{ animationDelay: `${i * 0.8}s` }}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-teal/15 text-teal-deep"><ServiceIcon name={c.icon} className="h-6 w-6" /></span>
                <span className="font-bold">{c.short_title || c.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHead eyebrow={h.expertises_eyebrow} title={h.expertises_title} text={h.expertises_text} />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((sv: any, i: number) => (
              <li key={sv.slug}>
                <Link href={`/services#${sv.slug}`} className="group card relative block h-full overflow-hidden p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="absolute inset-y-7 left-0 w-1 rounded-r-full bg-teal" aria-hidden="true" />
                  <span className="absolute right-6 top-5 text-3xl font-bold text-teal/25">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal-deep transition group-hover:bg-teal group-hover:text-night"><ServiceIcon name={sv.icon} className="h-8 w-8" /></span>
                  <h3 className="mt-6 text-2xl text-navy">{sv.title}</h3>
                  <p className="mt-3 text-lg text-ink">{sv.summary}</p>
                  <p className="mt-5 font-bold text-teal-deep">En savoir plus <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span></p>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact#devis" className="group flex h-full min-h-[14rem] flex-col justify-between rounded-[22px] bg-gradient-to-br from-teal to-navy p-7 text-white transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <span><span className="block text-3xl font-bold">Un projet en tête ?</span><span className="mt-2 block text-xl text-white/90">Parlons-en ensemble.</span></span>
                <span aria-hidden="true" className="grid h-14 w-14 place-items-center self-end rounded-full bg-white/20 text-2xl transition group-hover:translate-x-1">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section className="bg-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHead eyebrow={h.portfolio_eyebrow} title={h.portfolio_title} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: any) => <ProjectCard key={p.slug} p={p} categoryName={names[p.category]} />)}
          </div>
          <div className="mt-14 text-center"><Link href="/realisations" className="btn btn-dark">{h.portfolio_button}<span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* MÉTHODE */}
      {steps.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-night to-navy px-5 py-20 text-white sm:px-8 sm:py-28">
          <div className="pointer-events-none absolute -right-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-teal/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl">
            <SectionHead eyebrow={h.method_eyebrow} title={h.method_title} dark />
            <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((st: any, i: number) => (
                <li key={st.id || i} className="relative">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-teal text-2xl font-bold text-night">{String(i + 1).padStart(2, "0")}</span>
                  {i < steps.length - 1 && <span className="absolute left-20 top-8 hidden h-px w-[calc(100%-5rem)] bg-bright/30 lg:block" aria-hidden="true" />}
                  <h3 className="mt-6 text-2xl">{st.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-ice/75">{st.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ESPACE CLIENT */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">{h.client_eyebrow}</p>
            <h2 className="text-4xl text-navy sm:text-5xl">{h.client_title}</h2>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-ink">{h.client_text}</p>
            <ul className="mt-8 space-y-4">
              {lines(h.client_bullets).map((b) => (
                <li key={b} className="flex items-center gap-4 text-lg font-bold"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal/15 text-teal-deep"><svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg></span>{b}</li>
              ))}
            </ul>
            <Link href="/espace-client" className="btn btn-primary mt-10">{h.client_button}<span aria-hidden="true">→</span></Link>
          </div>
          <div aria-hidden="true" className="card overflow-hidden">
            <div className="flex items-center justify-between bg-mist px-7 py-5"><span className="text-xl font-bold">Mes projets</span><span className="h-9 w-9 rounded-full bg-teal/20" /></div>
            <div className="space-y-4 p-6">
              {[["Identité visuelle", "En cours", 65, "bg-teal", "text-teal-deep"], ["Site web vitrine", "À valider", 90, "bg-amber-500", "text-amber-600"], ["Campagne réseaux", "Livré", 100, "bg-emerald-600", "text-emerald-700"]].map(([n, st, p, bg, tx]: any) => (
                <div key={n} className="rounded-2xl border border-line p-5">
                  <div className="flex items-center justify-between gap-3"><span className="text-lg font-bold">{n}</span><span className={`rounded-full bg-mist px-3.5 py-1 text-sm font-bold ${tx}`}>{st}</span></div>
                  <div className="mt-4 h-2 rounded-full bg-line"><div className={`h-2 rounded-full ${bg}`} style={{ width: `${p}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      {testimonials.length > 0 && (
        <section className="bg-mist px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHead eyebrow={h.testi_eyebrow} title={h.testi_title} center />
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t: any, i: number) => (
                <li key={t.id || i} className="card flex flex-col p-8">
                  <span className="text-6xl font-bold leading-none text-teal/50" aria-hidden="true">“</span>
                  <blockquote className="-mt-2 flex-1 text-lg leading-relaxed text-navy">{t.quote}</blockquote>
                  <div className="mt-7 flex items-center gap-4">
                    <img src={t.avatar_url || "/placeholders/avatar.svg"} alt="" className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                    <p><span className="block text-lg font-bold">{t.name}</span><span className="text-ink">{[t.role, t.company].filter(Boolean).join(" · ")}</span></p>
                  </div>
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
