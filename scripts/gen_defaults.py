# Génère src/lib/defaults.json (contenu de secours du site) et supabase/seed.sql (contenu initial de la base) à partir de scripts/defaults_source.json
import json, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
D = json.load(open("scripts/defaults_source.json", encoding="utf-8"))
for coll in ("services", "categories", "projects", "testimonials", "team_members", "process_steps", "site_values"):
    for i, r in enumerate(D[coll]):
        r.setdefault("id", r.get("slug") or f"{coll}-{i}"); r.setdefault("position", i); r.setdefault("published", True)
json.dump(D, open("src/lib/defaults.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
q = lambda v: "null" if v in (None, "") else "'" + str(v).replace("'", "''") + "'"
arr = lambda l: ("array[" + ",".join(q(x) for x in l) + "]::text[]") if l else "'{}'::text[]"
b = lambda v: "true" if v else "false"
sql = ["-- Contenu initial du site (modifiable ensuite depuis l'administration).",
       "-- Chaque bloc ne s'applique que si la table est vide : ce fichier peut être relancé sans écraser vos modifications.\n"]
for k in ("general", "home", "pages", "about", "contact", "cta", "footer", "seo", "legal"):
    sql.append(f"insert into public.site_settings(key, value) values ({q(k)}, {q(json.dumps(D[k], ensure_ascii=False))}::jsonb) on conflict (key) do nothing;")
sql.append("")
def seed(table, cols, kinds):
    rows = []
    for r in D[table]:
        vals = []
        for c, kd in zip(cols, kinds):
            v = r.get(c); vals.append(arr(v) if kd == "a" else b(v) if kd == "b" else str(int(v)) if kd == "i" else q(v))
        rows.append("(" + ", ".join(vals) + ")")
    sql.append(f"insert into public.{table} ({', '.join(cols)})\nselect * from (values\n  " + ",\n  ".join(rows) + f"\n) as v({', '.join(cols)}) where not exists (select 1 from public.{table});\n")
seed("categories", ["slug", "name", "position", "published"], "ssib")
seed("services", ["slug", "icon", "title", "short_title", "summary", "description", "deliverables", "position", "published"], "ssssssaib")
seed("projects", ["slug", "title", "category", "client", "year", "services_label", "summary", "context", "solution", "result", "cover_url", "gallery", "featured", "published", "position"], "sssssssssssabbi")
seed("testimonials", ["name", "company", "role", "quote", "avatar_url", "published", "position"], "sssssbi")
seed("team_members", ["name", "role", "photo_url", "published", "position"], "sssbi")
seed("process_steps", ["title", "description", "published", "position"], "ssbi")
seed("site_values", ["title", "description", "icon", "published", "position"], "sssbi")
open("supabase/seed.sql", "w", encoding="utf-8").write("\n".join(sql)); print("ok", len(sql))
