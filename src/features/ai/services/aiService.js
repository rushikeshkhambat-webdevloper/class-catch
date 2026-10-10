import { functions, SUMMARIZER_FUNCTION_ID } from '../../../services/appwrite';

export async function summarizeText(text, type = 'note') {
  if (!text || text.trim().length === 0) {
    throw new Error('Nothing to summarize');
  }

  const execution = await functions.createExecution(
    SUMMARIZER_FUNCTION_ID,
    JSON.stringify({ text, type }),
    false
  );

  if (execution.status !== 'completed') {
    throw new Error('Function failed: ' + execution.status);
  }

  const response = JSON.parse(execution.responseBody || '{}');
  if (response.error) {
    throw new Error(response.error);
  }
  return response.summary;
}

// Helper: combine note content + extractedText
export function getNoteFullText(note) {
  const parts = [note.content, note.extractedText].filter(Boolean);
  return parts.join('\n\n');
}