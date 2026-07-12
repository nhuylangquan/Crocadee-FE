import { apiClient } from '../../../../lib/axios';
import type {
  RearrangeQuestion,
  RearrangeValidateResult,
} from '../rearrangeData';

/**
 * Fetch Rearrange questions from the backend API for a given seed hash.
 *
 * GET /rearrange?seed=<hash>
 */
export async function fetchRearrangeQuestions(
  seed: string
): Promise<RearrangeQuestion[]> {
  return (await apiClient.get('/rearrange', {
    params: { seed },
  })) as unknown as RearrangeQuestion[];
}

/**
 * Validate the user's rearranged lines for a given question.
 *
 * POST /rearrange/validate
 */
export async function validateRearrangeAnswer(
  id: string,
  lines: string[]
): Promise<RearrangeValidateResult> {
  return (await apiClient.post('/rearrange/validate', {
    id,
    lines,
  })) as unknown as RearrangeValidateResult;
}
