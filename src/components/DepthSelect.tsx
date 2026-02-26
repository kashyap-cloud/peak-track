import { Layers } from 'lucide-react';
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
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground">
            How deep was your work today?
          </label>
          <span className="ml-2 text-xs text-muted-foreground font-normal">Optional</span>
        </div>
      </div>
      <div className="grid gap-2">
        {DEPTH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-300 group ${
              value === opt.value
                ? 'border-transparent text-primary-foreground shadow-md'
                : 'border-border bg-secondary/50 text-secondary-foreground hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5'
            }`}
            style={value === opt.value ? { background: 'var(--gradient-primary)' } : undefined}
          >
            <div className={`text-sm font-semibold ${value === opt.value ? '' : 'group-hover:text-foreground'}`}>{opt.label}</div>
            <div className={`text-xs mt-0.5 ${value === opt.value ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{opt.description}</div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange('custom')}
          className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-300 group ${
            value === 'custom'
              ? 'border-transparent text-primary-foreground shadow-md'
              : 'border-border bg-secondary/50 text-secondary-foreground hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5'
          }`}
          style={value === 'custom' ? { background: 'var(--gradient-primary)' } : undefined}
        >
          <div className={`text-sm font-semibold ${value === 'custom' ? '' : 'group-hover:text-foreground'}`}>Custom</div>
          <div className={`text-xs mt-0.5 ${value === 'custom' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>Describe your own work depth</div>
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
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
          />
        </div>
      )}
    </div>
  );
}
