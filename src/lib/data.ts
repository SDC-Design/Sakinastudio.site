import { supabasePublic } from "./supabase/public";
import { DEFAULTS, SETTING_GROUPS, type Settings } from "./defaults";

type Row = Record<string, any>;
const published = (rows: Row[]) => rows.filter((r) => r.published !== false).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

async function list(table: string, fallback: Row[]): Promise<Row[]> {
  try {
    const { data, error } = await supabasePublic().from(table).select("*").eq("published", true).order("position", { ascending: true });
    if (error || !data) return published(fallback);
    return data;
  } catch {
    return published(fallback);
  }
}

export async function getSettings(): Promise<Settings> {
  const out: any = {};
  for (const g of SETTING_GROUPS) out[g] = { ...DEFAULTS[g] };
  try {
    const { data, error } = await supabasePublic().from("site_settings").select("key,value");
    if (!error && data) for (const r of data) if (out[r.key]) out[r.key] = { ...out[r.key], ...(r.value || {}) };
  } catch { /* contenu de secours */ }
  return out as Settings;
}
export const getServices = () => list("services", DEFAULTS.services);
export const getCategories = () => list("categories", DEFAULTS.categories);
export const getTestimonials = () => list("testimonials", DEFAULTS.testimonials);
export const getTeam = () => list("team_members", DEFAULTS.team_members);
export const getProcess = () => list("process_steps", DEFAULTS.process_steps);
export const getValues = () => list("site_values", DEFAULTS.site_values);
export async function getProjects(opts: { featured?: boolean; limit?: number; exclude?: string } = {}): Promise<Row[]> {
  let r = await list("projects", DEFAULTS.projects);
  if (opts.featured) r = r.filter((p) => p.featured);
  if (opts.exclude) r = r.filter((p) => p.slug !== opts.exclude);
  return opts.limit ? r.slice(0, opts.limit) : r;
}
export async function getProject(slug: string): Promise<Row | null> {
  return (await getProjects()).find((p) => p.slug === slug) || null;
}
