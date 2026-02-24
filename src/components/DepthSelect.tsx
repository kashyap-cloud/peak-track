import { DEPTH_OPTIONS } from '@/lib/tracker-data';

interface DepthSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DepthSelect({ value, onChange }: DepthSelectProps) {
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
      </div>
    </div>
  );
}
