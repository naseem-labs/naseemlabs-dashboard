import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { Button, Checkbox, GoogleIcon, InputField } from '../../components/common';
import { authService } from '../../services/auth.service';
import type { LoginCredentials } from '../../types';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// ────────────────────────────────────────────────────────────────────────
type ForgotPasswordStep = 'idle' | 'form' | 'sending' | 'sent' | 'error';

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [resetEmail, setResetEmail] = useState('');
  const [step, setStep] = useState<ForgotPasswordStep>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setEmailError('');
    setStep('sending');

    const response = await authService.sendPasswordReset(resetEmail.trim());

    if (!response.success) {
      setErrorMsg(response.error ?? 'Unable to send reset email. Please try again.');
      setStep('error');
      return;
    }

    setStep('sent');
  };

  return (
    <div className="forgot-overlay" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
      <div className="forgot-modal">
        <button
          type="button"
          className="forgot-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {step === 'sent' ? (
          <div className="forgot-modal__success">
            <CheckCircle2 size={40} className="forgot-modal__success-icon" aria-hidden="true" />
            <h3 className="forgot-modal__title">Check your inbox</h3>
            <p className="forgot-modal__desc">
              We sent a password reset link to <strong>{resetEmail}</strong>. Check your email and follow the link to reset your password.
            </p>
            <Button type="button" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <h3 id="forgot-title" className="forgot-modal__title">Reset your password</h3>
            <p className="forgot-modal__desc">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={(e) => void handleSend(e)} noValidate>
              {step === 'error' ? (
                <div className="forgot-modal__error" role="alert">{errorMsg}</div>
              ) : null}

              <InputField
                label="Email Address"
                type="email"
                name="reset-email"
                autoComplete="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setEmailError('');
                }}
                icon={<Mail size={18} />}
                error={emailError}
              />

              <div className="forgot-modal__actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={step === 'sending'}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showForgot, setShowForgot] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      email: email.trim(),
      password,
      rememberMe,
    });
  };

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    setIsGoogleLoading(true);
    const response = await authService.loginWithGoogle();
    if (!response.success) {
      setGoogleError(response.error ?? 'Unable to sign in with Google.');
      setIsGoogleLoading(false);
    }
    // On success the browser redirects — no further action needed
  };

  const displayError = error ?? googleError;

  return (
    <>
      {showForgot ? (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      ) : null}

      <div className="login-form-card">
        <div className="login-form-card__badge">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>Secure &amp; Encrypted</span>
        </div>

        <div className="login-form-card__header">
          <h2 className="login-form-card__title">Welcome Back</h2>
          <p className="login-form-card__subtitle">Sign in to access your clinic workspace</p>
        </div>

        <form className="login-form" onSubmit={(e) => void handleSubmit(e)} noValidate>
          {displayError ? (
            <div className="login-form__alert" role="alert">
              {displayError}
            </div>
          ) : null}

          <InputField
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail size={18} />}
            error={fieldErrors.email}
          />

          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={<Lock size={18} />}
            error={fieldErrors.password}
            endAdornment={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="login-form__meta">
            <Checkbox
              label="Remember Me"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <button
              type="button"
              className="login-form__link"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            endIcon={<ArrowRight size={18} />}
          >
            Sign In
          </Button>

          <div className="login-form__divider">
            <span>OR</span>
          </div>

          <Button
            type="button"
            variant="secondary"
            startIcon={<GoogleIcon />}
            isLoading={isGoogleLoading}
            onClick={() => void handleGoogleLogin()}
          >
            Continue with Google
          </Button>
          <div className="login-form__signup">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="login-form__signup-link"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="login-form-card__terms">
          By signing in, you agree to our{' '}
          <a href="#" className="login-form-card__terms-link">Terms</a>
          {' '}&amp;{' '}
          <a href="#" className="login-form-card__terms-link">Privacy Policy</a>
        </p>
      </div>
    </>
  );
}
