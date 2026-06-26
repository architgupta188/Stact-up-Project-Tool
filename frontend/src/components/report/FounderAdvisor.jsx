import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How can I pivot this startup?',
  'What should I build first?',
  'Who should I interview?',
  'How do I monetize this?',
  'What would investors dislike?',
  'Create a lean MVP plan',
  'Generate a GTM strategy',
];

export default function FounderAdvisor({ reportId }) {
  const navigate = useNavigate();

  const handleQuestion = (question) => {
    // Navigate to chat with pre-filled question
    navigate(`/report/${reportId}/chat`, { state: { prefill: question } });
  };

  return (
    <div className="glass-card p-6 premium-glow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-syne font-bold text-lg">AI Founder Advisor</h3>
          <p className="text-xs text-muted-foreground">Ask follow-up questions about your report</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTED_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => handleQuestion(q)}
            className="px-3 py-1.5 rounded-full text-xs bg-accent/40 border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-primary/5 transition-all duration-200"
          >
            {q}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(`/report/${reportId}/chat`)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Open Deep Dive Chat
      </button>
    </div>
  );
}
