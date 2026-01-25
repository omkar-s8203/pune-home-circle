import { PUNE_AREAS, type PuneArea } from "@/lib/constants";

interface AreaChipsProps {
  selectedArea: PuneArea | null;
  onSelectArea: (area: PuneArea | null) => void;
}

const AreaChips = ({ selectedArea, onSelectArea }: AreaChipsProps) => {
  const popularAreas = PUNE_AREAS.slice(0, 10);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectArea(null)}
        className={`chip ${selectedArea === null ? "chip-active" : "chip-primary"}`}
      >
        All Areas
      </button>
      {popularAreas.map((area) => (
        <button
          key={area}
          onClick={() => onSelectArea(area)}
          className={`chip ${selectedArea === area ? "chip-active" : "chip-primary"}`}
        >
          {area}
        </button>
      ))}
    </div>
  );
};

export default AreaChips;
