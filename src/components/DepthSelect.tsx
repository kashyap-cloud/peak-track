import { DEPTH_OPTIONS } from '@/lib/tracker-data';

interface DepthSelectProps {
  value: string;
  onChange: (value: string) => void;
  customText: string;
  onCustomTextChange: (value: string) => void;
}

export default function DepthSelect({ value, onChange, customText, onCustomTextChange }: DepthSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        How deep was your work today?
        <span className="ml-2 text-xs text-muted-foreground font-normal">Optional</span>
      </label>
      <div className="grid gap-2">
        {DEPTH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left px-4 py-3 rounded-md border transition-all duration-150 ${
              value === opt.value
                ? 'bg-[hsl(var(--success-muted))] border-primary text-foreground'
                : 'border-border bg-secondary/50 text-secondary-foreground hover:border-muted-foreground/40'
            }`}
          >
            <div className="text-sm font-medium">{opt.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{opt.description}</div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange('custom')}
          className={`text-left px-4 py-3 rounded-md border transition-all duration-150 ${
            value === 'custom'
              ? 'bg-[hsl(var(--success-muted))] border-primary text-foreground'
              : 'border-border bg-secondary/50 text-secondary-foreground hover:border-muted-foreground/40'
          }`}
        >
          <div className="text-sm font-medium">Custom</div>
          <div className="text-xs text-muted-foreground mt-0.5">Describe your own work depth</div>
        </button>
      </div>
      {value === 'custom' && (
        <div className="space-y-1.5 animate-fade-in">
          <label className="text-xs text-muted-foreground">Describe your work depth</label>
          <input
            type="text"
            maxLength={150}
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Example: Strategy planning, creative brainstorming…"
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}
    </div>
  );
}
