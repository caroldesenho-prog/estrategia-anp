import { Vertical, VerticalMeta } from "@/types/dashboard";

interface Props {
  meta: Record<Vertical, VerticalMeta>;
  selected: Vertical;
  onChange: (v: Vertical) => void;
}

const ORDER: Vertical[] = [
  "Manufatura Avançada",
  "Tecnologias Digitais Avançadas",
];

export const VerticalSelector = ({ meta, selected, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER.map((v) => {
        const isActive = selected === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "border-graphite-dark bg-graphite-dark text-white shadow-sm"
                : "border-beige-medium bg-white text-graphite-medium hover:bg-beige-light hover:text-graphite-dark"
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
};
