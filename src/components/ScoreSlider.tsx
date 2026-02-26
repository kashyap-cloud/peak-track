import { useState, useRef, useCallback, ReactNode } from 'react';

interface ScoreSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  icon?: ReactNode;
  gradient?: 'primary' | 'accent';
}

export default function ScoreSlider({ label, description, value, onChange, lowLabel, highLabel, icon, gradient = 'primary' }: ScoreSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const val = Math.round(pct * 9) + 1;
    onChange(val);
  }, [onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const pct = ((value - 1) / 9) * 100;

  const getScoreColor = () => {
    if (value >= 8) return 'text-primary';
    if (value >= 5) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--danger))]';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5">
          {icon && (
            <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-foreground">{label}</label>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        <span className={`font-mono text-3xl font-bold tabular-nums transition-colors duration-200 ${getScoreColor()}`}>
          {value}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-8 flex items-center cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="slider-track w-full" />
        <div className="slider-fill absolute left-0" style={{ width: `${pct}%` }} />
        <div
          className={`slider-thumb absolute -translate-x-1/2 transition-transform duration-150 ${isDragging ? 'scale-125 shadow-xl' : ''}`}
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
