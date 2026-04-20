import { Vertical, VerticalMeta } from "@/types/dashboard";

interface Props {
  meta: Record<Vertical, VerticalMeta>;
  selected: Vertical;
  onChange: (v: Vertical) => void;
}

const ORDER: Vertical[] = [
  "Manufatura Avançada",
  "Tecnologias Digitais Avançadas",
  "Energias Renováveis",
  "Materiais Avançados",
  "Biotecnologia",
];

export const VerticalSelector = ({ meta, selected, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER.map((v) => {
        const cor = meta[v]?.cor ?? "#1F4E79";
        const isActive = selected === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={{
              backgroundColor: isActive ? cor : "transparent",
              color: isActive ? "#fff" : cor,
              border: `1.5px solid ${cor}`,
              boxShadow: isActive ? `0 4px 12px -2px ${cor}55` : "none",
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
};
