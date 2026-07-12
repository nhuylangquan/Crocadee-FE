import { createLazyFileRoute } from '@tanstack/react-router';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';

export const Route = createLazyFileRoute('/reset-password')({
  component: ResetPasswordPage,
});
