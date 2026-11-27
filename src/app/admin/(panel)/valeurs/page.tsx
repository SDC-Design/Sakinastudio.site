import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "title", label: "Valeur", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", rows: 3 },
  { key: "icon", label: "Icône", type: "icon" },
];
export default function Page() {
  return <CrudManager table="site_values" title="Valeurs" intro="Affichées sur la page À propos." singular="une valeur" fields={fields} subtitleKey="description" />;
}
