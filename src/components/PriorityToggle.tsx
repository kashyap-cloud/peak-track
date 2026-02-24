import { Check } from 'lucide-react';

interface PriorityToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function PriorityToggle({ value, onChange }: PriorityToggleProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Did you complete your most important task today?
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all duration-150 ${
            value === true
              ? 'bg-[hsl(var(--success-muted))] text-primary border border-primary'
              : 'chip'
          }`}
        >
          {value === true && (
            <Check className="w-4 h-4 animate-check-pop" />
          )}
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 rounded-md text-sm font-medium transition-all duration-150 ${
            value === false
              ? 'bg-secondary text-foreground border border-foreground/20'
              : 'chip'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
