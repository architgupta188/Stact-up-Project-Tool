import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket, TrendingUp, GraduationCap, Zap, BarChart3, FileText, ArrowRight,
  Sparkles, Target, Swords, Activity, Landmark, DollarSign, AlertTriangle,
  Cpu, Calendar, Check, Database, Key, Shield
} from 'lucide-react';

const ROLES = [
  {
    icon: Rocket,
    title: 'Startup / Company',
    points: [
      'Validate startup ideas',
      'Analyze competitors',
      'Discover funding opportunities',
      'Generate action plans'
    ],
    cta: 'Validate Startup →',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'hover:border-emerald-500/50',
    shadowColor: 'hover:shadow-emerald-500/10',
    path: '/startup',
  },
  {
    icon: TrendingUp,
    title: 'Investor',
    points: [
      'Explore market opportunities',
      'Compare startup sectors',
      'Track industry trends',
      'Identify potential risks'
    ],
    cta: 'Explore Markets →',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'hover:border-blue-500/50',
    shadowColor: 'hover:shadow-blue-500/10',
    path: '/investor',
  },
  {
    icon: GraduationCap,
    title: 'Student / Explorer',
    points: [
      'Discover startup ideas',
      'Find learning paths',
      'Explore startup opportunities',
      'Build practical skills'
    ],
    cta: 'Start Exploring →',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'hover:border-purple-500/50',
    shadowColor: 'hover:shadow-purple-500/10',
    path: '/student',
  },
];

const ANALYSES = [
  { icon: Target, title: 'Problem Validation', desc: 'Scrutinizes target user pain points, willingness to pay, and product urgency.' },
  { icon: BarChart3, title: 'Market Opportunity', desc: 'Calculates TAM/SAM/SOM estimates and CAGR growth narratives.' },
  { icon: Swords, title: 'Competitor Analysis', desc: 'Maps direct competitor threats, differentiators, and positioning gaps.' },
  { icon: Activity, title: 'Industry Trends', desc: 'Tracks real-time macroeconomic updates and category growth signals.' },
  { icon: Landmark, title: 'Government Schemes', desc: 'Discovers matching government benefits, grants, and incubators.' },
  { icon: DollarSign, title: 'Funding Fit', desc: 'Assesses viability of Bootstrapping, VC funding, Angels, and Accelerators.' },
  { icon: AlertTriangle, title: 'Risk Assessment', desc: 'Evaluates critical execution risks and categorizes severity/impact.' },
  { icon: Cpu, title: 'MVP Suggestions', desc: 'Recommends core tech stacks, development scope, and architecture paths.' },
  { icon: Calendar, title: '30-Day Action Plan', desc: 'Provides weekly checklist milestones for building, research, and talks.' },
];

const STEPS = [
  { icon: FileText, title: 'Step 1: Enter Your Details', description: 'Provide your startup idea, investor preferences, or learning interests.' },
  { icon: Sparkles, title: 'Step 2: AI Generates Intelligence', description: 'Analyze markets, competitors, risks, funding options, and opportunities.' },
  { icon: BarChart3, title: 'Step 3: Review Actionable Insights', description: 'Receive structured reports with recommendations and next steps.' },
];

const CAPABILITIES = [
  'Market Analysis',
  'Competitor Research',
  'Industry Trends',
  'Government Scheme Discovery',
  'Funding Guidance',
  'Risk Assessment',
  'MVP Planning',
  'Learning Recommendations',
];

const TECH_STACK = [
  { category: 'Frontend', name: 'React + TypeScript', icon: Cpu, color: 'text-sky-400' },
  { category: 'Backend', name: 'Node.js + Express', icon: Zap, color: 'text-green-400' },
  { category: 'AI', name: 'Gemini API', icon: Sparkles, color: 'text-purple-400' },
  { category: 'Database', name: 'SQLite + Drizzle ORM', icon: Database, color: 'text-amber-400' },
  { category: 'Authentication', name: 'JWT & Local Session Auth', icon: Key, color: 'text-emerald-400' },
];

const STATS = [
  '3 Intelligence Paths',
  'AI-Powered Analysis',
  'Multi-Dimensional Reports',
  'Exportable Reports',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-primary/8 blur-[150px] animate-pulse" />
        <div className="absolute top-[50%] -right-[15%] w-[50%] h-[50%] rounded-full bg-secondary/8 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Startup Intelligence
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-syne text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Validate your startup
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary">
              like a YC partner would.
            </span>
          </motion.h1>

          {/* Core analytical bullet list */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-3xl mx-auto mb-6 text-sm text-muted-foreground font-mono"
          >
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Market Analysis</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Competitor Research</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Government Scheme Discovery</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Funding Fit Assessment</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Risk Analysis</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> MVP Recommendations</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Generate structured startup intelligence reports in under 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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

          {/* Small trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs font-mono text-muted-foreground/80"
          >
            <span>✓ Market Intelligence</span>
            <span>✓ Competitor Analysis</span>
            <span>✓ Funding Insights</span>
            <span>✓ Action Plans</span>
          </motion.div>
        </div>
      </section>

      {/* Role Cards Redesign */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">Choose Your Intelligence Path</h2>
            <p className="text-muted-foreground text-lg">Three tailored entries to explore target insights.</p>
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
                <Link to={role.path} className="block group h-full">
                  <div className={`relative p-6 rounded-2xl bg-card border border-border ${role.borderColor} transition-all duration-300 ${role.shadowColor} hover:shadow-2xl flex flex-col justify-between h-full`}>
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-syne text-xl font-bold mb-3">{role.title}</h3>
                      
                      <ul className="space-y-2 mb-6">
                        {role.points.map((p, k) => (
                          <li key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary font-mono select-none">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      {role.cta}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: What VentureIQ Analyzes */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">What VentureIQ Analyzes</h2>
            <p className="text-muted-foreground text-lg">Comprehensive multi-dimensional analysis on every project.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ANALYSES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-5 border-border hover:border-primary/30 transition-colors flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground font-syne">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Improved How It Works */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">From zero data to structured intelligence in three simple steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-primary">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-syne font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Sample Report Preview Section */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30 bg-card/25">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">See What You Get</h2>
            <p className="text-muted-foreground text-lg">A glance at the exact structured reports generated by the platform.</p>
          </motion.div>

          {/* Interactive CSS Mockup representing a real report */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card max-w-4xl mx-auto border-border/80 shadow-[0_0_50px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Mockup Header */}
            <div className="bg-card/75 border-b border-border/40 px-5 py-3.5 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-muted-foreground ml-2">report_smarthire_ai.json</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                VERDICT: REVISE
              </span>
            </div>

            {/* Mockup Content Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left text-xs bg-background/50">
              
              {/* Box 1: Verdict */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-foreground font-syne uppercase font-mono tracking-wider">Verdict</span>
                    <span className="text-amber-400 font-bold">58/100</span>
                  </div>
                  <p className="text-muted-foreground leading-normal">
                    AI recommendation suggests revising target pricing and onboarding focus to lower SMB integration friction before committing build resources.
                  </p>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 mt-2">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              {/* Box 2: Market Opportunity */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-3">
                <span className="font-bold text-foreground font-syne uppercase font-mono tracking-wider">Market Opportunity</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">TAM</span>
                    <span className="text-foreground">₹15,000 Cr</span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-1">
                    <span className="text-muted-foreground">TAM CAGR</span>
                    <span className="text-emerald-400 font-semibold">14.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opportunity Score</span>
                    <span className="text-foreground">65/100</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Competition Analysis */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-3">
                <span className="font-bold text-foreground font-syne uppercase font-mono tracking-wider">Competition Analysis</span>
                <div className="space-y-2">
                  <div className="p-1.5 rounded bg-background border border-border/50 flex justify-between items-center">
                    <span className="text-foreground font-semibold">HireVue</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold">HIGH THREAT</span>
                  </div>
                  <div className="p-1.5 rounded bg-background border border-border/50 flex justify-between items-center">
                    <span className="text-foreground font-semibold">Eightfold AI</span>
                    <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[9px] font-bold">MED THREAT</span>
                  </div>
                </div>
              </div>

              {/* Box 4: Funding Fit */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2 md:col-span-1">
                <span className="font-bold text-foreground font-syne uppercase font-mono tracking-wider">Funding Fit</span>
                <div className="space-y-2 pt-1 font-mono text-[10px]">
                  <div>
                    <div className="flex justify-between text-muted-foreground"><span>Bootstrapping</span><span>80/100</span></div>
                    <div className="w-full bg-border rounded-full h-1 mt-1"><div className="bg-emerald-500 h-1 rounded-full" style={{ width: '80%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-muted-foreground"><span>VC Funding</span><span>45/100</span></div>
                    <div className="w-full bg-border rounded-full h-1 mt-1"><div className="bg-primary/70 h-1 rounded-full" style={{ width: '45%' }} /></div>
                  </div>
                </div>
              </div>

              {/* Box 5: Action Plan */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2 md:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-foreground font-syne uppercase font-mono tracking-wider">Action Plan</span>
                  <div className="space-y-2 mt-2 font-mono text-[11px]">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold shrink-0">W1</span>
                      <span className="text-muted-foreground truncate">Build landing page & setup analytics tracker.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold shrink-0">W2</span>
                      <span className="text-muted-foreground truncate">Run mock ads campaign & initiate 10 user interviews.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">Built for Founders, Investors, and Students</h2>
            <p className="text-muted-foreground text-lg">Every capability is built directly into our active platform engines.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border flex items-center gap-2 hover:border-primary/20 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">{cap}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-20 px-4 z-10 border-t border-border/30 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">Built With Modern Technologies</h2>
            <p className="text-muted-foreground text-lg">Authentic tech stack powering VentureIQ core analytics and client dashboards.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card p-4 border-border flex flex-col items-center justify-between text-center gap-3 h-full group hover:border-primary/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  <tech.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{tech.category}</p>
                  <p className="text-xs font-bold text-foreground mt-1 leading-snug">{tech.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section (No fake counters) */}
      <section className="relative py-16 px-4 border-t border-border/30 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-foreground font-syne">{stat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-border/30 bg-card/30 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left text-sm">
          
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-syne font-bold text-xs">V</div>
              <span className="font-syne font-extrabold text-foreground">VentureIQ</span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              AI-driven multi-dimensional validation dashboards for startup builders, career seekers, and investors.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Product</h5>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li><Link to="/startup" className="hover:text-foreground transition-colors">Startup Validation</Link></li>
              <li><Link to="/investor" className="hover:text-foreground transition-colors">Investor Intelligence</Link></li>
              <li><Link to="/student" className="hover:text-foreground transition-colors">Student Explorer</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Resources</h5>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Company</h5>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li><a href="#about" className="hover:text-foreground transition-colors">About VentureIQ</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-5xl mx-auto text-center border-t border-border/20 pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VentureIQ. Built authentically for founders, investors, and students.
          </p>
        </div>
      </footer>
    </div>
  );
}
