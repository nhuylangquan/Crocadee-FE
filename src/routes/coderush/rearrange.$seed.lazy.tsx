import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { RearrangeScreen } from '../../features/coderush/rearrange/RearrangeScreen';
import { fetchRearrangeQuestions } from '../../features/coderush/rearrange/api/rearrangeApi';
import type { RearrangeQuestion } from '../../features/coderush/rearrange/rearrangeData';

export const Route = createLazyFileRoute('/coderush/rearrange/$seed')({
  component: RearrangeRoute,
});

/* eslint-disable-next-line react-refresh/only-export-components */
function RearrangeRoute() {
  const { seed } = Route.useParams();
  const [questions, setQuestions] = useState<RearrangeQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (seed) {
      fetchRearrangeQuestions(seed)
        .then((data) => {
          if (!cancelled) setQuestions(data);
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(
              err instanceof Error ? err.message : 'Failed to load questions'
            );
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [seed]);

  if (error) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-[#F9F9FF] text-neutral-900">
        <p className="text-lg text-[#BA1A1A]">{error}</p>
      </main>
    );
  }

  if (!questions) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-[#F9F9FF] text-neutral-900">
        <p className="text-lg text-[#4A4454]">Loading questions…</p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-[#F9F9FF] text-neutral-900">
      <RearrangeScreen questions={questions} />
    </main>
  );
}
