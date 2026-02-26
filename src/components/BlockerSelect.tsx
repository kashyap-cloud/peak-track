import { AlertTriangle } from 'lucide-react';
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
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <label className="text-sm font-semibold text-foreground">
          What impacted your performance the most?
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {BLOCKERS.map((blocker) => (
          <button
            key={blocker}
            type="button"
            onClick={() => onChange(blocker)}
            className={`chip ${value === blocker ? 'chip-active' : ''}`}
          >
            {blocker}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange('Other')}
          className={`chip ${value === 'Other' ? 'chip-active' : ''}`}
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
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
          />
        </div>
      )}
    </div>
  );
}
