import { useState, type SyntheticEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { AuthSplitCard } from '../components/AuthSplitCard';
import { AuthPasswordInput } from '../components/AuthPasswordInput';
import { resetPassword, getAuthErrorMessage } from '../api/authApi';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(
        getAuthErrorMessage(
          err,
          'An error occurred while resetting your password.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthSplitCard
        title="Password Reset Successful"
        subtitle="Your password has been successfully reset."
        footer={null}
      >
        <div className="mt-4">
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-secondary-500 text-base font-bold text-shade-white shadow-lg shadow-secondary-300/40 transition hover:bg-secondary-700"
          >
            Go to Login
          </Link>
        </div>
      </AuthSplitCard>
    );
  }

  return (
    <AuthSplitCard
      title="Reset Password"
      subtitle="Enter your new password below."
      footer={null}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        noValidate
      >
        <AuthPasswordInput
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setError('');
          }}
          placeholder="Enter new password"
        />
        <AuthPasswordInput
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError('');
          }}
          placeholder="Confirm new password"
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
          disabled={isSubmitting || !newPassword || !confirmPassword}
          className="h-12 w-full rounded-2xl bg-secondary-500 text-base font-bold text-shade-white shadow-lg shadow-secondary-300/40 transition hover:bg-secondary-700 focus:outline-none focus:ring-4 focus:ring-secondary-300/60 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:shadow-none"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthSplitCard>
  );
}
