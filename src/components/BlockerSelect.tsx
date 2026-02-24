import { BLOCKERS } from '@/lib/tracker-data';

interface BlockerSelectProps {
  value: string;
  onChange: (value: string) => void;
  customText: string;
  onCustomTextChange: (value: string) => void;
}

export default function BlockerSelect({ value, onChange, customText, onCustomTextChange }: BlockerSelectProps) {
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
        <button
          type="button"
          onClick={() => onChange('Other')}
          className={`chip ${value === 'Other' ? 'chip-active' : 'hover:border-muted-foreground/40'}`}
        >
          Other
        </button>
      </div>
      {value === 'Other' && (
        <div className="space-y-1.5 animate-fade-in">
          <label className="text-xs text-muted-foreground">Please specify</label>
          <input
            type="text"
            maxLength={150}
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Describe what impacted your performance…"
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}
    </div>
  );
}
