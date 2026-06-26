import { motion } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';

const SEVERITY_CONFIG = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500', dot: 'bg-amber-500' },
  low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500', dot: 'bg-emerald-500' },
};

const LEVEL_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function RisksMitigation({ risks }) {
  return (
    <div className="space-y-3 mt-4">
      {risks.map((risk, i) => {
        const config = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.medium;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-4 border-l-3 ${config.border}`}
            style={{ borderLeftWidth: '3px' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              {/* Risk Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${config.bg} ${config.text}`}>
                    {risk.severity.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-semibold">{risk.risk}</h4>
                </div>

                {/* Probability & Impact badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {risk.probability && (
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Probability:</span>
                      <span className={`text-[10px] font-semibold ${SEVERITY_CONFIG[risk.probability]?.text || 'text-muted-foreground'}`}>
                        {LEVEL_LABELS[risk.probability] || risk.probability}
                      </span>
                    </div>
                  )}
                  {risk.impact && (
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Impact:</span>
                      <span className={`text-[10px] font-semibold ${SEVERITY_CONFIG[risk.impact]?.text || 'text-muted-foreground'}`}>
                        {LEVEL_LABELS[risk.impact] || risk.impact}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mitigation */}
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/20">
                  <span className="text-xs">💡</span>
                  <div>
                    <span className="text-[10px] font-semibold text-primary">Mitigation Plan</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
