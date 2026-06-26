import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp } from 'lucide-react';

const verdictConfig = {
  go: { bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-500/30', label: 'GO', emoji: '🚀', color: '#00DF82' },
  revise: { bg: 'from-amber-500/10 to-yellow-500/5', border: 'border-amber-500/30', label: 'CONDITIONAL GO', emoji: '🔄', color: '#F6C144' },
  'no-go': { bg: 'from-red-500/10 to-rose-500/5', border: 'border-red-500/30', label: 'NO-GO', emoji: '⛔', color: '#FF4A4A' },
};

export default function EnhancedVerdict({ verdict, score, rationale, confidence, topReasons, pivotStrategy, keySuccessFactor }) {
  const c = verdictConfig[verdict] || verdictConfig['revise'];
  const circumference = 2 * Math.PI * 58;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} shadow-2xl overflow-hidden animate-pulse-glow`}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        {/* Top row: Score gauge + Verdict */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Large Score Gauge */}
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="6" className="text-border/30" />
              <motion.circle
                cx="64" cy="64" r="58" fill="none"
                stroke={c.color}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              {/* Glow effect */}
              <motion.circle
                cx="64" cy="64" r="58" fill="none"
                stroke={c.color}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                opacity={0.15}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="font-syne text-4xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Verdict Info */}
          <div className="text-center md:text-left flex-1">
            <div className="text-xs font-mono text-muted-foreground mb-1 tracking-widest">VERDICT</div>
            <div className="font-syne text-4xl font-bold flex items-center gap-3 justify-center md:justify-start">
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </div>
            {confidence !== undefined && (
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Confidence: <span className="text-foreground font-semibold">{confidence}%</span></span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-3 max-w-lg">{rationale}</p>
          </div>
        </div>

        {/* Top 3 Reasons */}
        {topReasons && topReasons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            {topReasons.slice(0, 3).map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-accent/20 border border-border/30"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Key Success Factor + Pivot Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {keySuccessFactor && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-emerald-400 mb-0.5">Key Success Factor</div>
                <p className="text-xs text-muted-foreground">{keySuccessFactor}</p>
              </div>
            </div>
          )}
          {pivotStrategy && pivotStrategy !== 'N/A' && pivotStrategy !== 'No pivot needed — execute as planned.' && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-amber-400 mb-0.5">Recommended Pivot</div>
                <p className="text-xs text-muted-foreground">{pivotStrategy}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
