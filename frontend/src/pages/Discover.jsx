import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Search, Briefcase, Bookmark, BookmarkCheck, Send,
  CheckCircle, TrendingUp, Sparkles, MapPin, Users, DollarSign,
  Building, Award, Zap, ChevronRight, Filter, ArrowLeft, ArrowUpRight,
  Check, Loader2, X, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Discover() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Saved/Applied states (using localStorage)
  const [savedStartups, setSavedStartups] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Apply Modal state
  const [applyModal, setApplyModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showToast, setShowToast] = useState(null);

  // Fetch report on load
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load matching profile');
        const data = await res.json();
        
        // Ensure it's a student discovery report
        if (data.role !== 'student') {
          navigate(`/report/${reportId}`, { replace: true });
          return;
        }
        
        setReport(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId, token, navigate]);

  // Load saved & applied items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`saved_startups_${reportId}`);
    const applied = localStorage.getItem(`applied_jobs_${reportId}`);
    if (saved) setSavedStartups(JSON.parse(saved));
    if (applied) setAppliedJobs(JSON.parse(applied));
  }, [reportId]);

  const toggleSaveStartup = (startupId) => {
    const newSaved = savedStartups.includes(startupId)
      ? savedStartups.filter(id => id !== startupId)
      : [...savedStartups, startupId];
    
    setSavedStartups(newSaved);
    localStorage.setItem(`saved_startups_${reportId}`, JSON.stringify(newSaved));
    
    // Trigger toast
    triggerToast(
      savedStartups.includes(startupId) ? 'Removed from saved startups' : 'Startup saved successfully!'
    );
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleOpenApply = (startupName, roleTitle, jobId) => {
    setApplyModal({ isOpen: true, startupName, roleTitle, jobId });
    setCoverLetter('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyModal) return;

    setIsApplying(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newApplied = [...appliedJobs, applyModal.jobId];
    setAppliedJobs(newApplied);
    localStorage.setItem(`applied_jobs_${reportId}`, JSON.stringify(newApplied));

    setIsApplying(false);
    setApplyModal(null);
    triggerToast(`Application for ${applyModal.roleTitle} sent successfully!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-16">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading matches & startups...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-16 px-4">
        <div className="glass-card max-w-md p-6 text-center border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-syne mb-2">Error Loading Dashboard</h2>
          <p className="text-sm text-muted-foreground mb-6">{error || 'Could not fetch report data.'}</p>
          <button onClick={() => navigate('/history')} className="px-5 py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-card/80 flex items-center justify-center gap-2 mx-auto transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>
        </div>
      </div>
    );
  }

  const discoveryData = report.outputData?.discoveryData;

  if (!discoveryData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-16 px-4">
        <div className="glass-card max-w-md p-6 text-center border-yellow-500/20">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-syne mb-2">Discovery Report Empty</h2>
          <p className="text-sm text-muted-foreground mb-6">This report does not contain startup discovery data. You may need to generate a new matching profile.</p>
          <button onClick={() => navigate('/student')} className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 flex items-center justify-center gap-2 mx-auto transition-colors">
            <GraduationCap className="w-4 h-4" /> Create Discovery Profile
          </button>
        </div>
      </div>
    );
  }

  const {
    aiMatchSummary,
    recommendedStartups,
    trendingStartups,
    recentlyFundedStartups,
    openPositions,
    founderSpotlights
  } = discoveryData;

  // Domain & Role filter definitions
  const domains = ['All', 'AI', 'FinTech', 'EdTech', 'HealthTech', 'ClimateTech', 'SaaS'];
  const roles = ['All', 'Developer', 'Designer', 'Marketing', 'Product', 'Data Science'];

  // Filtering Logic
  const filteredRecommended = (recommendedStartups || []).filter(startup => {
    const matchesDomain = selectedDomain === 'All' || startup.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const matchesRole = selectedRole === 'All' || startup.openRoles.some(r => r.type.toLowerCase() === selectedRole.toLowerCase());
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesRole && matchesSearch;
  });

  const filteredPositions = (openPositions || []).filter(pos => {
    const matchesDomain = selectedDomain === 'All' || pos.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const matchesRole = selectedRole === 'All' || pos.type.toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch = pos.role.toLowerCase().includes(searchQuery.toLowerCase()) || pos.startup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Link to="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium font-mono capitalize">
              Student Profile Matching
            </span>
          </div>
        </div>

        {/* 1. Hero Section */}
        <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-6 py-6 border-b border-border/40">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-syne leading-[1.15]">
              Find Startups <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                That Need You.
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Tailored startup matching engine based on your student profile, core skillsets, and startup domain interests.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4 justify-center shrink-0">
            <div className="glass-card px-5 py-4 border-purple-500/20 flex flex-col items-center">
              <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Matching Startups</span>
              <span className="text-3xl font-bold font-syne text-purple-400 mt-1">{recommendedStartups?.length || 0}</span>
            </div>
            <div className="glass-card px-5 py-4 border-emerald-500/20 flex flex-col items-center">
              <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Active Roles</span>
              <span className="text-3xl font-bold font-syne text-emerald-400 mt-1">{openPositions?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* 2. AI Match Summary */}
        <div className="glass-card p-6 border-purple-500/20 relative overflow-hidden bg-gradient-to-r from-purple-500/5 via-transparent to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-6 items-center">
            
            {/* Score Ring Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="url(#purpleGlow)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - (aiMatchSummary?.profileStrength || 75) / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold font-syne">{aiMatchSummary?.profileStrength || 75}%</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Strength</span>
              </div>
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Match Level: {aiMatchSummary?.matchStrength || 'Strong'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border">
                  Best Domain: <strong className="text-foreground">{aiMatchSummary?.topDomain || 'SaaS'}</strong>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border">
                  Role fit: <strong className="text-foreground">{aiMatchSummary?.topRole || 'Developer'}</strong>
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {aiMatchSummary?.recommendation || "Your skillset matches fast-paced startups looking for high execution. Focus on building MVP demonstrations to highlight your practical skills."}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="glass-card p-5 border-border/50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search startups, keywords, open positions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-sm"
              />
            </div>

            {/* Filter tags (Domain) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3 h-3" /> Domain:
              </span>
              {domains.map(dom => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedDomain === dom
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-card border-border text-muted-foreground hover:border-purple-500/50'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Filter tags (Role Type) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-border/40 pt-3">
            <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1 shrink-0 mr-4">
              <Briefcase className="w-3 h-3" /> Role Fit:
            </span>
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedRole === role
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'bg-card border-border text-muted-foreground hover:border-indigo-500/50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Recommended Startups Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-syne flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" /> Recommended Startups
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing {filteredRecommended.length} match{filteredRecommended.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecommended.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-10 text-center text-muted-foreground text-sm border-dashed"
                >
                  No startups match your current search or filter options.
                </motion.div>
              ) : (
                filteredRecommended.map((startup, i) => {
                  const isSaved = savedStartups.includes(startup.id);
                  return (
                    <motion.div
                      key={startup.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="glass-card p-6 border-border/80 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.04)] transition-all duration-300 flex flex-col lg:flex-row gap-6 relative group"
                    >
                      {/* Match Score Tag */}
                      <div className="absolute top-5 right-5 flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Match Score</span>
                          <span className="text-lg font-extrabold font-syne text-purple-400">{startup.matchScore}%</span>
                        </div>
                        <button
                          onClick={() => toggleSaveStartup(startup.id)}
                          className={`p-2 rounded-xl border transition-all ${
                            isSaved
                              ? 'bg-purple-500/10 border-purple-500/40 text-purple-400'
                              : 'bg-card border-border text-muted-foreground hover:text-foreground'
                          }`}
                          title={isSaved ? "Saved" : "Save Startup"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Left: Startup Metadata */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold font-syne text-foreground">{startup.name}</h3>
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-400 uppercase tracking-wide">
                              {startup.stage}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" /> {startup.domain}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {startup.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" /> {startup.fundingStage}
                            </span>
                            {startup.remote && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                                Remote Available
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{startup.description}</p>

                        {/* AI Match Why Tag */}
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs">
                          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            <strong className="text-purple-300">Why matched:</strong> {startup.whyMatch}
                          </span>
                        </div>

                        {/* Highlights list */}
                        {startup.highlights && startup.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {startup.highlights.map((h, k) => (
                              <span key={k} className="text-[11px] px-2 py-1 rounded bg-card border border-border text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-500/70" /> {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Open Roles Box */}
                      <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" /> Open Roles ({startup.openRoles?.length || 0})
                          </span>
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none pr-1">
                          {startup.openRoles?.map((role, idx) => {
                            const isJobApplied = appliedJobs.includes(`${startup.id}-${idx}`);
                            return (
                              <div key={idx} className="p-3 rounded-xl bg-card border border-border/80 hover:border-purple-500/30 transition-all flex justify-between items-center gap-3">
                                <div className="space-y-1 min-w-0">
                                  <h4 className="text-xs font-semibold truncate text-foreground">{role.title}</h4>
                                  <p className="text-[10px] text-muted-foreground truncate">{role.experience} · {role.compensation}</p>
                                </div>
                                <button
                                  onClick={() => isJobApplied ? null : handleOpenApply(startup.name, role.title, `${startup.id}-${idx}`)}
                                  disabled={isJobApplied}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                                    isJobApplied
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                                  }`}
                                >
                                  {isJobApplied ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Applied</span> : 'Apply'}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Founder Quick Profile */}
                        {startup.founderName && (
                          <div className="border-t border-border/40 pt-3 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold font-syne text-purple-300">
                              {startup.founderName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-foreground truncate">{startup.founderName}</p>
                              <p className="text-[9px] text-muted-foreground truncate">{startup.founderTitle || 'Founder'} · {startup.founderBackground}</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 4 & 5. Side-by-side lists for Trending & Recently Funded */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Trending Startups */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-syne flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Trending Startups
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {trendingStartups?.map((startup, idx) => (
                <div key={idx} className="glass-card p-5 border-border/80 hover:border-indigo-500/30 transition-all flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground truncate">{startup.name}</h4>
                      <span className="text-[9px] text-indigo-400 uppercase font-mono font-bold tracking-wider">{startup.domain}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{startup.description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-300/90 font-medium">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>{startup.trendReason || "Trending in sector"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Funded Startups */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-syne flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Recently Funded Startups
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {recentlyFundedStartups?.map((startup, idx) => (
                <div key={idx} className="glass-card p-5 border-border/80 hover:border-emerald-500/30 transition-all flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground truncate">{startup.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold truncate">
                        {startup.fundingDetail || 'Funded'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{startup.description}</p>
                    <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
                      <span>📍 {startup.location}</span>
                      <span>👥 {startup.teamSize ? `${startup.teamSize} employees` : 'Early Team'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. Open Positions Job Board */}
        <div className="space-y-6 pt-6 border-t border-border/40">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-syne flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" /> Open Positions
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing {filteredPositions.length} jobs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPositions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card md:col-span-2 p-8 text-center text-muted-foreground text-sm border-dashed"
                >
                  No roles match your filter combinations. Try adjusting search queries.
                </motion.div>
              ) : (
                filteredPositions.map((pos, idx) => {
                  const isJobApplied = appliedJobs.includes(pos.id);
                  return (
                    <motion.div
                      key={pos.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card p-5 border-border/80 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)] transition-all duration-300 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-base text-foreground font-syne leading-tight">{pos.role}</h4>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" /> <strong>{pos.startup}</strong> · {pos.domain}
                            </p>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">Match Score</span>
                            <span className="text-sm font-extrabold text-emerald-400 font-mono">{pos.matchScore}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{pos.description}</p>
                        
                        {/* Skills required */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pos.skills?.map((skill, k) => (
                            <span key={k} className="text-[10px] px-2 py-0.5 rounded bg-card border border-border text-muted-foreground font-mono">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-1">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {pos.experience} · {pos.compensation} {pos.remote ? '(Remote)' : ''}
                        </span>
                        <button
                          onClick={() => isJobApplied ? null : handleOpenApply(pos.startup, pos.role, pos.id)}
                          disabled={isJobApplied}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            isJobApplied
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          }`}
                        >
                          {isJobApplied ? (
                            <><Check className="w-3.5 h-3.5" /> Applied</>
                          ) : (
                            <><Send className="w-3.5 h-3.5" /> Quick Apply</>
                          )}
                        </button>
                      </div>

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 7. Founder Spotlights */}
        <div className="space-y-6 pt-6 border-t border-border/40">
          <h2 className="text-2xl font-bold font-syne flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Founder Spotlights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founderSpotlights?.map((founder, idx) => (
              <div key={idx} className="glass-card p-5 border-border/70 relative overflow-hidden flex flex-col justify-between gap-4">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white font-syne text-sm">
                      {founder.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{founder.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{founder.startup} ({founder.domain})</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{founder.background}"
                  </p>
                </div>
                <div className="bg-card border border-border/60 p-3 rounded-xl mt-1">
                  <p className="text-[10px] text-purple-400 font-semibold uppercase font-mono tracking-wider mb-1">Founder's Advice</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {founder.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Application Modal Overlay */}
      <AnimatePresence>
        {applyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setApplyModal(null)}
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-syne text-xl font-bold text-foreground">Apply to Startup</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {applyModal.roleTitle} at <strong>{applyModal.startupName}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setApplyModal(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Introduction / Pitch
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly state why you're a great fit for this role. What relevant projects have you built?"
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-sm leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-muted-foreground leading-relaxed flex gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    Your VentureIQ student matching profile will be submitted to the founders automatically along with this pitch.
                  </span>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModal(null)}
                    className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isApplying ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Application</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating success toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-purple-500 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 border border-purple-400"
          >
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
