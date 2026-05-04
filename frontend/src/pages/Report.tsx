import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, Shield, Lightbulb, Users, BarChart3, Swords, TrendingUp,
  Landmark, Rocket, AlertTriangle, CheckCircle, Calendar, MessageSquare,
  Share2, Loader2, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer
} from 'recharts';
import { useAuthStore } from '../store/authStore';

interface ReportData {
  id: string;
  role: string;
  status: string;
  inputData: Record<string, unknown>;
  outputData: Record<string, any>; // Temporarily keeping any for outputData since it is accessed dynamically heavily
  score: number;
  verdict: string;
  shareToken: string | null;
  ideaName: string;
  createdAt: string;
}


const THREAT_BG = { low: 'bg-emerald-500/10 text-emerald-400', medium: 'bg-amber-500/10 text-amber-400', high: 'bg-red-500/10 text-red-400' };

function VerdictBanner({ verdict, score, rationale }: { verdict: string; score: number; rationale: string }) {
  const config: Record<string, { bg: string; border: string; shadow: string; label: string; emoji: string }> = {
    go: { bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-500/30', shadow: 'shadow-emerald-500/10', label: 'GO', emoji: '🚀' },
    revise: { bg: 'from-amber-500/10 to-yellow-500/5', border: 'border-amber-500/30', shadow: 'shadow-amber-500/10', label: 'REVISE', emoji: '🔄' },
    'no-go': { bg: 'from-red-500/10 to-rose-500/5', border: 'border-red-500/30', shadow: 'shadow-red-500/10', label: 'NO-GO', emoji: '⛔' },
  };
  const c = config[verdict] || config['revise'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} ${c.shadow} shadow-2xl overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score Ring */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/30" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 314} 314`} />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={verdict === 'go' ? '#00DF82' : verdict === 'revise' ? '#F6C144' : '#FF4A4A'} />
                <stop offset="100%" stopColor={verdict === 'go' ? '#00A3FF' : verdict === 'revise' ? '#FF9500' : '#FF0000'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-syne text-3xl font-bold">{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="text-sm font-mono text-muted-foreground mb-1">VERDICT</div>
          <div className="font-syne text-4xl font-bold flex items-center gap-3">
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">{rationale}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SectionCard({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-accent/30 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-syne font-bold text-lg">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 pt-0 border-t border-border/50">{children}</div>}
    </motion.div>
  );
}

export default function ReportPage() {
  const { reportId } = useParams();
  const { token } = useAuthStore();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId, token]);

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/report/${reportId}/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setShareLink(data.shareUrl);
      navigator.clipboard.writeText(data.shareUrl);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!report || !report.outputData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Report not found or still generating.</p>
        <Link to="/history" className="text-primary hover:underline text-sm">← Back to history</Link>
      </div>
    );
  }

  const output = report.outputData;
  const isStartup = output.role === 'startup';
  const sections = output.sections;
  const scores = isStartup ? output.dimensionScores : null;

  // Prepare radar data
  const radarData = scores ? Object.entries(scores).map(([key, val]) => {
    const data = val as { score?: number };
    return {
      dimension: key.replace(/([A-Z])/g, ' $1').trim(),
      score: data.score || 0,
      fullMark: 10,
    };
  }) : [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-1">REPORT</p>
            <h1 className="font-syne text-3xl font-bold">{report.ideaName || 'Intelligence Report'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generated {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm hover:bg-accent/30 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <Link to={`/report/${reportId}/chat`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <MessageSquare className="w-4 h-4" /> Ask Questions
            </Link>
          </div>
        </div>

        {shareLink && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
            <p className="text-sm text-primary truncate">{shareLink}</p>
            <span className="text-xs text-primary font-medium shrink-0 ml-2">Copied!</span>
          </motion.div>
        )}

        {/* Verdict Banner (Startup only) */}
        {isStartup && output.compositeScore !== undefined && (
          <VerdictBanner verdict={output.verdict} score={output.compositeScore} rationale={output.verdictRationale} />
        )}

        {/* Radar Chart (Startup only) */}
        {isStartup && radarData.length > 0 && (
          <SectionCard title="Dimension Scores" icon={BarChart3}>
            <div className="h-80 mt-4">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10, fill: '#475569' }} />
                  <Radar name="Score" dataKey="score" stroke="#00DF82" fill="#00DF82" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {scores && Object.entries(scores).map(([key, val]) => {
                const data = val as { score: number; rationale: string };
                return (
                  <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                    <div className={`text-sm font-bold ${data.score >= 7 ? 'text-emerald-400' : data.score >= 4 ? 'text-amber-400' : 'text-red-400'}`}>
                      {data.score}/10
                    </div>
                    <div>
                      <div className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{data.rationale}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Startup-specific sections */}
        {isStartup && (
          <>
            {sections.ideaSummary && (
              <SectionCard title="Idea Summary" icon={Lightbulb}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.ideaSummary}</p>
              </SectionCard>
            )}

            {sections.problemAnalysis && (
              <SectionCard title="Problem Analysis" icon={Target} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.problemAnalysis}</p>
              </SectionCard>
            )}

            {sections.targetAudienceAnalysis && (
              <SectionCard title="Target Audience" icon={Users} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.targetAudienceAnalysis}</p>
              </SectionCard>
            )}

            {sections.marketOpportunity && (
              <SectionCard title="Market Opportunity" icon={BarChart3} defaultOpen={false}>
                <div className="space-y-4 mt-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'TAM', value: sections.marketOpportunity.tamEstimate },
                      { label: 'SAM', value: sections.marketOpportunity.samEstimate },
                      { label: 'SOM', value: sections.marketOpportunity.somEstimate },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-lg bg-accent/30 text-center">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-medium mt-1">{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{sections.marketOpportunity.narrative}</p>
                </div>
              </SectionCard>
            )}

            {sections.competitionAnalysis?.competitors?.length > 0 && (
              <SectionCard title="Competition" icon={Swords} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.competitionAnalysis.competitors.map((c: { name: string, threat: string, description: string, differentiator: string }, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-accent/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{c.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAT_BG[c.threat as keyof typeof THREAT_BG] || THREAT_BG.medium}`}>
                          {c.threat} threat
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      <p className="text-xs text-primary mt-1">Gap: {c.differentiator}</p>
                    </div>
                  ))}
                  {sections.competitionAnalysis.positioning && (
                    <p className="text-sm leading-relaxed mt-2">{sections.competitionAnalysis.positioning}</p>
                  )}
                </div>
              </SectionCard>
            )}

            {sections.industryTrends?.length > 0 && (
              <SectionCard title="Industry Trends" icon={TrendingUp} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.industryTrends.map((t: { title: string, summary: string, source: string }, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-accent/30 border-l-2 border-primary">
                      <h4 className="text-sm font-bold">{t.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t.summary}</p>
                      {t.source && <p className="text-xs text-primary/70 mt-1">— {t.source}</p>}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {sections.governmentSchemes?.length > 0 && (
              <SectionCard title="Government Schemes" icon={Landmark} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.governmentSchemes.map((s: { name: string, link: string, description: string, eligibility: string, benefit: string }, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-accent/30">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        {s.name}
                        {s.link && <a href={s.link} target="_blank" rel="noopener" className="text-primary"><ExternalLink className="w-3 h-3" /></a>}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span><strong>Eligibility:</strong> {s.eligibility}</span>
                        <span><strong>Benefit:</strong> {s.benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {sections.mvpSuggestions && (
              <SectionCard title="MVP Suggestions" icon={Rocket} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.mvpSuggestions}</p>
              </SectionCard>
            )}

            {sections.risks?.length > 0 && (
              <SectionCard title="Risks & Mitigations" icon={AlertTriangle} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.risks.map((r: { severity: string, risk: string, mitigation: string }, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-accent/30 flex gap-3">
                      <div className={`text-xs font-bold px-2 py-0.5 rounded-full h-fit ${THREAT_BG[r.severity as keyof typeof THREAT_BG] || THREAT_BG.medium}`}>
                        {r.severity}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.risk}</p>
                        <p className="text-xs text-muted-foreground mt-1">💡 {r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {sections.recommendations?.length > 0 && (
              <SectionCard title="Recommendations" icon={CheckCircle} defaultOpen={false}>
                <div className="space-y-2 mt-3">
                  {sections.recommendations.map((r: { priority: string, action: string, reason: string }, i: number) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {r.priority}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {sections.actionPlan?.length > 0 && (
              <SectionCard title="30-Day Action Plan" icon={Calendar} defaultOpen={false}>
                <div className="space-y-4 mt-3">
                  {sections.actionPlan.map((week: { week: number, goal: string, tasks: string[] }) => (
                    <div key={week.week} className="p-4 rounded-xl bg-accent/30">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">W{week.week}</span>
                        {week.goal}
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {week.tasks?.map((task: string, ti: number) => (
                          <li key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {sections.fundingFit && (
              <SectionCard title="Funding Fit" icon={Shield} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.fundingFit}</p>
              </SectionCard>
            )}

            {sections.finalVerdict && (
              <SectionCard title="Final Verdict" icon={Target}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line font-medium">{sections.finalVerdict}</p>
              </SectionCard>
            )}
          </>
        )}

        {/* Investor report sections */}
        {output.role === 'investor' && sections && (
          <>
            {sections.sectorOverview && (
              <SectionCard title="Sector Overview" icon={BarChart3}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.sectorOverview}</p>
              </SectionCard>
            )}
            {sections.trendingCategories?.length > 0 && (
              <SectionCard title="Trending Categories" icon={TrendingUp}>
                <div className="space-y-3 mt-3">
                  {sections.trendingCategories.map((cat: { name: string, growthSignal: string, description: string, examples?: string[] }, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-accent/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{cat.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.growthSignal === 'high' ? 'bg-emerald-500/10 text-emerald-400' : cat.growthSignal === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                          {cat.growthSignal} growth
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cat.examples?.map((ex: string, j: number) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{ex}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {sections.redFlags?.length > 0 && (
              <SectionCard title="Red Flags" icon={AlertTriangle} defaultOpen={false}>
                <div className="space-y-2 mt-3">
                  {sections.redFlags.map((rf: { flag: string, detail: string }, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-red-500/5 border-l-2 border-red-500">
                      <p className="text-sm font-medium text-red-400">{rf.flag}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rf.detail}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {sections.policyImpact && (
              <SectionCard title="Policy Impact" icon={Landmark} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.policyImpact}</p>
              </SectionCard>
            )}
          </>
        )}

        {/* Student report sections */}
        {output.role === 'student' && sections && (
          <>
            {sections.ideaMatches?.length > 0 && (
              <SectionCard title="Startup Ideas For You" icon={Lightbulb}>
                <div className="space-y-4 mt-3">
                  {sections.ideaMatches.map((idea: { rank: number, name: string, feasibility: string, description: string, budgetRequired: string, keyChallenge: string }, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-accent/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">#{idea.rank} {idea.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${idea.feasibility === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : idea.feasibility === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                          {idea.feasibility}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{idea.description}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span>💰 {idea.budgetRequired}</span>
                        <span>⚠️ {idea.keyChallenge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {sections.skillsToLearn?.length > 0 && (
              <SectionCard title="Skills to Learn" icon={Target} defaultOpen={false}>
                <div className="space-y-2 mt-3">
                  {sections.skillsToLearn.map((s: { priority: string, skill: string, resource: string }, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">{s.priority}</div>
                      <div>
                        <p className="text-sm font-medium">{s.skill}</p>
                        <p className="text-xs text-muted-foreground">{s.resource}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {sections.validationGuide && (
              <SectionCard title="Validation Guide" icon={CheckCircle} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line">{sections.validationGuide}</p>
              </SectionCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
