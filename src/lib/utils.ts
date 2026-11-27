export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const waLink = (num: string, text?: string) => `https://wa.me/${(num || "").replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = (p: string) => "tel:" + (p || "").replace(/[^\d+]/g, "");
export const slugify = (s: string) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const lines = (v: unknown): string[] => (Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : []).map((s) => String(s).trim()).filter(Boolean);
