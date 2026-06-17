import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import type { LoginCredentials } from '../../types';
import { LoginForm } from './LoginForm';
import { Logo } from '../../components/common';
import { BACKGROUND_IMAGE_URL } from '../../constants/assets';
import './LoginPage.css';

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

    navigate(ROUTES.WORKSPACE, { replace: true });
  };

  const handleContinue = () => {
    navigate(ROUTES.WORKSPACE, { replace: true });
  };

  return (
    <div className="login-page">
      <img
        className="login-page__background"
        src={BACKGROUND_IMAGE_URL}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      <div className="login-page__overlay" aria-hidden="true" />

      <div className="login-page__container">
        <div className="login-page__stack login-page__stack--login">
          <motion.div
            className="login-page__brand"
            layout
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size="header" layoutId="brand-logo" />
          </motion.div>

          <motion.div
            className="login-page__form"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {isAlreadySignedIn ? (
              <div className="mb-4 w-full max-w-md rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-center text-sm text-purple-800">
                <p>You are already signed in.</p>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-2 font-semibold text-purple-700 underline-offset-2 hover:underline"
                >
                  Continue to workspace
                </button>
              </div>
            ) : null}

            <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
