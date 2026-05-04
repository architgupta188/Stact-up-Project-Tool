import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Loader2, MessageSquare, Bot, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function Chat() {
  const { reportId } = useParams();
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const MAX_TURNS = 10;

  // Load existing chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/report/${reportId}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setTurnCount(data.turnCount || 0);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [reportId, token]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming || turnCount >= MAX_TURNS) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`/api/report/${reportId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response');

      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullText += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: fullText };
                  return updated;
                });
              }
              if (data.turnCount !== undefined) {
                setTurnCount(data.turnCount);
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/report/${reportId}`} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-syne font-bold text-sm">Deep Dive Chat</h1>
                <p className="text-xs text-muted-foreground">{turnCount}/{MAX_TURNS} turns used</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-syne font-bold text-xl mb-2">Ask questions about your report</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                I have full context of your validation report. Ask me about specific scores, competitors, market trends, or actionable next steps.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Why did I score low on market timing?',
                  'How can I improve my MVP?',
                  'Which competitor is the biggest threat?',
                  'What funding should I target first?',
                ].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    className="px-3 py-1.5 rounded-full text-xs bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && !msg.content && isStreaming && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card/50 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {turnCount >= MAX_TURNS ? (
            <p className="text-center text-sm text-muted-foreground py-2">
              Maximum {MAX_TURNS} turns reached for this report.
            </p>
          ) : (
            <div className="flex items-center gap-3">
              <input
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Ask about your report..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
