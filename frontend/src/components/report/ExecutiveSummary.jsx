import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Target, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

function getGradeColor(grade) {
  const g = grade?.replace(/[+-]/g, '').toUpperCase();
  if (g === 'A') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (g === 'B') return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  if (g === 'C') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (g === 'D') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

function getScoreColor(score) {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-blue-500';
  if (score >= 25) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreBadge(score) {
  if (score >= 80) return { text: 'Excellent', color: 'text-emerald-400' };
  if (score >= 60) return { text: 'Good', color: 'text-blue-400' };
  if (score >= 40) return { text: 'Fair', color: 'text-amber-400' };
  if (score >= 20) return { text: 'Weak', color: 'text-orange-400' };
  return { text: 'Critical', color: 'text-red-400' };
}

const METRIC_CONFIG = [
  { key: 'investmentReadiness', label: 'Investment Readiness', icon: Shield },
  { key: 'marketPotential', label: 'Market Potential', icon: TrendingUp },
  { key: 'executionFeasibility', label: 'Execution Feasibility', icon: Zap },
  { key: 'fundingPotential', label: 'Funding Potential', icon: Target },
  { key: 'competitionRisk', label: 'Competition Risk', icon: AlertTriangle },
];

export default function ExecutiveSummary({ summary }) {
  const gradeColor = getGradeColor(summary.overallGrade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      {/* Overall Grade + Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Large Grade Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`glass-card p-4 flex flex-col items-center justify-center border ${gradeColor.split(' ').slice(1).join(' ')}`}
        >
          <div className="text-xs font-mono text-muted-foreground mb-1">OVERALL</div>
          <div className={`font-syne text-3xl font-bold ${gradeColor.split(' ')[0]}`}>
            {summary.overallGrade}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Grade</div>
        </motion.div>

        {/* Metric Cards */}
        {METRIC_CONFIG.map(({ key, label, icon: Icon }, i) => {
          const value = summary[key];
          const badge = getScoreBadge(value);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
              </div>
              <div className="font-syne text-2xl font-bold">{value}</div>
              <div className="score-bar mt-2">
                <motion.div
                  className={`score-bar-fill ${getScoreColor(value)}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                />
              </div>
              <div className={`text-[10px] mt-1 font-medium ${badge.color}`}>{badge.text}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.biggestOpportunity && (
          <div className="glass-card-hover p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">Biggest Opportunity</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{summary.biggestOpportunity}</p>
          </div>
        )}
        {summary.biggestRisk && (
          <div className="glass-card-hover p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span className="text-xs font-semibold text-red-400">Biggest Risk</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{summary.biggestRisk}</p>
          </div>
        )}
        {summary.recommendedNextStep && (
          <div className="glass-card-hover p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-400">Next Step</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{summary.recommendedNextStep}</p>
          </div>
        )}
        {summary.suggestedPivot && summary.suggestedPivot !== 'N/A' && (
          <div className="glass-card-hover p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-purple-400">Suggested Pivot</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{summary.suggestedPivot}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
