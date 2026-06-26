import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function getScoreColor(score) {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-blue-400';
  if (score >= 25) return 'text-amber-400';
  return 'text-red-400';
}

export default function MarketOpportunity({ data }) {
  const metrics = [
    { label: 'TAM', sublabel: 'Total Addressable Market', value: data.tamEstimate, cagr: data.tamCagr, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20' },
    { label: 'SAM', sublabel: 'Serviceable Addressable Market', value: data.samEstimate, cagr: data.samCagr, color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20' },
    { label: 'SOM', sublabel: 'Serviceable Obtainable Market', value: data.somEstimate, cagr: data.somCagr, color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20' },
  ];

  return (
    <div className="space-y-4 mt-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${metric.color} border`}
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">{metric.sublabel}</div>
            <div className="font-syne text-2xl font-bold mb-1">{metric.value || '—'}</div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/50 text-foreground">
                {metric.label}
              </span>
              {metric.cagr && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">{metric.cagr} CAGR</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Opportunity Score */}
      {data.opportunityScore !== undefined && data.opportunityScore !== null && (
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-muted-foreground">OPPORTUNITY SCORE</div>
            <div className="text-sm text-muted-foreground mt-1">Overall market attractiveness assessment</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="score-bar w-32">
              <motion.div
                className={`score-bar-fill ${data.opportunityScore >= 70 ? 'bg-emerald-500' : data.opportunityScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                initial={{ width: '0%' }}
                animate={{ width: `${data.opportunityScore}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <span className={`font-syne text-2xl font-bold ${getScoreColor(data.opportunityScore)}`}>
              {data.opportunityScore}
            </span>
          </div>
        </div>
      )}

      {/* Narrative */}
      {data.narrative && (
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{data.narrative}</p>
      )}
    </div>
  );
}
