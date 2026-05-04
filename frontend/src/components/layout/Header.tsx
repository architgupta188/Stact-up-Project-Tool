import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Zap, LogOut, History, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
      });
    } catch { /* ignore */ }
    clearAuth();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-syne font-bold text-lg tracking-tight">
            Venture<span className="text-primary">IQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link to="/onboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                New Report
              </Link>
              <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <History className="w-4 h-4" />
                History
              </Link>
            </>
          )}
        </nav>

        {/* Auth / User */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link to="/onboard" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>New Report</Link>
              <Link to="/history" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>History</Link>
              <button onClick={handleLogout} className="block text-sm py-2 text-destructive">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="block text-sm py-2 text-primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
