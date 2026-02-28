import { useState, useEffect } from 'react';
import { Activity, ChevronDown, Check, Target, Brain, Zap, TrendingUp, History } from 'lucide-react';
import ScoreSlider from '@/components/ScoreSlider';
import PriorityToggle from '@/components/PriorityToggle';
import BlockerSelect from '@/components/BlockerSelect';
import DepthSelect from '@/components/DepthSelect';
import PerformanceInsights from '@/components/PerformanceInsights';
import EntryHistory from '@/components/EntryHistory';
import LanguageSelector from '@/components/LanguageSelector';
import { saveEntry, getTodayEntry } from '@/lib/tracker-data';
import { useTranslation } from '@/lib/translation';

const Index = () => {
  const { t } = useTranslation();
  const [executionScore, setExecutionScore] = useState(5);
  const [mentalClarity, setMentalClarity] = useState(5);
  const [priorityCompleted, setPriorityCompleted] = useState<boolean | null>(null);
  const [primaryBlocker, setPrimaryBlocker] = useState('');
  const [customBlockerText, setCustomBlockerText] = useState('');
  const [productivityDepth, setProductivityDepth] = useState('');
  const [customDepthText, setCustomDepthText] = useState('');
  const [saved, setSaved] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const existing = getTodayEntry();
    if (existing) {
      setExecutionScore(existing.execution_score);
      setMentalClarity(existing.mental_clarity);
      setPriorityCompleted(existing.priority_completed);
      setPrimaryBlocker(existing.primary_blocker);
      setCustomBlockerText(existing.custom_blocker_text || '');
      setProductivityDepth(existing.productivity_depth);
      setCustomDepthText(existing.custom_work_depth_text || '');
      setSaved(true);
      setIsEditing(false);
    }
  }, []);

  const canSubmit = priorityCompleted !== null && primaryBlocker !== '';

  const handleSave = () => {
    if (!canSubmit) return;
    saveEntry({
      execution_score: executionScore,
      mental_clarity: mentalClarity,
      priority_completed: priorityCompleted!,
      primary_blocker: primaryBlocker,
      custom_blocker_text: primaryBlocker === 'Other' ? customBlockerText : null,
      productivity_depth: productivityDepth as any,
      custom_work_depth_text: productivityDepth === 'custom' ? customDepthText : null,
    });
    setSaved(true);
    setIsEditing(false);
    // Reset form to defaults after a brief delay
    setTimeout(() => {
      setExecutionScore(5);
      setMentalClarity(5);
      setPriorityCompleted(null);
      setPrimaryBlocker('');
      setCustomBlockerText('');
      setProductivityDepth('');
      setCustomDepthText('');
      setSaved(false);
    }, 1200);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] opacity-40 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(158 64% 42% / 0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 0%, hsl(205 85% 55% / 0.08), transparent)'
      }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-20 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, hsl(258 60% 55% / 0.1), transparent)'
      }} />

      {/* Top gradient bar */}
      <div className="h-1 w-full" style={{ background: 'var(--gradient-hero)' }} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="section-icon section-icon-primary p-2.5">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  {t('Performance & Focus Tracker')}
                </h1>
               <p className="text-sm text-muted-foreground mt-0.5">
                   {t('Track. Measure. Optimize your daily performance.')}
                 </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Form */}
        <div className="tracker-card space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ScoreSlider
            label={t('Execution Score')}
            description={t('Measures how effectively you turned priorities into completed results today.')}
            value={executionScore}
            onChange={setExecutionScore}
            lowLabel={t('Poor execution')}
            highLabel={t('Exceptional')}
            icon={<Target className="w-4 h-4 text-primary-foreground" />}
            iconClass="section-icon-primary"
          />

          <div className="border-t border-border/60" />

          <ScoreSlider
            label={t('Mental Clarity')}
            description={t('Measures how mentally sharp, focused, and cognitively clear you felt today.')}
            value={mentalClarity}
            onChange={setMentalClarity}
            lowLabel={t('Foggy / Distracted')}
            highLabel={t('Sharp / Focused')}
            icon={<Brain className="w-4 h-4 text-primary-foreground" />}
            iconClass="section-icon-accent"
          />

          <div className="border-t border-border/60" />

          <PriorityToggle value={priorityCompleted} onChange={setPriorityCompleted} />

          <div className="border-t border-border/60" />

          <BlockerSelect
            value={primaryBlocker}
            onChange={setPrimaryBlocker}
            customText={customBlockerText}
            onCustomTextChange={setCustomBlockerText}
          />

          <div className="border-t border-border/60" />

          <DepthSelect
            value={productivityDepth}
            onChange={setProductivityDepth}
            customText={customDepthText}
            onCustomTextChange={setCustomDepthText}
          />

          {/* Submit */}
          {saved && !isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2.5 py-4 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20" style={{ background: 'var(--gradient-primary)' }}>
                <Check className="w-5 h-5 animate-check-pop" />
                <span className="text-sm font-bold">{t('Entry Saved Successfully')}</span>
              </div>
              <button
                onClick={handleEdit}
                className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-secondary/60 rounded-xl"
              >
                {t("Edit today's entry")}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                canSubmit
                  ? 'text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
              }`}
              style={canSubmit ? { background: 'var(--gradient-hero)' } : undefined}
            >
              {t("Save Today's Entry")}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold text-primary-foreground transition-all duration-300 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <TrendingUp className="w-4.5 h-4.5" />
            <span>{t('View Performance Insights')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showInsights ? 'rotate-180' : ''}`} />
          </button>

          {showInsights && (
            <div className="mt-4">
              <PerformanceInsights />
            </div>
          )}

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold text-primary-foreground transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'var(--gradient-purple)' }}
          >
            <History className="w-4.5 h-4.5" />
            <span>{t('View Entry History')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          {showHistory && (
            <div className="mt-4">
              <EntryHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
