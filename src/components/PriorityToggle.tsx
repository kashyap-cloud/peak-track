import { Check, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

interface PriorityToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function PriorityToggle({ value, onChange }: PriorityToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="section-icon section-icon-purple">
          <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <label className="text-sm font-bold text-foreground">
          {t('Did you complete your most important task today?')}
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
            value === true
              ? 'text-primary-foreground shadow-lg shadow-primary/20'
              : 'chip hover:shadow-md'
          }`}
          style={value === true ? { background: 'var(--gradient-primary)' } : undefined}
        >
          {value === true && <Check className="w-4 h-4 animate-check-pop" />}
          {t('Yes')}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
            value === false
              ? 'bg-secondary text-foreground border border-foreground/15 shadow-md'
              : 'chip hover:shadow-md'
          }`}
        >
          {value === false && <X className="w-4 h-4" />}
          {t('No')}
        </button>
      </div>
    </div>
  );
}
