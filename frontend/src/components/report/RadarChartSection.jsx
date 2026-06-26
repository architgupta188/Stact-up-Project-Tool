import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const BENCHMARK = 6; // "Average startup" benchmark line

export default function RadarChartSection({ scores }) {
  const entries = Object.entries(scores);

  const radarData = entries.map(([key, val]) => ({
    dimension: key.replace(/([A-Z])/g, ' $1').trim(),
    score: val.score || 0,
    benchmark: BENCHMARK,
    fullMark: 10,
  }));

  // Find strongest and weakest
  const sorted = [...entries].sort((a, b) => b[1].score - a[1].score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50 text-xs">
          <p className="font-semibold text-foreground mb-1">{data.dimension}</p>
          <p className="text-primary">Score: {data.score}/10</p>
          <p className="text-muted-foreground">Benchmark: {data.benchmark}/10</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4">
      {/* Chart - 2x size */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-[500px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#475569' }}
              axisLine={false}
            />
            {/* Benchmark area */}
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#475569"
              fill="#475569"
              fillOpacity={0.05}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Actual scores */}
            <Radar
              name="Score"
              dataKey="score"
              stroke="#00DF82"
              fill="#00DF82"
              fillOpacity={0.15}
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00DF82', strokeWidth: 0 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Strongest & Weakest Callouts */}
      {strongest && weakest && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="glass-card p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400 mb-0.5">Strongest Dimension</div>
              <div className="text-sm font-medium capitalize">{strongest[0].replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{strongest[1].score}/10 — {strongest[1].rationale}</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-red-400 mb-0.5">Weakest Dimension</div>
              <div className="text-sm font-medium capitalize">{weakest[0].replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{weakest[1].score}/10 — {weakest[1].rationale}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
