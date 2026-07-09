import md5 from 'md5';

/**
 * Question shape from the API.
 *
 *   q:  question text (may include code after a newline)
 *   o:  options { a, b, c, d }
 *   c:  0-based index of the correct answer
 *   ex: explanation shown when the user answers incorrectly (optional)
 */
export interface GuessOutputQuestion {
  q: string;
  o: { a: string; b: string; c: string; d: string };
  c: 0 | 1 | 2 | 3;
  ex?: string;
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

/**
 * Hardcoded demo questions for the Guess Output mini-game.
 *
 * Each question has:
 *   q – The question/prompt shown above the code block
 *   o – Options object with the four choices (a…d)
 *   c – Index (0…3) of the correct answer
 */
export const DEMO_QUESTIONS: GuessOutputQuestion[] = [
  {
    q: 'What is the output of the following code?',
    o: {
      a: '[1, 2]',
      b: '[2, 3]',
      c: '[1, 2, 3]',
      d: '[2, 3, 4]',
    },
    c: 1, // x[1:3] → [2, 3]
  },
  {
    q: 'What does the following code print?',
    o: {
      a: '0',
      b: 'None',
      c: '5',
      d: 'Error',
    },
    c: 0, // print(len([])) → 0
  },
  {
    q: 'What does this function return?',
    o: {
      a: 'True',
      b: 'False',
      c: 'None',
      d: 'Error',
    },
    c: 2, // def foo(): pass → returns None
  },
  {
    q: 'What is the output of this list comprehension?',
    o: {
      a: '[0, 1, 2, 3, 4]',
      b: '[1, 3, 5, 7, 9]',
      c: '[0, 2, 4, 6, 8]',
      d: '[2, 4, 6, 8, 10]',
    },
    c: 2, // [x*2 for x in range(5)] → [0, 2, 4, 6, 8]
  },
  {
    q: 'What does the following code print?',
    o: {
      a: '12345',
      b: '54321',
      c: '"54321"',
      d: 'TypeError',
    },
    c: 1, // print("".join(reversed("12345"))) → "54321"
  },
];

/**
 * Default code snippet shown alongside each question.
 * When the API provides per-question code, this will be replaced.
 */
export const DEFAULT_CODE_SNIPPET = `x = [1, 2, 3, 4, 5]
print(x[1:3])  # What does this print?`;
