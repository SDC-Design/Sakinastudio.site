import { cn } from "@/lib/utils";

/** Bandeau de titre des pages intérieures (fond sombre sous l'en-tête). */
export default function PageHero({ title, text, crumb, children, className }: { title: string; text?: string; crumb?: string; children?: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br from-night to-navy pb-16 pt-36 text-white sm:pb-20 sm:pt-44", className)}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-teal/25 blur-3xl" aria-hidden="true" />
      <img src="/brand/monogram-white.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-[-3rem] h-[28rem] w-auto opacity-[0.08]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {crumb && <p className="mb-4 text-sm font-bold text-bright">{crumb}</p>}
        <h1 className="rise max-w-4xl text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
        {text && <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-ice/85 sm:text-xl">{text}</p>}
        {children}
      </div>
    </section>
  );
}
