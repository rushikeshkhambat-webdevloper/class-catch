import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export default async ({ req, res, log, error }) => {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const { text, type } = body;

    if (!text || text.trim().length === 0) {
      return res.json({ error: 'No text provided' }, 400);
    }

    if (text.length > 8000) {
      return res.json({ error: 'Text too long. Max 8000 characters.' }, 400);
    }

    const systemPrompt = type === 'video'
      ? 'You are a helpful teaching assistant. Summarize this class video into 3-5 key takeaways that students should remember. Use bullet points.'
      : 'You are a helpful teaching assistant. Summarize these notes into 3-5 concise bullet points that capture the key concepts. Use bullet points.';

    log(`Summarizing ${type || 'note'} — ${text.length} chars`);

    const { text: summary } = await generateText({
    model: groq('openai/gpt-oss-120b'),
      system: systemPrompt,
      prompt: text,
      maxTokens: 500,
      temperature: 0.5
    });

    log(`Summary generated — ${summary.length} chars`);
    return res.json({ summary: summary.trim() });

  } catch (err) {
    error(`Function error: ${err.message}`);
    return res.json({ error: 'Failed to summarize', details: err.message }, 500);
  }
};