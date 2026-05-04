import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { useReportStore } from '../store/reportStore';

const PIPELINE_STEPS = [
  { label: 'Classifying your idea...', emoji: '🏷️' },
  { label: 'Researching market trends...', emoji: '📈' },
  { label: 'Scanning government schemes...', emoji: '🏛️' },
  { label: 'Evaluating competition...', emoji: '🔍' },
  { label: 'Calculating validation score...', emoji: '📊' },
  { label: 'Writing your full report...', emoji: '📝' },
];

export default function Generating() {
  const navigate = useNavigate();
  const { currentReportId, generationStatus, pipelineStep } = useReportStore();
  const [activeStep, setActiveStep] = useState(0);
  const [dots, setDots] = useState('');

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance steps for visual effect
  useEffect(() => {
    const stepFromServer = pipelineStep;
    if (stepFromServer > activeStep) {
      setActiveStep(stepFromServer);
    } else {
      // Simulate step progression if server is slow
      const timer = setTimeout(() => {
        setActiveStep(prev => Math.min(prev + 1, PIPELINE_STEPS.length - 1));
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [pipelineStep, activeStep]);

  // Navigate on completion
  useEffect(() => {
    if (generationStatus === 'complete' && currentReportId) {
      setTimeout(() => navigate(`/report/${currentReportId}`), 1000);
    }
    if (generationStatus === 'error') {
      setTimeout(() => navigate('/onboard'), 3000);
    }
  }, [generationStatus, currentReportId, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[200px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
          </div>
          <h1 className="font-syne text-3xl font-bold mb-2">Analysing Your Idea</h1>
          <p className="text-muted-foreground">This usually takes 45-60 seconds{dots}</p>
        </motion.div>

        <div className="space-y-3">
          {PIPELINE_STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDone || isActive ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive ? 'bg-card border border-primary/30 shadow-[0_0_20px_rgba(0,223,130,0.1)]' :
                  isDone ? 'bg-card/50 border border-border/50' : 'bg-transparent border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isDone ? 'bg-primary text-primary-foreground' :
                  isActive ? 'bg-primary/20' : 'bg-card border border-border'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> :
                   isActive ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> :
                   <span className="text-sm">{step.emoji}</span>}
                </div>

                <span className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-foreground' :
                  isDone ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 bg-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(((activeStep + 1) / PIPELINE_STEPS.length) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {generationStatus === 'error' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-destructive mt-4 text-sm"
          >
            Something went wrong. Redirecting...
          </motion.p>
        )}
      </div>
    </div>
  );
}
