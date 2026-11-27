import type { Metadata } from "next";
import { getCategories, getProjects, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import CtaBand from "@/components/CtaBand";

export const revalidate = 30;
export const metadata: Metadata = { title: "Réalisations" };

export default async function PortfolioPage() {
  const [s, projects, categories] = await Promise.all([getSettings(), getProjects(), getCategories()]);
  return (
    <>
      <PageHero crumb="Accueil / Réalisations" title={s.pages.portfolio_title} text={s.pages.portfolio_text} />
      <section className="bg-mist px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl"><PortfolioGrid projects={projects} categories={categories} /></div>
      </section>
      <CtaBand s={s} />
    </>
  );
}
