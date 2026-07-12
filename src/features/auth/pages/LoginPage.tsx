import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import googleLogoUrl from '../../../assets/logo/Google logo.svg';
import { getAuthErrorMessage, login, saveAuthSession } from '../api/authApi';
import { AuthCard } from '../components/AuthCard';
import { AuthPasswordInput } from '../components/AuthPasswordInput';
import { AuthTextInput } from '../components/AuthTextInput';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

type LoginErrors = Partial<
  Record<keyof Pick<LoginFormValues, 'username' | 'password'>, string>
>;

const initialLoginValues: LoginFormValues = {
  username: '',
  password: '',
  rememberMe: false,
};

export function LoginPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] =
    useState<LoginFormValues>(initialLoginValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange =
    (field: 'username' | 'password') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setSubmitError('');
    };

  const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues((current) => ({
      ...current,
      rememberMe: event.target.checked,
    }));
  };

  const validateForm = () => {
    const nextErrors: LoginErrors = {};

    if (!formValues.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!formValues.password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitLogin = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const authResponse = await login({
        username: formValues.username.trim(),
        password: formValues.password,
      });

      saveAuthSession(authResponse, formValues.rememberMe);
      await navigate({ to: '/' });
    } catch (error) {
      setSubmitError(
        getAuthErrorMessage(
          error,
          'Unable to sign in. Please check your account and try again.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    void submitLogin();
  };

  return (
    <AuthCard
      title="Welcome Back, CodeBiter!"
      subtitle="Sign in to continue your learning roadmap."
      footer={
        <>
          New here?{' '}
          <Link
            to="/signup"
            className="font-bold text-primary-700 hover:text-primary-900"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthTextInput
          id="login-username"
          label="Username"
          value={formValues.username}
          onChange={handleTextChange('username')}
          placeholder="Enter your username"
          autoComplete="username"
          error={errors.username}
        />

        <AuthPasswordInput
          id="login-password"
          label="Password"
          value={formValues.password}
          onChange={handleTextChange('password')}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-4 text-sm font-medium">
          <label className="flex items-center gap-2 text-neutral-700">
            <input
              type="checkbox"
              checked={formValues.rememberMe}
              onChange={handleRememberChange}
              className="h-4 w-4 rounded border-neutral-700 accent-secondary-500"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-primary-700 hover:text-primary-900"
          >
            Forgot Password?
          </Link>
        </div>

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl bg-secondary-500 text-base font-bold text-shade-white shadow-lg shadow-secondary-300/40 transition hover:bg-secondary-700 focus:outline-none focus:ring-4 focus:ring-secondary-300/60 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:shadow-none"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4 text-sm font-semibold text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200" />
        or
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-shade-white text-sm font-bold text-neutral-800 transition hover:border-primary-300 hover:bg-primary-100 focus:outline-none focus:ring-4 focus:ring-primary-300/40"
      >
        <img src={googleLogoUrl} alt="" className="h-5 w-5" />
        Continue with Google
      </button>
    </AuthCard>
  );
}
