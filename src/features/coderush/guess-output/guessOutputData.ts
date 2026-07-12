import md5 from 'md5';

/**
 * Question shape returned from GET /guess_output.
 * Note: `c` (correct answer) and `ex` (explanation) are NOT included.
 * Answer validation is done server-side via POST /guess_output/validate.
 */
export interface GuessOutputQuestion {
  id: string;
  q: string;
  o: { a: string; b: string; c: string; d: string };
}

/**
 * Shape returned from POST /guess_output/validate.
 */
export interface ValidateResult {
  correct: boolean;
  ex: string;
}

/**
 * Generate the route seed used for the coderush/guess_output/<seed> URL.
 *
 * Pattern: md5(curr_time + md5(current_date in dd/mm/yy))
 */
export function generateGuessOutputSeed(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const dateStr = `${dd}/${mm}/${yy}`;
  return md5(String(now.getTime()) + md5(dateStr));
}
