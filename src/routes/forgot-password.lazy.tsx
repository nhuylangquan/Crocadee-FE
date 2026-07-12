import { createLazyFileRoute } from '@tanstack/react-router';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';

export const Route = createLazyFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});
