import { apiClient } from '../../../../lib/axios';
import type { GuessOutputQuestion } from '../guessOutputData';

export interface GuessOutputApiResponse {
  questions: GuessOutputQuestion[];
}

/**
 * Fetch Guess Output questions from the backend API for a given seed hash.
 *
 * GET /questions?seed=<hash>
 *
 * The seed ensures deterministic question sets per user/session.
 */
export async function fetchGuessOutputQuestions(
  seed: string
): Promise<GuessOutputQuestion[]> {
  return (await apiClient.get('/questions', {
    params: { seed },
  })) as unknown as GuessOutputQuestion[];
}
