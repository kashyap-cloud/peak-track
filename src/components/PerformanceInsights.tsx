import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Brain, Shield, BarChart3 } from 'lucide-react';
import { getLast7Days, getLast14Days, getConsistencyZone } from '@/lib/tracker-data';

export default function PerformanceInsights() {
  const last7 = getLast7Days();
  const last14 = getLast14Days();

  const trendData = useMemo(() => {
    return last7.map(e => ({
      date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      score: e.execution_score,
    }));
  }, [last7]);

  const blockerData = useMemo(() => {
    const counts: Record<string, number> = {};
    last14.forEach(e => {
      counts[e.primary_blocker] = (counts[e.primary_blocker] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [last14]);

  const consistency = useMemo(() => {
    if (last7.length === 0) return null;
    const avg = last7.reduce((s, e) => s + e.execution_score, 0) / last7.length;
    return { avg: Math.round(avg * 10) / 10, ...getConsistencyZone(avg) };
  }, [last7]);

  const correlation = useMemo(() => {
    if (last7.length < 2) return null;
    const highClarity = last7.filter(e => e.mental_clarity >= 7);
    const lowClarity = last7.filter(e => e.mental_clarity < 7);
    if (highClarity.length === 0 || lowClarity.length === 0) return null;
    const highAvg = highClarity.reduce((s, e) => s + e.execution_score, 0) / highClarity.length;
    const lowAvg = lowClarity.reduce((s, e) => s + e.execution_score, 0) / lowClarity.length;
    const improvement = Math.round(((highAvg - lowAvg) / lowAvg) * 100);
    return improvement > 0 ? improvement : null;
  }, [last7]);

  if (last7.length === 0) {
    return (
      <div className="stat-card text-center py-8">
        <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Start tracking to see your performance insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 7-Day Trend */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">7-Day Execution Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData}>
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(215 12% 48%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: 'hsl(215 12% 48%)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(220 14% 9%)',
                border: '1px solid hsl(220 12% 16%)',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              labelStyle={{ color: 'hsl(215 12% 48%)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(160 64% 43%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(160 64% 43%)', r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(160 64% 43%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation + Consistency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {correlation && (
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-info" />
              <h3 className="text-sm font-medium text-foreground">Focus × Execution</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              On days your Mental Clarity is above 7, your Execution improves by{' '}
              <span className="font-mono font-semibold text-primary">{correlation}%</span>.
            </p>
          </div>
        )}

        {consistency && (
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-medium text-foreground">Consistency Score</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{consistency.avg}</span>
              <span className="text-xs">/10</span>
            </div>
            <p className={`text-xs font-medium mt-1 ${
              consistency.zone === 'high' ? 'zone-high' :
              consistency.zone === 'moderate' ? 'zone-moderate' : 'zone-low'
            }`}>
              {consistency.label}
            </p>
          </div>
        )}
      </div>

      {/* Blocker Frequency */}
      {blockerData.length > 0 && (
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-medium text-foreground">Blocker Frequency (14 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={blockerData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'hsl(215 12% 48%)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {blockerData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'hsl(35 90% 55%)' : 'hsl(220 12% 20%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
