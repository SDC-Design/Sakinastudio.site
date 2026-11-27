const circ = (cx: number, cy: number, r: number, a0 = 0, a1 = 360, n = 36) =>
  Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos(((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180), cy + r * Math.sin(((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180)]);
const SHAPES: Record<string, number[][][]> = {
  branding: [[[0, -0.62], [0.3, -0.05], [0.2, 0.35], [0, 0.5], [-0.2, 0.35], [-0.3, -0.05], [0, -0.62]], [[0, -0.62], [0, 0.08]], circ(0, 0.12, 0.07), [[-0.3, 0.68], [0.3, 0.68]]],
  web: [[[-0.6, -0.42], [0.6, -0.42], [0.6, 0.42], [-0.6, 0.42], [-0.6, -0.42]], [[-0.6, -0.2], [0.6, -0.2]], [[-0.14, 0], [-0.32, 0.12], [-0.14, 0.26]], [[0.14, 0], [0.32, 0.12], [0.14, 0.26]]],
  "3d": [[[0, -0.7], [0.6, -0.35], [0.6, 0.35], [0, 0.7], [-0.6, 0.35], [-0.6, -0.35], [0, -0.7]], [[0, 0], [0, 0.7]], [[0, 0], [0.6, -0.35]], [[0, 0], [-0.6, -0.35]]],
  photo: [[[-0.7, -0.25], [-0.28, -0.25], [-0.2, -0.5], [0.2, -0.5], [0.28, -0.25], [0.7, -0.25], [0.7, 0.5], [-0.7, 0.5], [-0.7, -0.25]], circ(0, 0.1, 0.26), circ(0, 0.1, 0.1)],
  pub: [[[-0.65, -0.16], [-0.18, -0.16], [0.5, -0.55], [0.5, 0.55], [-0.18, 0.16], [-0.65, 0.16], [-0.65, -0.16]], [[-0.45, 0.16], [-0.36, 0.64], [-0.1, 0.64], [-0.05, 0.2]], circ(0.5, 0, 0.32, -40, 40, 12)],
};
export const ICON_OPTIONS = [{ value: "branding", label: "Branding (plume)" }, { value: "web", label: "Web (fenêtre)" }, { value: "3d", label: "3D (cube)" }, { value: "photo", label: "Photo (appareil)" }, { value: "pub", label: "Publicité (mégaphone)" }];

/** Icônes des cinq expertises : tracé fin, couleur héritée du texte (currentColor). */
export default function ServiceIcon({ name, className = "h-7 w-7", stroke = 0.11 }: { name?: string; className?: string; stroke?: number }) {
  const shapes = SHAPES[name || "branding"] || SHAPES.branding;
  const d = shapes.map((pts) => "M" + pts.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join(" L")).join(" ");
  return (
    <svg viewBox="-1 -1 2 2" className={className} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
