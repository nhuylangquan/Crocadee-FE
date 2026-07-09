import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { GuessOutputScreen } from '../../features/coderush/guess-output/GuessOutputScreen';
import { fetchGuessOutputQuestions } from '../../features/coderush/guess-output/api/guessOutputApi';
import type { GuessOutputQuestion } from '../../features/coderush/guess-output/guessOutputData';

export const Route = createLazyFileRoute('/coderush/guess_output/$seed')({
  component: GuessOutputRoute,
});

/* eslint-disable-next-line react-refresh/only-export-components */
function GuessOutputRoute() {
  const { seed } = Route.useParams();
  const [questions, setQuestions] = useState<GuessOutputQuestion[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchGuessOutputQuestions(seed)
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
      <GuessOutputScreen questions={questions} />
    </main>
  );
}
