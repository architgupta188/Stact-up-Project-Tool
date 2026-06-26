import { motion } from 'framer-motion';
import { DollarSign, Star } from 'lucide-react';

function getBarWidth(value) {
  return `${(value / 10) * 100}%`;
}

function getBarColor(value) {
  if (value >= 8) return 'bg-emerald-500';
  if (value >= 6) return 'bg-blue-500';
  if (value >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function MonetizationAnalysis({ data }) {
  // Sort by recommendation score
  const sortedModels = [...data.models].sort((a, b) => b.recommendationScore - a.recommendationScore);
  const bestModel = sortedModels[0];

  return (
    <div className="space-y-4 mt-4">
      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedModels.map((model, i) => {
          const isBest = model.model === bestModel?.model;
          return (
            <motion.div
              key={model.model}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 relative ${isBest ? 'premium-glow' : ''}`}
            >
              {isBest && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary">RECOMMENDED</span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm">{model.model}</h4>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Revenue Potential', value: model.revenuePotential },
                  { label: 'Ease of Execution', value: model.easeOfExecution },
                  { label: 'Scalability', value: model.scalability },
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                      <span className="text-[10px] font-semibold">{metric.value}/10</span>
                    </div>
                    <div className="score-bar">
                      <motion.div
                        className={`score-bar-fill ${getBarColor(metric.value)}`}
                        initial={{ width: '0%' }}
                        animate={{ width: getBarWidth(metric.value) }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Recommendation Score</span>
                <span className={`font-syne text-lg font-bold ${model.recommendationScore >= 7 ? 'text-emerald-400' : model.recommendationScore >= 4 ? 'text-amber-400' : 'text-red-400'}`}>
                  {model.recommendationScore}/10
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{model.notes}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Best Path Recommendation */}
      {data.bestPath && (
        <div className="glass-card p-4 border-l-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Recommended Monetization Path</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.bestPath}</p>
        </div>
      )}
    </div>
  );
}
