import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ROLES = [
  {
    id: 'startup',
    icon: Rocket,
    title: 'Startup / Company',
    subtitle: 'Validate your idea',
    points: [
      'AI-powered market analysis',
      'Competitive landscape mapping',
      'Validation score (0–100)',
      'Government scheme discovery',
      '30-day action plan',
    ],
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'hover:border-emerald-500/50',
    shadowColor: 'hover:shadow-emerald-500/10',
  },
  {
    id: 'investor',
    icon: TrendingUp,
    title: 'Investor',
    subtitle: 'Discover opportunities',
    points: [
      'Sector momentum analysis',
      'Trending startup categories',
      'Red flags & market risks',
      'Policy impact assessment',
      'Due diligence angles',
    ],
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'hover:border-blue-500/50',
    shadowColor: 'hover:shadow-blue-500/10',
  },
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student / Explorer',
    subtitle: 'Find your path',
    points: [
      'Matching startup ideas',
      'Skills roadmap',
      '90-day MVP blueprint',
      'Free resources & tools',
      'Incubator programs',
    ],
    color: 'from-purple-500 to-pink-600',
    borderColor: 'hover:border-purple-500/50',
    shadowColor: 'hover:shadow-purple-500/10',
  },
];

export default function Onboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const preselected = searchParams.get('role');

  const handleSelect = (roleId: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/${roleId}`);
      return;
    }
    navigate(`/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-syne text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            Who are you?
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your path to get a tailored intelligence report.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <button
                onClick={() => handleSelect(role.id)}
                className={`w-full text-left p-6 rounded-2xl bg-card border border-border ${role.borderColor} transition-all duration-300 ${role.shadowColor} hover:shadow-2xl group ${preselected === role.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>

                <h2 className="font-syne text-xl font-bold mb-1">{role.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{role.subtitle}</p>

                <ul className="space-y-2 mb-6">
                  {role.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Select {role.title.split(' /')[0]}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Already have reports? View your history →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
