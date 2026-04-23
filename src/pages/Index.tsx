import { useState } from 'react';
import { Activity, ChevronDown, Check, Target, Brain, TrendingUp, History, ClipboardCheck } from 'lucide-react';
import ScoreSlider from '@/components/ScoreSlider';
import PriorityToggle from '@/components/PriorityToggle';
import BlockerSelect from '@/components/BlockerSelect';
import DepthSelect from '@/components/DepthSelect';
import PerformanceInsights from '@/components/PerformanceInsights';
import EntryHistory from '@/components/EntryHistory';
import LanguageSelector from '@/components/LanguageSelector';
import { saveEntry } from '@/lib/tracker-data';
import { useTranslation } from '@/lib/translation';
import { useAuth } from '@/lib/auth';

const Index = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [executionScore, setExecutionScore] = useState(5);
  const [mentalClarity, setMentalClarity] = useState(5);
  const [priorityCompleted, setPriorityCompleted] = useState<boolean | null>(null);
  const [priorityCompletionText, setPriorityCompletionText] = useState('');
  const [primaryBlocker, setPrimaryBlocker] = useState('');
  const [customBlockerText, setCustomBlockerText] = useState('');
  const [productivityDepth, setProductivityDepth] = useState('');
  const [customDepthText, setCustomDepthText] = useState('');
  const [saved, setSaved] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const canSubmit = priorityCompleted !== null && primaryBlocker !== '';

  const handleSave = async () => {
    if (!canSubmit) return;
    try {
      await saveEntry(userId!, {
        execution_score: executionScore,
        mental_clarity: mentalClarity,
        priority_completed: priorityCompleted!,
        priority_completion_text: priorityCompleted ? priorityCompletionText : null,
        primary_blocker: primaryBlocker,
        custom_blocker_text: primaryBlocker === 'Other' ? customBlockerText : null,
        productivity_depth: productivityDepth as any,
        custom_work_depth_text: productivityDepth === 'custom' ? customDepthText : null,
      });
      setSaved(true);
      setExecutionScore(5);
      setMentalClarity(5);
      setPriorityCompleted(null);
      setPriorityCompletionText('');
      setPrimaryBlocker('');
      setCustomBlockerText('');
      setProductivityDepth('');
      setCustomDepthText('');
      setTimeout(() => setSaved(false), 1500);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />

      {/* Hero Header - clean white */}
      <div className="w-full py-10 sm:py-12 text-center relative bg-card border-b border-border/40">
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl" style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 14px hsl(158 64% 42% / 0.3)' }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t('Daily Focus Tracker')}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            {t('Track. Measure. Optimize your daily performance.')}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Form Card with top gradient border */}
        <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/[0.04] border border-border bg-card animate-fade-in">
          <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />
          <div className="p-6 sm:p-8 space-y-8">
            {/* Two-column grid for sliders and toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              <PriorityToggle 
                value={priorityCompleted} 
                onChange={setPriorityCompleted} 
                textValue={priorityCompletionText}
                onTextChange={setPriorityCompletionText}
              />
            </div>

            <div className="border-t border-border/60" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              <DepthSelect
                value={productivityDepth}
                onChange={setProductivityDepth}
                customText={customDepthText}
                onCustomTextChange={setCustomDepthText}
              />
            </div>

            <div className="border-t border-border/60" />

            <BlockerSelect
              value={primaryBlocker}
              onChange={setPrimaryBlocker}
              customText={customBlockerText}
              onCustomTextChange={setCustomBlockerText}
            />

            {/* Submit */}
            {saved && (
              <div className="flex items-center justify-center gap-2.5 py-4 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 animate-fade-in" style={{ background: 'var(--gradient-primary)' }}>
                <Check className="w-5 h-5" />
                <span className="text-sm font-bold">{t('Entry Saved Successfully')}</span>
              </div>
            )}
            {!saved && (
              <button
                onClick={handleSave}
                disabled={!canSubmit}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  canSubmit
                    ? 'text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                }`}
                style={canSubmit ? { background: 'var(--gradient-hero)' } : undefined}
              >
                <ClipboardCheck className="w-4 h-4" />
                {t("Log Today's Reflection")}
              </button>
            )}
          </div>
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
