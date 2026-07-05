import { createLazyFileRoute } from '@tanstack/react-router';
import { PracticeLabPage } from '../features/practice-lab/pages/PracticeLabPage';

export const Route = createLazyFileRoute('/practice-lab')({
  component: PracticeLabPage,
});
