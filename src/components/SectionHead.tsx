import { cn } from "@/lib/utils";

export default function SectionHead({ eyebrow, title, text, center = false, dark = false, className }: { eyebrow?: string; title: string; text?: string; center?: boolean; dark?: boolean; className?: string }) {
  return (
    <div className={cn(center && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <p className={cn("eyebrow mb-3", dark && "eyebrow-dark")}>{eyebrow}</p>}
      <h2 className={cn("text-4xl sm:text-5xl", dark ? "text-white" : "text-navy")}>{title}</h2>
      {text && <p className={cn("mt-5 text-lg leading-relaxed sm:text-xl", dark ? "text-ice/80" : "text-ink")}>{text}</p>}
    </div>
  );
}
