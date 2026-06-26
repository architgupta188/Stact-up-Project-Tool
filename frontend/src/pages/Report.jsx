import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, Shield, Lightbulb, Users, BarChart3, Swords, TrendingUp,
  Landmark, Rocket, AlertTriangle, CheckCircle, Calendar,
  Loader2, ExternalLink, DollarSign, Award, Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Report sub-components
import SectionCard from '../components/report/SectionCard';
import EnhancedVerdict from '../components/report/EnhancedVerdict';
import ExecutiveSummary from '../components/report/ExecutiveSummary';
import DimensionScores from '../components/report/DimensionScores';
import RadarChartSection from '../components/report/RadarChartSection';
import MonetizationAnalysisSection from '../components/report/MonetizationAnalysis';
import CompetitionMatrix from '../components/report/CompetitionMatrix';
import MarketOpportunity from '../components/report/MarketOpportunity';
import RisksMitigation from '../components/report/RisksMitigation';
import FundingReadinessSection from '../components/report/FundingReadiness';
import YCAssessmentSection from '../components/report/YCAssessment';
import FounderAdvisor from '../components/report/FounderAdvisor';
import ExportActions from '../components/report/ExportActions';

const THREAT_BG = { low: 'bg-emerald-500/10 text-emerald-400', medium: 'bg-amber-500/10 text-amber-400', high: 'bg-red-500/10 text-red-400' };

export default function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [report, setReport] = useState(null);
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

  useEffect(() => {
    if (report && report.role === 'student' && report.inputData?.intent === 'join') {
      navigate(`/discover/${reportId}`, { replace: true });
    }
  }, [report, reportId, navigate]);

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

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-1 tracking-widest">INTELLIGENCE REPORT</p>
            <h1 className="font-syne text-3xl font-bold">{report.ideaName || 'Intelligence Report'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generated {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <ExportActions
            reportId={reportId}
            token={token}
            onShare={handleShare}
            shareLink={shareLink}
            reportData={report}
          />
        </div>

        {shareLink && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
            <p className="text-sm text-primary truncate">{shareLink}</p>
            <span className="text-xs text-primary font-medium shrink-0 ml-2">Copied!</span>
          </motion.div>
        )}

        {/* ═══════════════ STARTUP REPORT ═══════════════ */}
        {isStartup && (
          <>
            {/* 1. Enhanced Verdict — Visually Dominant */}
            {output.compositeScore !== undefined && (
              <EnhancedVerdict
                verdict={output.verdict}
                score={output.compositeScore}
                rationale={output.verdictRationale}
                confidence={output.confidencePercentage}
                topReasons={output.topVerdictReasons}
                pivotStrategy={output.pivotStrategy}
                keySuccessFactor={output.keySuccessFactor}
              />
            )}

            {/* 2. Executive Summary */}
            {output.executiveSummary && (
              <ExecutiveSummary summary={output.executiveSummary} />
            )}

            {/* 3. Dimension Scores — Visual Cards */}
            {scores && Object.keys(scores).length > 0 && (
              <SectionCard title="Validation Dimensions" icon={BarChart3} badge={`${Object.keys(scores).length} metrics`}>
                <DimensionScores scores={scores} />
              </SectionCard>
            )}

            {/* 4. Interactive Radar Chart — 2× Larger */}
            {scores && Object.keys(scores).length > 0 && (
              <SectionCard title="Performance Radar" icon={Target}>
                <RadarChartSection scores={scores} />
              </SectionCard>
            )}

            {/* 5. Monetization Analysis */}
            {output.monetizationAnalysis && (
              <SectionCard title="Monetization Analysis" icon={DollarSign} badge="NEW">
                <MonetizationAnalysisSection data={output.monetizationAnalysis} />
              </SectionCard>
            )}

            {/* 6. Market Opportunity — Premium Cards */}
            {sections.marketOpportunity && (
              <SectionCard title="Market Opportunity" icon={BarChart3} defaultOpen={true}>
                <MarketOpportunity data={sections.marketOpportunity} />
              </SectionCard>
            )}

            {/* 7. Competition Matrix */}
            {sections.competitionAnalysis?.competitors?.length > 0 && (
              <SectionCard title="Competition Landscape" icon={Swords}>
                <CompetitionMatrix
                  competitors={sections.competitionAnalysis.competitors}
                  startupName={report.ideaName || 'Your Startup'}
                />

                {/* Traditional competitor cards */}
                <div className="space-y-3 mt-6">
                  <h4 className="text-xs font-mono text-muted-foreground tracking-widest">COMPETITOR PROFILES</h4>
                  {sections.competitionAnalysis.competitors.map((c, i) => (
                    <div key={i} className="glass-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{c.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAT_BG[c.threat] || THREAT_BG.medium}`}>
                          {c.threat} threat
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      <p className="text-xs text-primary mt-1">Gap: {c.differentiator}</p>
                    </div>
                  ))}
                  {sections.competitionAnalysis.positioning && (
                    <p className="text-sm leading-relaxed mt-2 text-muted-foreground">{sections.competitionAnalysis.positioning}</p>
                  )}
                </div>
              </SectionCard>
            )}

            {/* 8. Idea Summary */}
            {sections.ideaSummary && (
              <SectionCard title="Idea Summary" icon={Lightbulb} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.ideaSummary}</p>
              </SectionCard>
            )}

            {/* 9. Problem Analysis */}
            {sections.problemAnalysis && (
              <SectionCard title="Problem Analysis" icon={Target} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.problemAnalysis}</p>
              </SectionCard>
            )}

            {/* 10. Target Audience */}
            {sections.targetAudienceAnalysis && (
              <SectionCard title="Target Audience" icon={Users} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.targetAudienceAnalysis}</p>
              </SectionCard>
            )}

            {/* 11. Industry Trends */}
            {sections.industryTrends?.length > 0 && (
              <SectionCard title="Industry Trends" icon={TrendingUp} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.industryTrends.map((t, i) => (
                    <div key={i} className="glass-card p-3 border-l-2 border-primary">
                      <h4 className="text-sm font-bold">{t.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t.summary}</p>
                      {t.source && <p className="text-xs text-primary/70 mt-1">— {t.source}</p>}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 12. Government Schemes */}
            {sections.governmentSchemes?.length > 0 && (
              <SectionCard title="Government Schemes" icon={Landmark} defaultOpen={false}>
                <div className="space-y-3 mt-3">
                  {sections.governmentSchemes.map((s, i) => (
                    <div key={i} className="glass-card p-4">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        {s.name}
                        {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-primary"><ExternalLink className="w-3 h-3" /></a>}
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

            {/* 13. MVP Suggestions */}
            {sections.mvpSuggestions && (
              <SectionCard title="MVP Suggestions" icon={Rocket} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.mvpSuggestions}</p>
              </SectionCard>
            )}

            {/* 14. Risks & Mitigation — Redesigned */}
            {sections.risks?.length > 0 && (
              <SectionCard title="Risks & Mitigations" icon={AlertTriangle} badge={`${sections.risks.length} risks`}>
                <RisksMitigation risks={sections.risks} />
              </SectionCard>
            )}

            {/* 15. Recommendations */}
            {sections.recommendations?.length > 0 && (
              <SectionCard title="Recommendations" icon={CheckCircle} defaultOpen={false}>
                <div className="space-y-2 mt-3">
                  {sections.recommendations.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 p-3 rounded-lg glass-card"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {r.priority}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 16. Funding Readiness — New */}
            {output.fundingReadiness && (
              <SectionCard title="Funding Readiness" icon={Briefcase} badge="NEW">
                <FundingReadinessSection data={output.fundingReadiness} />
              </SectionCard>
            )}

            {/* 17. Funding Fit (original text) */}
            {sections.fundingFit && !output.fundingReadiness && (
              <SectionCard title="Funding Fit" icon={Shield} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.fundingFit}</p>
              </SectionCard>
            )}

            {/* 18. YC-Style Assessment — New */}
            {output.ycAssessment && (
              <SectionCard title="Investor Review" icon={Award} badge="YC-STYLE">
                <YCAssessmentSection data={output.ycAssessment} />
              </SectionCard>
            )}

            {/* 19. 30-Day Action Plan */}
            {sections.actionPlan?.length > 0 && (
              <SectionCard title="30-Day Action Plan" icon={Calendar} defaultOpen={false}>
                <div className="relative mt-3">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/50" />

                  <div className="space-y-4">
                    {sections.actionPlan.map((week) => (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: week.week * 0.1 }}
                        className="relative pl-10"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[10px] top-1 w-[11px] h-[11px] rounded-full bg-primary border-2 border-background" />

                        <div className="glass-card p-4">
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <span className="text-xs font-mono text-primary">WEEK {week.week}</span>
                            {week.goal}
                          </h4>
                          <ul className="mt-2 space-y-1">
                            {week.tasks?.map((task, ti) => (
                              <li key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* 20. Final Verdict */}
            {sections.finalVerdict && (
              <SectionCard title="Final Verdict" icon={Target}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line font-medium">{sections.finalVerdict}</p>
              </SectionCard>
            )}

            {/* 21. AI Founder Advisor */}
            <FounderAdvisor reportId={reportId} />
          </>
        )}

        {/* ═══════════════ INVESTOR REPORT ═══════════════ */}
        {output.role === 'investor' && sections && (
          <>
            {sections.sectorOverview && (
              <SectionCard title="Sector Overview" icon={BarChart3}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.sectorOverview}</p>
              </SectionCard>
            )}
            {sections.trendingCategories?.length > 0 && (
              <SectionCard title="Trending Categories" icon={TrendingUp}>
                <div className="space-y-3 mt-3">
                  {sections.trendingCategories.map((cat, i) => (
                    <div key={i} className="glass-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{cat.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.growthSignal === 'high' ? 'bg-emerald-500/10 text-emerald-400' : cat.growthSignal === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                          {cat.growthSignal} growth
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cat.examples?.map((ex, j) => (
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
                  {sections.redFlags.map((rf, i) => (
                    <div key={i} className="glass-card p-3 border-l-2 border-red-500">
                      <p className="text-sm font-medium text-red-400">{rf.flag}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rf.detail}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {sections.policyImpact && (
              <SectionCard title="Policy Impact" icon={Landmark} defaultOpen={false}>
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.policyImpact}</p>
              </SectionCard>
            )}
          </>
        )}

        {/* ═══════════════ STUDENT REPORT ═══════════════ */}
        {output.role === 'student' && sections && (
          <>
            {sections.ideaMatches?.length > 0 && (
              <SectionCard title="Startup Ideas For You" icon={Lightbulb}>
                <div className="space-y-4 mt-3">
                  {sections.ideaMatches.map((idea, i) => (
                    <div key={i} className="glass-card p-4">
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
                  {sections.skillsToLearn.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg glass-card">
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
                <p className="text-sm leading-relaxed mt-3 whitespace-pre-line text-muted-foreground">{sections.validationGuide}</p>
              </SectionCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
