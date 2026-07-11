import { apiClient } from '../../../../lib/axios';
import type { GuessOutputQuestion, ValidateResult } from '../guessOutputData';

/**
 * Fetch Guess Output questions from the backend API for a given seed hash.
 *
 * GET /guess_output?seed=<hash>
 */
export async function fetchGuessOutputQuestions(
  seed: string
): Promise<GuessOutputQuestion[]> {
  return (await apiClient.get('/guess_output', {
    params: { seed },
  })) as unknown as GuessOutputQuestion[];
}

/**
 * Validate an answer for a given question.
 *
 * POST /guess_output/validate
 */
export async function validateGuessOutputAnswer(
  id: string,
  answer: number
): Promise<ValidateResult> {
  return (await apiClient.post('/guess_output/validate', {
    id,
    answer,
  })) as unknown as ValidateResult;
}
