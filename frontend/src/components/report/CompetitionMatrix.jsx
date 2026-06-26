import { motion } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Label
} from 'recharts';

const COLORS = {
  startup: '#00DF82',
  high: '#FF4A4A',
  medium: '#F6C144',
  low: '#00A3FF',
};

export default function CompetitionMatrix({ competitors, startupName }) {
  // Filter competitors that have positioning data
  const positioned = competitors.filter(c => c.marketIntegration && c.productDifferentiation);

  if (positioned.length === 0) return null;

  // Create scatter data: competitors + startup idea
  const scatterData = [
    ...positioned.map(c => ({
      x: c.marketIntegration,
      y: c.productDifferentiation,
      name: c.name,
      threat: c.threat,
      isStartup: false,
    })),
    {
      x: 3, // Startup is typically low market integration (new entrant)
      y: 7, // But aims for high differentiation
      name: startupName,
      threat: 'startup',
      isStartup: true,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50 text-xs">
          <p className="font-semibold text-foreground mb-1">{data.name}</p>
          <p className="text-muted-foreground">Market Integration: {data.x}/10</p>
          <p className="text-muted-foreground">Differentiation: {data.y}/10</p>
          {!data.isStartup && (
            <p className={`mt-1 font-medium ${data.threat === 'high' ? 'text-red-400' : data.threat === 'medium' ? 'text-amber-400' : 'text-blue-400'}`}>
              {data.threat} threat
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getColor = (entry) => {
    if (entry.isStartup) return COLORS.startup;
    return COLORS[entry.threat] || COLORS.medium;
  };

  return (
    <div className="mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickCount={6}
            >
              <Label value="Market Integration →" position="bottom" offset={10} style={{ fill: '#94a3b8', fontSize: 11 }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickCount={6}
            >
              <Label value="Product Differentiation →" angle={-90} position="left" offset={0} style={{ fill: '#94a3b8', fontSize: 11 }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Scatter data={scatterData} nameKey="name">
              {scatterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry)}
                  r={entry.isStartup ? 10 : 7}
                  stroke={entry.isStartup ? '#fff' : 'transparent'}
                  strokeWidth={entry.isStartup ? 2 : 0}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#00DF82] border-2 border-white" />
          <span className="text-xs text-muted-foreground">{startupName} (You)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF4A4A]" />
          <span className="text-xs text-muted-foreground">High Threat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F6C144]" />
          <span className="text-xs text-muted-foreground">Medium Threat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00A3FF]" />
          <span className="text-xs text-muted-foreground">Low Threat</span>
        </div>
      </div>

      {/* Gap identification */}
      <div className="mt-4 p-3 rounded-xl bg-accent/20 border border-border/30">
        <div className="text-xs font-semibold text-primary mb-1">💡 Market Gap</div>
        <p className="text-xs text-muted-foreground">
          The upper-left quadrant (high differentiation, low market integration) represents your opportunity zone — 
          unique products that haven't yet been deeply integrated into the market ecosystem.
        </p>
      </div>
    </div>
  );
}
