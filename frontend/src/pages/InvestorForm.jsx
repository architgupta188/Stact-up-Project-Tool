import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, TrendingUp, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReportStore } from '../store/reportStore';
import { INDUSTRIES, INVESTMENT_STAGES, BUDGETS } from '../types/report';

export default function InvestorForm() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setReportId, setStatus } = useReportStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    preferredSectors: [],
    investmentStage: '',
    riskAppetite: '',
    budgetRange: '',
    geography: '',
    interestKeywords: '',
  });

  const toggleSector = (sector) => {
    setForm(prev => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter(s => s !== sector)
        : prev.preferredSectors.length < 3
          ? [...prev.preferredSectors, sector]
          : prev.preferredSectors,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus('generating');

    try {
      const body = {
        role: 'investor',
        preferredSectors: form.preferredSectors,
        investmentStage: form.investmentStage,
        riskAppetite: form.riskAppetite,
        budgetRange: form.budgetRange,
        geography: form.geography,
        interestKeywords: form.interestKeywords ? form.interestKeywords.split(',').map(k => k.trim()) : [],
      };

      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        useAuthStore.getState().clearAuth();
        alert('Your session has expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Analysis failed: ${errorData.error || response.statusText}${errorData.fields ? ' - ' + JSON.stringify(errorData.fields) : ''}`);
        setIsSubmitting(false);
        setStatus('idle');
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        for (const line of text.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.event === 'pipeline_start') { setReportId(data.reportId); navigate('/generating'); }
              else if (data.event === 'pipeline_complete') { setStatus('complete'); navigate(`/report/${data.reportId}`); return; }
              else if (data.event === 'pipeline_error') { setStatus('error'); alert(data.message); setIsSubmitting(false); return; }
            } catch {}
          }
        }
      }
    } catch { alert('Connection error'); setIsSubmitting(false); }
  };

  const selectClass = 'w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none';

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === step ? 'bg-blue-500 text-white scale-110' : s < step ? 'bg-blue-500/20 text-blue-400' : 'bg-card border border-border text-muted-foreground'}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-0.5 ${s < step ? 'bg-blue-500' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-blue-400" /> Investment Profile</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about your investment focus.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Sectors (up to 3)</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button key={ind}
                        onClick={() => toggleSector(ind)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.preferredSectors.includes(ind) ? 'bg-blue-500 text-white' : 'bg-card border border-border text-muted-foreground hover:border-blue-500/50'}`}
                      >{ind}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Investment Stage</label>
                    <select className={selectClass} value={form.investmentStage} onChange={e => setForm(p => ({ ...p, investmentStage: e.target.value }))}>
                      <option value="">Select...</option>
                      {INVESTMENT_STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Budget Range</label>
                    <select className={selectClass} value={form.budgetRange} onChange={e => setForm(p => ({ ...p, budgetRange: e.target.value }))}>
                      <option value="">Select...</option>
                      {BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Appetite</label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high'].map(r => (
                      <button key={r} onClick={() => setForm(p => ({ ...p, riskAppetite: r }))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${form.riskAppetite === r ? 'bg-blue-500 text-white' : 'bg-card border border-border text-muted-foreground hover:border-blue-500/50'}`}
                      >{r === 'low' ? '🛡️ Conservative' : r === 'medium' ? '⚖️ Moderate' : '🚀 Aggressive'}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Geography</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. India, Southeast Asia" value={form.geography} onChange={e => setForm(p => ({ ...p, geography: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Interest Keywords <span className="text-muted-foreground">(optional, comma-separated)</span></label>
                  <input className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. AI, sustainability, B2B" value={form.interestKeywords} onChange={e => setForm(p => ({ ...p, interestKeywords: e.target.value }))} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-syne text-2xl font-bold">Review & Submit</h2>
                <div className="space-y-3">
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-32">Sectors</span><span className="text-sm">{form.preferredSectors.join(', ') || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-32">Stage</span><span className="text-sm">{form.investmentStage || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-32">Risk</span><span className="text-sm capitalize">{form.riskAppetite || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-32">Budget</span><span className="text-sm">{form.budgetRange || '—'}</span></div>
                  <div className="flex gap-4 py-2"><span className="text-sm text-muted-foreground w-32">Geography</span><span className="text-sm">{form.geography || '—'}</span></div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button onClick={() => step > 1 ? setStep(1) : navigate('/onboard')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 2 ? (
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : <><TrendingUp className="w-4 h-4" /> Discover Opportunities</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
