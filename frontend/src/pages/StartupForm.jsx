import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Rocket, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReportStore } from '../store/reportStore';
import { INDUSTRIES, BUSINESS_MODELS, STARTUP_STAGES, BUDGETS, MVP_STATUSES } from '../types/report';

export default function StartupForm() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setReportId, setStatus, setPipelineStep } = useReportStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    ideaName: '',
    problemStatement: '',
    targetUsers: '',
    industry: '',
    businessModel: '',
    countryRegion: '',
    stage: '',
    budget: '',
    mvpStatus: '',
    knownCompetitors: '',
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validatePage1 = () => {
    const errs = {};
    if (!form.ideaName || form.ideaName.length < 3) errs.ideaName = 'Idea name must be at least 3 characters';
    if (!form.problemStatement || form.problemStatement.length < 50) errs.problemStatement = 'Problem statement must be at least 50 characters';
    if (!form.targetUsers || form.targetUsers.length < 10) errs.targetUsers = 'Please describe your target users (at least 10 characters)';
    if (!form.industry) errs.industry = 'Please select an industry';
    if (!form.businessModel) errs.businessModel = 'Please select a business model';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePage2 = () => {
    const errs = {};
    if (!form.countryRegion) errs.countryRegion = 'Please enter your country or region';
    if (!form.stage) errs.stage = 'Please select your startup stage';
    if (!form.budget) errs.budget = 'Please select your budget range';
    if (!form.mvpStatus) errs.mvpStatus = 'Please select your MVP status';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validatePage1()) setStep(2);
    if (step === 2 && validatePage2()) setStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus('generating');

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: 'startup', ...form }),
      });

      if (response.status === 422) {
        const data = await response.json();
        alert('Validation error: ' + JSON.stringify(data.fields));
        setIsSubmitting(false);
        setStatus('idle');
        return;
      }

      if (response.status === 429) {
        alert('Rate limit reached. Please wait and try again.');
        setIsSubmitting(false);
        setStatus('idle');
        return;
      }

      if (response.status === 401) {
        useAuthStore.getState().clearAuth();
        alert('Your session has expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Unknown error');
        alert(`Server error (${response.status}): ${errText}`);
        setIsSubmitting(false);
        setStatus('idle');
        return;
      }

      // Navigate to generating page immediately
      // Read SSE stream in background
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      // Navigate to generating page right away
      let navigatedToReport = false;

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.event === 'pipeline_start' && data.reportId) {
                    setReportId(data.reportId);
                  } else if (data.event === 'pipeline_step') {
                    setPipelineStep(data.step, data.label);
                  } else if (data.event === 'pipeline_complete' && !navigatedToReport) {
                    navigatedToReport = true;
                    setStatus('complete');
                    setReportId(data.reportId);
                    navigate(`/report/${data.reportId}`);
                  } else if (data.event === 'pipeline_error') {
                    setStatus('error');
                  }
                } catch { /* ignore */ }
              }
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          setStatus('error');
        }
      };

      // Start processing in background and navigate
      processStream();
      navigate('/generating');

    } catch (err) {
      console.error(err);
      setStatus('error');
      alert('Failed to connect. Make sure the backend is running.');
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-background border ${errors[field] ? 'border-destructive' : 'border-border'} text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`;

  const selectClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-background border ${errors[field] ? 'border-destructive' : 'border-border'} text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer`;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s === step ? 'bg-primary text-primary-foreground scale-110' :
                s < step ? 'bg-primary/20 text-primary' : 'bg-card border border-border text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-primary' : 'bg-border'} transition-all`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
            {/* Page 1: The Idea */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-primary" />
                    The Idea
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about your startup idea.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Idea Name <span className="text-destructive">*</span></label>
                  <input className={inputClass('ideaName')} placeholder="e.g. QuickDeliver — hyperlocal 15-min delivery" maxLength={80}
                    value={form.ideaName} onChange={e => updateField('ideaName', e.target.value)} />
                  {errors.ideaName && <p className="text-xs text-destructive mt-1">{errors.ideaName}</p>}
                  <p className="text-xs text-muted-foreground text-right">{form.ideaName.length}/80</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Problem Statement <span className="text-destructive">*</span></label>
                  <textarea className={`${inputClass('problemStatement')} min-h-[120px] resize-none`}
                    placeholder="What problem does your idea solve? Be specific about who has this problem and why it matters. The more detail, the better the analysis."
                    maxLength={500} value={form.problemStatement} onChange={e => updateField('problemStatement', e.target.value)} />
                  {errors.problemStatement && <p className="text-xs text-destructive mt-1">{errors.problemStatement}</p>}
                  <p className={`text-xs text-right ${form.problemStatement.length < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>{form.problemStatement.length}/500 (min 50)</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Target Users <span className="text-destructive">*</span></label>
                  <input className={inputClass('targetUsers')} placeholder="e.g. College students in Tier-2 Indian cities aged 18-24" maxLength={200}
                    value={form.targetUsers} onChange={e => updateField('targetUsers', e.target.value)} />
                  {errors.targetUsers && <p className="text-xs text-destructive mt-1">{errors.targetUsers}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Industry <span className="text-destructive">*</span></label>
                    <select className={selectClass('industry')} value={form.industry} onChange={e => updateField('industry', e.target.value)}>
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    {errors.industry && <p className="text-xs text-destructive mt-1">{errors.industry}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Business Model <span className="text-destructive">*</span></label>
                    <select className={selectClass('businessModel')} value={form.businessModel} onChange={e => updateField('businessModel', e.target.value)}>
                      <option value="">Select model...</option>
                      {BUSINESS_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors.businessModel && <p className="text-xs text-destructive mt-1">{errors.businessModel}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Page 2: Context */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold">Your Context</h2>
                  <p className="text-sm text-muted-foreground mt-1">Help us understand where you are.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Country / Region <span className="text-destructive">*</span></label>
                  <input className={inputClass('countryRegion')} placeholder="e.g. India, Rajasthan"
                    value={form.countryRegion} onChange={e => updateField('countryRegion', e.target.value)} />
                  {errors.countryRegion && <p className="text-xs text-destructive mt-1">{errors.countryRegion}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Startup Stage <span className="text-destructive">*</span></label>
                    <select className={selectClass('stage')} value={form.stage} onChange={e => updateField('stage', e.target.value)}>
                      <option value="">Select stage...</option>
                      {STARTUP_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.stage && <p className="text-xs text-destructive mt-1">{errors.stage}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Monthly Budget <span className="text-destructive">*</span></label>
                    <select className={selectClass('budget')} value={form.budget} onChange={e => updateField('budget', e.target.value)}>
                      <option value="">Select budget...</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">MVP Status <span className="text-destructive">*</span></label>
                  <select className={selectClass('mvpStatus')} value={form.mvpStatus} onChange={e => updateField('mvpStatus', e.target.value)}>
                    <option value="">Select MVP status...</option>
                    {MVP_STATUSES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.mvpStatus && <p className="text-xs text-destructive mt-1">{errors.mvpStatus}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Known Competitors <span className="text-muted-foreground">(optional)</span></label>
                  <textarea className={`${inputClass('knownCompetitors')} min-h-[80px] resize-none`}
                    placeholder="List any competitors you know about..."
                    maxLength={300} value={form.knownCompetitors} onChange={e => updateField('knownCompetitors', e.target.value)} />
                </div>
              </div>
            )}

            {/* Page 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground mt-1">Verify your details before we run the analysis.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Idea Name', value: form.ideaName },
                    { label: 'Problem', value: form.problemStatement },
                    { label: 'Target Users', value: form.targetUsers },
                    { label: 'Industry', value: form.industry },
                    { label: 'Business Model', value: form.businessModel },
                    { label: 'Region', value: form.countryRegion },
                    { label: 'Stage', value: form.stage },
                    { label: 'Budget', value: form.budget },
                    { label: 'MVP Status', value: form.mvpStatus },
                    { label: 'Competitors', value: form.knownCompetitors || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
                      <span className="text-sm break-words">{value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg p-3">
                  ⚠️ Analysis takes ~60 seconds. Government scheme info should be verified on official portals.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/onboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</>
              ) : (
                <><Rocket className="w-4 h-4" /> Analyse My Idea</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
