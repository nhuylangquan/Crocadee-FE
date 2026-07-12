import md5 from 'md5';

/**
 * Question shape returned from GET /rearrange.
 * `lines` are pre-shuffled by the server.
 */
export interface RearrangeQuestion {
  id: string;
  q: string;
  lines: string[];
}

/**
 * Shape returned from POST /rearrange/validate.
 */
export interface RearrangeValidateResult {
  correct: boolean;
  ex: string;
}

/**
 * Generate the route seed for the rearrange game.
 */
export function generateRearrangeSeed(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const dateStr = `${dd}/${mm}/${yy}`;
  return md5(String(now.getTime()) + md5(dateStr));
}
