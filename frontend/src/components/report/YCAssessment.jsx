import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

function getGradeColor(grade) {
  const g = grade?.replace(/[+-]/g, '').toUpperCase();
  if (g === 'A') return 'text-emerald-400 bg-emerald-500/15';
  if (g === 'B') return 'text-blue-400 bg-blue-500/15';
  if (g === 'C') return 'text-amber-400 bg-amber-500/15';
  if (g === 'D') return 'text-orange-400 bg-orange-500/15';
  return 'text-red-400 bg-red-500/15';
}

const GRADE_ITEMS = [
  { key: 'marketGrade', label: 'Market' },
  { key: 'timingGrade', label: 'Timing' },
  { key: 'moatGrade', label: 'Moat' },
  { key: 'scalabilityGrade', label: 'Scalability' },
  { key: 'founderMarketFitGrade', label: 'Founder-Market Fit' },
];

export default function YCAssessment({ data }) {
  const overallColor = getGradeColor(data.overallGrade);

  return (
    <div className="mt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card premium-glow p-6"
      >
        {/* Header with Overall Grade */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-syne font-bold text-lg">YC-Style Investor Review</h4>
              <p className="text-xs text-muted-foreground">Assessment from the perspective of a YC partner</p>
            </div>
          </div>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${overallColor}`}>
            <span className="font-syne text-2xl font-bold">{data.overallGrade}</span>
          </div>
        </div>

        {/* Grade Grid */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {GRADE_ITEMS.map(({ key, label }, i) => {
            const grade = data[key];
            const color = getGradeColor(grade);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center ${color} mb-2`}>
                  <span className="font-syne text-xl font-bold">{grade}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Assessment Paragraph */}
        {data.assessmentParagraph && (
          <div className="p-4 rounded-xl bg-accent/20 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-400">💬 Investor Assessment</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{data.assessmentParagraph}"
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
