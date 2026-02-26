import { Check, X, CheckCircle2 } from 'lucide-react';

interface PriorityToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function PriorityToggle({ value, onChange }: PriorityToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <label className="text-sm font-semibold text-foreground">
          Did you complete your most important task today?
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            value === true
              ? 'text-primary-foreground shadow-md hover:shadow-lg'
              : 'chip hover:shadow-sm'
          }`}
          style={value === true ? { background: 'var(--gradient-primary)' } : undefined}
        >
          {value === true && <Check className="w-4 h-4 animate-check-pop" />}
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            value === false
              ? 'bg-secondary text-foreground border border-foreground/20 shadow-sm'
              : 'chip hover:shadow-sm'
          }`}
        >
          {value === false && <X className="w-4 h-4" />}
          No
        </button>
      </div>
    </div>
  );
}
