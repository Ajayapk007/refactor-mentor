import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { looksLikeCode } from '@/lib/codeDetect';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { code, history = [] } = body;

  if (!code || typeof code !== 'string') {
    return Response.json({ error: 'No code provided.' }, { status: 400 });
  }
  const trimmed = code.trim();
  if (!trimmed) {
    return Response.json({ error: 'Code cannot be empty.' }, { status: 400 });
  }
  if (trimmed.length > 5000) {
    return Response.json({ error: 'Code exceeds 5000 character limit.' }, { status: 400 });
  }
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // Treat as code review whenever input looks like C++ — regardless of history
  const isCodeReview = looksLikeCode(trimmed);

  const userContent = isCodeReview
    ? `Please review this C++ code:\n\n${trimmed}`
    : trimmed;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userContent },
  ];

  // Only retry on 5xx — never on 429 (rate limit)
  let attempts = 0;
  const MAX_RETRIES = 2;

  while (attempts < MAX_RETRIES) {
    attempts++;
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 2048,
        temperature: 0.3,
      });

      const rawText = completion.choices[0]?.message?.content ?? '';

      if (isCodeReview) {
        const cleaned = rawText
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        try {
          const reviewData = JSON.parse(cleaned);
          if (reviewData.error) {
            return Response.json({ error: reviewData.error }, { status: 200 });
          }
          return Response.json({ reviewData }, { status: 200 });
        } catch {
          return Response.json({ plainText: rawText }, { status: 200 });
        }
      }

      return Response.json({ plainText: rawText }, { status: 200 });

    } catch (err) {
      const status = err?.status ?? err?.error?.status ?? 0;
      const msg    = err?.message ?? '';

      const is429 =
        status === 429 ||
        msg.includes('429') ||
        msg.toLowerCase().includes('rate limit') ||
        msg.toLowerCase().includes('too many requests');

      // ── Rate limit: fail immediately, pass retry-after to client ──
      if (is429) {
        // Groq sends Retry-After in seconds — extract if available
        const retryAfter =
          err?.headers?.['retry-after'] ||
          err?.error?.headers?.['retry-after'] ||
          null;

        return Response.json(
          {
            error: 'rate_limited',
            retryAfter: retryAfter ? parseInt(retryAfter, 10) : 30,
          },
          { status: 429 }
        );
      }

      // ── Server errors: retry with short backoff ──
      const is5xx = status >= 500 || msg.includes('500') || msg.includes('503');
      if (is5xx && attempts < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 1500 * attempts));
        continue;
      }

      console.error('Groq API error:', err);
      return Response.json(
        { error: 'Unexpected error. Please try again.' },
        { status: 500 }
      );
    }
  }
}