import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Checkbox, GoogleIcon, InputField } from '../../components/common';
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

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

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

  return (
    <motion.div
      className="login-form-card"
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="login-form-card__badge">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Secure &amp; Encrypted</span>
      </div>

      <div className="login-form-card__header">
        <h2 className="login-form-card__title">Welcome Back</h2>
        <p className="login-form-card__subtitle">Sign in to access your account</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <div className="login-form__alert" role="alert">
            {error}
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
            label="Remember me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <button type="button" className="login-form__link">
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endIcon={<ArrowRight size={18} />}
        >
          Continue
        </Button>

        <div className="login-form__divider">
          <span>or</span>
        </div>

        <Button type="button" variant="secondary" startIcon={<GoogleIcon />}>
          Continue with Google
        </Button>
      </form>

      <div className="login-form-card__footer">
        <span>
          <ShieldCheck size={15} aria-hidden="true" />
          Protected patient data
        </span>
        <span className="login-form-card__footer-divider" aria-hidden="true" />
        <span>
          <Lock size={15} aria-hidden="true" />
          Secure clinic access
        </span>
      </div>
    </motion.div>
  );
}
