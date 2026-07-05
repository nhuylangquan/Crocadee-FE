import { createLazyFileRoute } from '@tanstack/react-router';
import { TryItYourselfPage } from '../features/practice-lab/pages/TryItYourselfPage';

export const Route = createLazyFileRoute('/practice-lab_/try-it')({
  component: TryItYourselfPage,
});
