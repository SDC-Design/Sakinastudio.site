import Link from "next/link";

export default function ProjectCard({ p, categoryName }: { p: any; categoryName?: string }) {
  return (
    <Link href={`/realisations/${p.slug}`} className="group card block overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <img src={p.cover_url || "/placeholders/image.svg"} alt={p.title} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]" />
        {categoryName && <span className="absolute left-4 top-4 rounded-full bg-night/75 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur">{categoryName}</span>}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold leading-snug text-navy">{p.title}</h3>
        {p.summary && <p className="mt-2 line-clamp-2 text-ink">{p.summary}</p>}
        <p className="mt-4 flex items-center gap-2 font-bold text-teal-deep">Voir le projet <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></p>
      </div>
    </Link>
  );
}
