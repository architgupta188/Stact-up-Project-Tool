import { motion } from 'framer-motion';

const DIMENSION_LABELS = {
  painLevel: { label: 'Pain Level', emoji: '🔥' },
  urgency: { label: 'Urgency', emoji: '⏰' },
  marketSize: { label: 'Market Size', emoji: '🌍' },
  adoptionSpeed: { label: 'Adoption Speed', emoji: '⚡' },
  competitionIntensity: { label: 'Competition', emoji: '⚔️' },
  willingnessToPay: { label: 'Willingness to Pay', emoji: '💰' },
  differentiation: { label: 'Differentiation', emoji: '🎯' },
  executionDifficulty: { label: 'Execution', emoji: '🔧' },
  mvpFeasibility: { label: 'MVP Feasibility', emoji: '🚀' },
  marketTiming: { label: 'Market Timing', emoji: '📅' },
};

function getScoreColor(score) {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

function getBarColor(score) {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

function getStatusLabel(score) {
  if (score >= 8) return { text: 'Strong', color: 'bg-emerald-500/10 text-emerald-400' };
  if (score >= 6) return { text: 'Good', color: 'bg-blue-500/10 text-blue-400' };
  if (score >= 4) return { text: 'Fair', color: 'bg-amber-500/10 text-amber-400' };
  return { text: 'Weak', color: 'bg-red-500/10 text-red-400' };
}

export default function DimensionScores({ scores }) {
  const entries = Object.entries(scores);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      {entries.map(([key, val], i) => {
        const config = DIMENSION_LABELS[key] || { label: key.replace(/([A-Z])/g, ' $1').trim(), emoji: '📊' };
        const status = getStatusLabel(val.score);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{config.emoji}</span>
                <span className="text-xs font-medium">{config.label}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className={`font-syne text-2xl font-bold ${getScoreColor(val.score)}`}>
                {val.score}
              </span>
              <span className="text-xs text-muted-foreground mb-1">/10</span>
            </div>

            <div className="score-bar mb-2">
              <motion.div
                className={`score-bar-fill ${getBarColor(val.score)}`}
                initial={{ width: '0%' }}
                animate={{ width: `${(val.score / 10) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
              />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{val.rationale}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
