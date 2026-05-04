import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReportStore } from '../store/reportStore';
import { INDUSTRIES, STUDENT_INTERESTS, STUDENT_SKILLS, STUDENT_BUDGETS } from '../types/report';

export default function StudentForm() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setReportId, setStatus } = useReportStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    interests: [] as string[],
    skills: [] as string[],
    preferredDomain: '',
    budget: '',
    intent: '' as 'build' | 'join' | 'explore' | '',
  });

  const toggleItem = (list: 'interests' | 'skills', item: string) => {
    setForm(prev => ({
      ...prev,
      [list]: prev[list].includes(item)
        ? prev[list].filter(i => i !== item)
        : [...prev[list], item],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus('generating');

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: 'student', ...form }),
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === step ? 'bg-purple-500 text-white scale-110' : s < step ? 'bg-purple-500/20 text-purple-400' : 'bg-card border border-border text-muted-foreground'}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-0.5 ${s < step ? 'bg-purple-500' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold flex items-center gap-2"><GraduationCap className="w-6 h-6 text-purple-400" /> Your Profile</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about your interests and skills.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {STUDENT_INTERESTS.map(int => (
                      <button key={int} onClick={() => toggleItem('interests', int)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.interests.includes(int) ? 'bg-purple-500 text-white' : 'bg-card border border-border text-muted-foreground hover:border-purple-500/50'}`}
                      >{int}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {STUDENT_SKILLS.map(skill => (
                      <button key={skill} onClick={() => toggleItem('skills', skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.skills.includes(skill) ? 'bg-purple-500 text-white' : 'bg-card border border-border text-muted-foreground hover:border-purple-500/50'}`}
                      >{skill}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Preferred Domain</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                      value={form.preferredDomain} onChange={e => setForm(p => ({ ...p, preferredDomain: e.target.value }))}>
                      <option value="">Select...</option>
                      {INDUSTRIES.map(ind => <option key={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Budget</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                      value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}>
                      <option value="">Select...</option>
                      {STUDENT_BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What's your intent?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: 'build', emoji: '🛠️', label: 'Build a startup' },
                      { id: 'join', emoji: '🤝', label: 'Join a startup' },
                      { id: 'explore', emoji: '🔍', label: 'Just exploring' },
                    ] as const).map(opt => (
                      <button key={opt.id} onClick={() => setForm(p => ({ ...p, intent: opt.id }))}
                        className={`p-3 rounded-xl text-center text-sm transition-all ${form.intent === opt.id ? 'bg-purple-500 text-white' : 'bg-card border border-border text-muted-foreground hover:border-purple-500/50'}`}>
                        <div className="text-xl mb-1">{opt.emoji}</div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-syne text-2xl font-bold">Review & Submit</h2>
                <div className="space-y-3">
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-28">Interests</span><span className="text-sm">{form.interests.join(', ') || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-28">Skills</span><span className="text-sm">{form.skills.join(', ') || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-28">Domain</span><span className="text-sm">{form.preferredDomain || '—'}</span></div>
                  <div className="flex gap-4 py-2 border-b border-border/50"><span className="text-sm text-muted-foreground w-28">Budget</span><span className="text-sm">{form.budget || '—'}</span></div>
                  <div className="flex gap-4 py-2"><span className="text-sm text-muted-foreground w-28">Intent</span><span className="text-sm capitalize">{form.intent || '—'}</span></div>
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
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : <><GraduationCap className="w-4 h-4" /> Discover Ideas</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
