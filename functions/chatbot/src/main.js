import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { Client, Storage } from 'node-appwrite';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export default async ({ req, res, log, error }) => {
  if (req.path === '/extract') {
    return await handleExtract(req, res, log, error);
  }
  return await handleChat(req, res, log, error);
};

// ---------- CHAT ----------
async function handleChat(req, res, log, error) {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const { messages = [], notes = [] } = body;

    if (!messages.length) {
      return res.json({ error: 'No messages provided' }, 400);
    }

    let contextBlock = '';
    if (notes.length > 0) {
      const noteText = notes
        .map((n, i) => {
          const title = n.title ? `Title: ${n.title}\n` : '';
          const content = n.content || '';
          const extracted = n.extractedText || '';
          const combined = [content, extracted].filter(Boolean).join('\n\n');
          return `--- Note ${i + 1} ---\n${title}${combined}`;
        })
        .join('\n\n');

      contextBlock = `The following notes have been shared by students and teachers. Use them as your primary source of information when answering:\n\n${noteText}\n\n`;
    }

    const systemPrompt = `${contextBlock}You are "Class Catch AI", a helpful teaching assistant for students.

Guidelines:
- Answer the student's question based on the class notes provided above.
- If the answer is in the notes, cite the relevant concept.
- If the answer isn't in the notes, say so politely and offer general help if you can.
- When asked to explain examples, break them down step by step.
- When asked for a "4-mark answer" or "short answer", format the response as 3-5 key bullet points.
- When asked to list important points, use concise bullet points.
- Be encouraging, clear, use simple language.
- Use markdown formatting (bullet points, bold, numbered lists).
- Keep answers focused.`;

    const conversation = messages
      .map(m => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    log(`Chat: ${messages.length} messages, ${notes.length} notes as context`);

    const { text: reply } = await generateText({
      model: groq('openai/gpt-oss-120b'),
      system: systemPrompt,
      prompt: conversation,
      maxTokens: 800,
      temperature: 0.6
    });

    log(`Reply generated — ${reply.length} chars`);
    return res.json({ reply: reply.trim() });

  } catch (err) {
    error(`Chatbot error: ${err.message}`);
    return res.json({
      error: 'Failed to generate reply',
      details: err.message
    }, 500);
  }
}

// ---------- EXTRACT ----------
async function handleExtract(req, res, log, error) {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const { fileId, bucketId, fileType, fileName } = body;

    if (!fileId || !bucketId) {
      return res.json({ error: 'fileId and bucketId required' }, 400);
    }

    // Download file from Appwrite Storage
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);
    const arrayBuffer = await storage.getFileDownload(bucketId, fileId);
    const buffer = Buffer.from(arrayBuffer);

    log(`Downloaded ${fileName || fileId} (${buffer.length} bytes)`);

    let text = '';
    const lowerName = (fileName || '').toLowerCase();
    const lowerType = (fileType || '').toLowerCase();
    const isPdf = lowerType === 'application/pdf' || lowerName.endsWith('.pdf');
    const isDocx =
      lowerType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.docx');
    const isImage = lowerType.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(lowerName);
    const isText = lowerType === 'text/plain' || lowerName.endsWith('.txt') || lowerName.endsWith('.md');

    // 1. Try typed PDF extraction first (fast, unlimited)
    if (isPdf) {
      try {
        const data = await pdfParse(buffer);
        text = (data.text || '').trim();
        log(`PDF text layer: ${text.length} chars`);

        // If nearly empty → likely scanned/handwritten → fall back to OCR
        if (text.length < 30) {
          log('PDF has no text layer, falling back to OCR');
          const ocrText = await runOcr(buffer, fileName, 'pdf', log, error);
          if (ocrText) text = ocrText;
        }
      } catch (err) {
        error(`pdf-parse failed: ${err.message}, trying OCR`);
        const ocrText = await runOcr(buffer, fileName, 'pdf', log, error);
        if (ocrText) text = ocrText;
      }
    }
    // 2. DOCX
    else if (isDocx) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = (result.value || '').trim();
        log(`DOCX text: ${text.length} chars`);
      } catch (err) {
        error(`DOCX parse failed: ${err.message}`);
        return res.json({
          error: 'Could not read this DOCX',
          details: err.message
        }, 422);
      }
    }
    // 3. Plain text
    else if (isText) {
      text = buffer.toString('utf-8').trim();
      log(`Plain text: ${text.length} chars`);
    }
    // 4. Image → OCR
    else if (isImage) {
      const ocrText = await runOcr(buffer, fileName, 'image', log, error);
      if (ocrText) text = ocrText;
    }
    // 5. Old .doc
    else if (lowerName.endsWith('.doc')) {
      return res.json({
        error: 'Old .doc format not supported',
        hint: 'Save the file as .docx or PDF and upload again.'
      }, 422);
    }
    // 6. Unknown
    else {
      return res.json({ error: 'Unsupported file type' }, 422);
    }

    // Clean and cap
    text = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const MAX = 15000;
    const truncated = text.length > MAX;
    if (truncated) text = text.slice(0, MAX);

    return res.json({
      text,
      length: text.length,
      truncated
    });

  } catch (err) {
    error(`Extract error: ${err.message}`);
    return res.json({
      error: 'Failed to extract text',
      details: err.message
    }, 500);
  }
}

// ---------- OCR VIA OCR.SPACE ----------
async function runOcr(buffer, fileName, kind, log, error) {
  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    error('OCR_SPACE_API_KEY not set');
    return '';
  }

  // OCR.space free tier: 1 MB max
  const MAX_BYTES = 1 * 1024 * 1024;
  if (buffer.length > MAX_BYTES) {
    log(`File is ${(buffer.length / 1024 / 1024).toFixed(2)} MB — over OCR free tier limit (1 MB)`);
    return '';
  }

  try {
    const base64 = buffer.toString('base64');
    const mime = kind === 'pdf' ? 'application/pdf' : 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64}`;

    const params = new URLSearchParams({
      apikey: apiKey,
      base64Image: dataUri,
      language: 'auto',
      OCREngine: '3',        // best for handwriting
      scale: 'true',
      isOverlayRequired: 'false',
      filetype: kind === 'pdf' ? 'PDF' : 'JPG'
    });

    log(`Calling OCR.space (${kind}, ${(buffer.length / 1024).toFixed(0)} KB)`);

    const resp = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!resp.ok) {
      error(`OCR.space HTTP ${resp.status}`);
      return '';
    }

    const data = await resp.json();

    if (data.IsErroredOnProcessing) {
      error(`OCR error: ${data.ErrorMessage || 'unknown'}`);
      return '';
    }

    // Combine parsed pages
    const parsed = (data.ParsedResults || [])
      .map(p => p.ParsedText || '')
      .filter(Boolean)
      .join('\n\n');

    log(`OCR extracted ${parsed.length} chars`);
    return parsed.trim();

  } catch (err) {
    error(`OCR call failed: ${err.message}`);
    return '';
  }
}