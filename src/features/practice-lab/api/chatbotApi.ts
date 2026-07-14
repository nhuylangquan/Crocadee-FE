import { apiClient } from '../../../lib/axios';

export interface ConceptResponse {
  answer: string;
  followUpQuestions: string[];
}

export async function askConcept(
  question: string,
  lessonTitle?: string
): Promise<ConceptResponse> {
  return (await apiClient.post('/chatbot/concept', {
    question,
    lessonTitle,
  })) as unknown as ConceptResponse;
}
export interface DebugResponse {
  diagnosis: string;
  fixSuggestion: string;
  explanation: string;
}

export async function debugCode(
  code: string,
  errorMessage: string
): Promise<DebugResponse> {
  return (await apiClient.post('/chatbot/debug', {
    code,
    errorMessage,
  })) as unknown as DebugResponse;
}
