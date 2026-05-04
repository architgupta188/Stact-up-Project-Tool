import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Auth({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(type === 'signup' ? { email, password, name } : { email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      setAuth(data.user, data.accessToken);
      const redirect = searchParams.get('redirect') || '/onboard';
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError('Network error. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-syne font-bold text-lg">Venture<span className="text-primary">IQ</span></span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="font-syne text-2xl font-bold text-center mb-1">
            {type === 'login' ? 'Welcome Back' : 'Join VentureIQ'}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {type === 'login' ? 'Sign in to access your reports.' : 'Create an account to start validating.'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input id="auth-name" className={inputClass} placeholder="Your name"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input id="auth-email" type="email" className={inputClass} placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} className={inputClass} placeholder="Min 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {type === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {type === 'login' ? (
              <p>Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link></p>
            ) : (
              <p>Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
