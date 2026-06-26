import { motion } from 'framer-motion';
import { Wallet, Users, Rocket, Building2, Landmark, Star } from 'lucide-react';

const FUNDING_CONFIG = [
  { key: 'bootstrapScore', label: 'Bootstrap', icon: Wallet, color: 'bg-emerald-500', desc: 'Self-funded growth' },
  { key: 'angelScore', label: 'Angel Investor', icon: Users, color: 'bg-blue-500', desc: 'Early-stage angels' },
  { key: 'acceleratorScore', label: 'Accelerator', icon: Rocket, color: 'bg-purple-500', desc: 'YC, Techstars, etc.' },
  { key: 'vcScore', label: 'Venture Capital', icon: Building2, color: 'bg-amber-500', desc: 'Institutional VC' },
  { key: 'grantScore', label: 'Government Grant', icon: Landmark, color: 'bg-teal-500', desc: 'Non-dilutive funding' },
];

export default function FundingReadiness({ data }) {
  const sorted = [...FUNDING_CONFIG].sort((a, b) => {
    const aVal = data[a.key] || 0;
    const bVal = data[b.key] || 0;
    return bVal - aVal;
  });
  const bestKey = sorted[0]?.key;

  return (
    <div className="space-y-4 mt-4">
      {/* Score Bars */}
      <div className="space-y-3">
        {FUNDING_CONFIG.map(({ key, label, icon: Icon, color, desc }, i) => {
          const score = data[key] || 0;
          const isBest = key === bestKey;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 ${isBest ? 'premium-glow' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${color}/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{label}</span>
                      {isBest && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                          <Star className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[9px] font-bold text-primary">BEST FIT</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{desc}</span>
                  </div>
                </div>
                <span className={`font-syne text-xl font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {score}
                </span>
              </div>
              <div className="score-bar">
                <motion.div
                  className={`score-bar-fill ${color}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation */}
      {data.recommendation && (
        <div className="glass-card p-4 border-l-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              Best Path: {data.bestPath}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.recommendation}</p>
        </div>
      )}
    </div>
  );
}
