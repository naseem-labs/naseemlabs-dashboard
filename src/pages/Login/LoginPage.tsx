import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Bell, ShieldCheck, BarChart3 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import type { LoginCredentials } from '../../types';
import { LoginForm } from './LoginForm';
import './LoginPage.css';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Centralized Patient Conversations',
    description: 'All inquiries from WhatsApp in one place',
  },
  {
    icon: Bell,
    title: 'Intelligent Follow-up System',
    description: 'Never miss a follow-up opportunity',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your clinic data is always protected',
  },
] as const;

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlreadySignedIn, setIsAlreadySignedIn] = useState(false);

  useEffect(() => {
    setIsAlreadySignedIn(authService.isAuthenticated());
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    const response = await authService.login(credentials);

    if (!response.success) {
      setError(response.error ?? 'Unable to sign in. Please try again.');
      setIsLoading(false);
      return;
    }

    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const handleContinue = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <aside className="login-page__left" aria-hidden="false">
        <div className="login-page__left-inner">
          {/* Brand */}
          <div className="login-page__brand">
            <div className="login-page__logo-mark" aria-hidden="true">
              <span>N</span>
            </div>
            <div>
              <p className="login-page__logo-name">NaseemLabs</p>
              <p className="login-page__logo-sub">Patient Inquiry System</p>
            </div>
          </div>

          {/* Headline */}
          <div className="login-page__headline">
            <h2 className="login-page__headline-title">
              Smart Patient Inquiry Management for Hair Transplant Clinics
            </h2>
            <p className="login-page__headline-desc">
              Manage leads, follow-ups, and patient conversations seamlessly in one place.
            </p>
          </div>

          {/* Feature blocks */}
          <ul className="login-page__features" role="list">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="login-page__feature">
                <div className="login-page__feature-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="login-page__feature-title">{title}</p>
                  <p className="login-page__feature-desc">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Dashboard illustration mockup */}
          <div className="login-page__mockup" aria-hidden="true">
            <div className="login-page__mockup-bar">
              <div className="login-page__mockup-dot login-page__mockup-dot--red" />
              <div className="login-page__mockup-dot login-page__mockup-dot--yellow" />
              <div className="login-page__mockup-dot login-page__mockup-dot--green" />
              <span className="login-page__mockup-url">dashboard.naseemlabs.com</span>
            </div>
            <div className="login-page__mockup-body">
              <div className="login-page__mockup-sidebar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="login-page__mockup-nav-item" />
                ))}
              </div>
              <div className="login-page__mockup-content">
                <div className="login-page__mockup-stats">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="login-page__mockup-stat">
                      <div className="login-page__mockup-stat-num" />
                      <div className="login-page__mockup-stat-label" />
                    </div>
                  ))}
                </div>
                <div className="login-page__mockup-chart">
                  <BarChart3 size={22} className="login-page__mockup-chart-icon" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="login-page__mockup-row" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="login-page__right">
        <div className="login-page__right-inner">
          {isAlreadySignedIn ? (
            <div className="login-page__already-signed">
              <p>You are already signed in.</p>
              <button type="button" onClick={handleContinue} className="login-page__already-signed-btn">
                Continue to workspace
              </button>
            </div>
          ) : null}

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
}
