import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "name", label: "Nom de la catégorie", type: "text", required: true },
  { key: "slug", label: "Adresse (slug)", type: "slug", slugFrom: "name" },
];
export default function Page() {
  return <CrudManager table="categories" title="Catégories" intro="Les filtres de la page Réalisations." singular="une catégorie" fields={fields} titleKey="name" subtitleKey="slug" />;
}
