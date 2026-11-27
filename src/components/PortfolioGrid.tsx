"use client";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/utils";

export default function PortfolioGrid({ projects, categories }: { projects: any[]; categories: any[] }) {
  const [cat, setCat] = useState("");
  useEffect(() => { const c = new URLSearchParams(window.location.search).get("categorie"); if (c && categories.some((x) => x.slug === c)) setCat(c); }, [categories]);
  const names: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const shown = cat ? projects.filter((p) => p.category === cat) : projects;
  return (
    <div>
      <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-3">
        {[{ slug: "", name: "Tout" }, ...categories].map((c) => (
          <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}
            className={cn("rounded-full border-2 px-5 py-2.5 text-base font-bold transition", cat === c.slug ? "border-teal bg-teal text-night" : "border-line bg-white text-navy hover:border-teal")}>{c.name}</button>
        ))}
      </div>
      <p className="mt-6 text-ink" aria-live="polite">{shown.length} projet{shown.length > 1 ? "s" : ""}</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <ProjectCard key={p.slug} p={p} categoryName={names[p.category]} />)}
      </div>
      {shown.length === 0 && <p className="mt-10 rounded-2xl bg-mist p-8 text-center text-lg text-ink">Aucun projet dans cette catégorie pour le moment.</p>}
    </div>
  );
}
