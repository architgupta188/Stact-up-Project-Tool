import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, GraduationCap, Zap, BarChart3, FileText, ArrowRight, Sparkles } from 'lucide-react';

const ROLES = [
  {
    icon: Rocket,
    title: 'Startup / Company',
    description: 'Validate your idea, score your MVP readiness, and discover funding paths.',
    color: 'from-emerald-500 to-teal-600',
    path: '/startup',
  },
  {
    icon: TrendingUp,
    title: 'Investor',
    description: 'Discover promising sectors, red flags, and emerging investment opportunities.',
    color: 'from-blue-500 to-indigo-600',
    path: '/investor',
  },
  {
    icon: GraduationCap,
    title: 'Student / Explorer',
    description: 'Find startup ideas matching your skills, budget, and career intent.',
    color: 'from-purple-500 to-pink-600',
    path: '/student',
  },
];

const STEPS = [
  { icon: FileText, title: 'Submit Your Details', description: 'Pick your role and fill in your idea, profile, or interests.' },
  { icon: Sparkles, title: 'AI Analyses Everything', description: 'Market trends, competition, government schemes — all processed in real-time.' },
  { icon: BarChart3, title: 'Get Your Report', description: 'A scored validation report with a 30-day action plan. Export as PDF.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-primary/8 blur-[150px] animate-pulse" />
        <div className="absolute top-[50%] -right-[15%] w-[50%] h-[50%] rounded-full bg-secondary/8 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Startup Intelligence
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-syne text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Validate your startup
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary">
              like a YC partner would.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Investor-grade analysis. Structured scoring. Market intelligence.
            Government scheme discovery. All in under 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/onboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,223,130,0.25)] hover:shadow-[0_0_40px_rgba(0,223,130,0.4)]"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/onboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-card/80 transition-colors"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">Who are you?</h2>
            <p className="text-muted-foreground text-lg">Three tailored paths. One powerful intelligence engine.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={role.path} className="block group">
                  <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,223,130,0.1)] h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-syne text-xl font-bold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">From idea to intelligence in three steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-2">STEP {i + 1}</div>
                <h3 className="font-syne font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative py-16 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '2,400+', label: 'Reports Generated' },
              { value: '3', label: 'Intelligence Paths' },
              { value: '<60s', label: 'Report Generation' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-syne text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} VentureIQ. AI-powered startup intelligence.
        </p>
      </footer>
    </div>
  );
}
