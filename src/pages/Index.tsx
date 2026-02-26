import { useState, useEffect } from 'react';
import { Activity, ChevronDown, Check, Sparkles, Target, Brain, Zap, TrendingUp } from 'lucide-react';
import ScoreSlider from '@/components/ScoreSlider';
import PriorityToggle from '@/components/PriorityToggle';
import BlockerSelect from '@/components/BlockerSelect';
import DepthSelect from '@/components/DepthSelect';
import PerformanceInsights from '@/components/PerformanceInsights';
import { saveEntry, getTodayEntry } from '@/lib/tracker-data';

const Index = () => {
  const [executionScore, setExecutionScore] = useState(5);
  const [mentalClarity, setMentalClarity] = useState(5);
  const [priorityCompleted, setPriorityCompleted] = useState<boolean | null>(null);
  const [primaryBlocker, setPrimaryBlocker] = useState('');
  const [customBlockerText, setCustomBlockerText] = useState('');
  const [productivityDepth, setProductivityDepth] = useState('');
  const [customDepthText, setCustomDepthText] = useState('');
  const [saved, setSaved] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
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
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaved(false);
  };

  const today = new Date().toLocaleDateString('en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero gradient accent bar */}
      <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl shadow-md" style={{ background: 'var(--gradient-primary)' }}>
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Performance & Focus Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Measure how effectively you executed your priorities today.
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            {today}
          </p>
        </div>

        {/* Form */}
        <div className="tracker-card space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ScoreSlider
            label="Execution Score"
            description="Measures how effectively you turned priorities into completed results today."
            value={executionScore}
            onChange={setExecutionScore}
            lowLabel="Poor execution"
            highLabel="Exceptional"
            icon={<Target className="w-4 h-4" />}
            gradient="primary"
          />

          <ScoreSlider
            label="Mental Clarity"
            description="Measures how mentally sharp, focused, and cognitively clear you felt today."
            value={mentalClarity}
            onChange={setMentalClarity}
            lowLabel="Foggy / Distracted"
            highLabel="Sharp / Focused"
            icon={<Brain className="w-4 h-4" />}
            gradient="accent"
          />

          <div className="border-t border-border" />

          <PriorityToggle value={priorityCompleted} onChange={setPriorityCompleted} />

          <BlockerSelect
            value={primaryBlocker}
            onChange={setPrimaryBlocker}
            customText={customBlockerText}
            onCustomTextChange={setCustomBlockerText}
          />

          <div className="border-t border-border" />

          <DepthSelect
            value={productivityDepth}
            onChange={setProductivityDepth}
            customText={customDepthText}
            onCustomTextChange={setCustomDepthText}
          />

          {/* Submit */}
          {saved && !isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-primary-foreground shadow-md" style={{ background: 'var(--gradient-primary)' }}>
                <Check className="w-4 h-4 animate-check-pop" />
                <span className="text-sm font-semibold">Entry Saved Successfully</span>
              </div>
              <button
                onClick={handleEdit}
                className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-secondary/50 rounded-lg"
              >
                Edit today's entry
              </button>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md ${
                canSubmit
                  ? 'text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
              }`}
              style={canSubmit ? { background: 'var(--gradient-primary)' } : undefined}
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Save Today's Entry
              </span>
            </button>
          )}
        </div>

        {/* Insights Toggle */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-card hover:shadow-md group"
          >
            <TrendingUp className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span>View Performance Insights</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showInsights ? 'rotate-180' : ''}`} />
          </button>

          {showInsights && (
            <div className="mt-4">
              <PerformanceInsights />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
