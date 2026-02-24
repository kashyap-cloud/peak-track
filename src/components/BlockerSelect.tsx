import { BLOCKERS } from '@/lib/tracker-data';

interface BlockerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlockerSelect({ value, onChange }: BlockerSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        What impacted your performance the most?
      </label>
      <div className="flex flex-wrap gap-2">
        {BLOCKERS.map((blocker) => (
          <button
            key={blocker}
            type="button"
            onClick={() => onChange(blocker)}
            className={`chip ${value === blocker ? 'chip-active' : 'hover:border-muted-foreground/40'}`}
          >
            {blocker}
          </button>
        ))}
      </div>
    </div>
  );
}
