import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Trash2, Loader2, Clock, TrendingUp, Rocket, GraduationCap, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const VERDICT_STYLES = {
  go: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  revise: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'no-go': 'bg-red-500/10 text-red-400 border-red-500/20',
  na: 'bg-muted text-muted-foreground border-border',
};

const ROLE_ICONS = {
  startup: Rocket,
  investor: TrendingUp,
  student: GraduationCap,
};

const ROLE_COLORS = {
  startup: 'from-emerald-500 to-teal-600',
  investor: 'from-blue-500 to-indigo-600',
  student: 'from-purple-500 to-pink-600',
};

export default function History() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data.reports || []);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/report/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-syne text-3xl font-bold">Your Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
          </div>
          <Link to="/onboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> New Report
          </Link>
        </div>

        {reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-syne font-bold text-xl mb-2">No reports yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Create your first validation report to get started.</p>
            <Link to="/onboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90">
              <Rocket className="w-4 h-4" /> Create Report
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, i) => {
              const RoleIcon = ROLE_ICONS[report.role] || FileText;
              const roleColor = ROLE_COLORS[report.role] || 'from-gray-500 to-gray-600';

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/report/${report.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center shrink-0`}>
                      <RoleIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-syne font-bold text-sm truncate">
                          {report.ideaName || `${report.role.charAt(0).toUpperCase() + report.role.slice(1)} Report`}
                        </h3>
                        {report.status === 'generating' && (
                          <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground capitalize">{report.role}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {report.score !== null && (
                        <span className="text-lg font-syne font-bold text-primary">{report.score}</span>
                      )}
                      {report.verdict && report.verdict !== 'na' && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border uppercase ${VERDICT_STYLES[report.verdict] || VERDICT_STYLES.na}`}>
                          {report.verdict}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
