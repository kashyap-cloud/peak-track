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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="section-icon section-icon-purple">
            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <label className="text-sm font-bold text-foreground">
            {t('Did you complete your most important task today?')}
          </label>
        </div>
        <span className="text-xs font-semibold text-destructive tracking-wide">{t('Required')}</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
            value === true
              ? 'text-primary-foreground border-transparent shadow-lg shadow-primary/20'
              : 'border-border bg-card text-secondary-foreground hover:border-primary/30 hover:shadow-md'
          }`}
          style={value === true ? { background: 'var(--gradient-primary)' } : undefined}
        >
          {value === true && <Check className="w-4 h-4" />}
          {t('Yes, I did')}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
            value === false
              ? 'bg-secondary text-foreground border-foreground/15 shadow-md'
              : 'border-border bg-card text-secondary-foreground hover:border-primary/30 hover:shadow-md'
          }`}
        >
          {t('Not yet')}
        </button>
      </div>
    </div>
  );
}
