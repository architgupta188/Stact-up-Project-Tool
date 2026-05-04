import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/layout/Header';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboard from './pages/Onboard';
import StartupForm from './pages/StartupForm';
import InvestorForm from './pages/InvestorForm';
import StudentForm from './pages/StudentForm';
import Generating from './pages/Generating';
import Report from './pages/Report';
import Chat from './pages/Chat';
import History from './pages/History';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />

        {/* Onboarding (auth-aware but still accessible) */}
        <Route path="/onboard" element={<Onboard />} />

        {/* Protected — Forms */}
        <Route path="/startup" element={<ProtectedRoute><StartupForm /></ProtectedRoute>} />
        <Route path="/investor" element={<ProtectedRoute><InvestorForm /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />

        {/* Protected — Report Flow */}
        <Route path="/generating" element={<ProtectedRoute><Generating /></ProtectedRoute>} />
        <Route path="/report/:reportId" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/report/:reportId/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
