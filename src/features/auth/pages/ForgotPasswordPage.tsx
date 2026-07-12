import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { AuthSplitCard } from '../components/AuthSplitCard';
import { AuthTextInput } from '../components/AuthTextInput';
import { forgotPassword, getAuthErrorMessage } from '../api/authApi';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(
        getAuthErrorMessage(err, 'An error occurred. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSplitCard
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link."
      footer={
        <>
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-bold text-primary-700 hover:text-primary-900"
          >
            Sign in
          </Link>
        </>
      }
    >
      {success ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          If an account with that email exists, we have sent a password reset
          link.
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          noValidate
        >
          <AuthTextInput
            id="forgot-email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="h-12 w-full rounded-2xl bg-secondary-500 text-base font-bold text-shade-white shadow-lg shadow-secondary-300/40 transition hover:bg-secondary-700 focus:outline-none focus:ring-4 focus:ring-secondary-300/60 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:shadow-none"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </AuthSplitCard>
  );
}
