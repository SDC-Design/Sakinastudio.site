import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "title", label: "Titre de l'étape", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", rows: 3 },
];
export default function Page() {
  return <CrudManager table="process_steps" title="Méthode de travail" intro="Les étapes affichées sur la page d'accueil, dans l'ordre." singular="une étape" fields={fields} subtitleKey="description" />;
}
