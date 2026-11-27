import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProject, getProjects, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";

export const revalidate = 30;
export async function generateStaticParams() { return (await getProjects()).map((p: any) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.summary || undefined, openGraph: { images: p.cover_url ? [p.cover_url] : [] } } : { title: "Projet introuvable" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, p, categories, others] = await Promise.all([getSettings(), getProject(slug), getCategories(), getProjects({ exclude: slug, limit: 3 })]);
  if (!p) notFound();
  const cat = categories.find((c: any) => c.slug === p.category);
  const names: Record<string, string> = Object.fromEntries(categories.map((c: any) => [c.slug, c.name]));
  const meta = [["Client", p.client], ["Catégorie", cat?.name], ["Année", p.year], ["Services", p.services_label]].filter(([, v]) => v);
  const blocks = [["Contexte", p.context], ["Solution", p.solution], ["Résultat", p.result]].filter(([, v]) => v);
  const gallery: string[] = (p.gallery || []).filter(Boolean);
  return (
    <>
      <PageHero crumb={`Accueil / Réalisations / ${p.title}`} title={p.title} text={p.summary} />
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {meta.length > 0 && (
            <dl className="card relative z-10 -mt-10 grid gap-6 p-7 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map(([k, v]) => (<div key={k}><dt className="text-sm font-bold text-teal-deep">{k}</dt><dd className="mt-1 text-xl font-bold">{v}</dd></div>))}
            </dl>
          )}
          {p.cover_url && <img src={p.cover_url} alt={p.title} className="mt-10 w-full rounded-[2rem] bg-mist object-cover shadow-card" style={{ maxHeight: "44rem" }} />}
          {blocks.length > 0 && (
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {blocks.map(([t, v]) => (
                <section key={t} className="border-l-4 border-teal pl-6"><h2 className="text-3xl">{t}</h2><p className="prose-lines mt-4 text-lg leading-relaxed text-ink">{v}</p></section>
              ))}
            </div>
          )}
          {gallery.length > 1 && (
            <section className="mt-20" aria-labelledby="galerie">
              <h2 id="galerie" className="text-3xl sm:text-4xl">Aperçu des livrables</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((g, i) => <img key={g + i} src={g} alt={`${p.title} — visuel ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-3xl bg-mist object-cover shadow-card" />)}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section className="mt-24" aria-labelledby="autres">
              <div className="flex flex-wrap items-end justify-between gap-4"><h2 id="autres" className="text-3xl sm:text-4xl">Autres réalisations</h2><Link href="/realisations" className="font-bold text-teal-deep hover:underline">Tout voir →</Link></div>
              <div className="mt-8 grid gap-8 md:grid-cols-3">{others.map((o: any) => <ProjectCard key={o.slug} p={o} categoryName={names[o.category]} />)}</div>
            </section>
          )}
        </div>
      </div>
      <CtaBand s={s} />
    </>
  );
}
