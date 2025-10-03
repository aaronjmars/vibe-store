import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { count = 1 } = await request.json().catch(() => ({}));

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: `Generate ${count} random, fun, and quirky mobile app concepts. Return ONLY valid JSON with an "apps" array containing ${count} items. Each item must have:
- "name" (short app name, 1-3 words)
- "description" (brief description, 10-20 words)
- "imagePrompt" (detailed Flux prompt for a colorful, vibrant, glossy iOS 6 skeuomorphic app icon with depth, shadows, highlights, and rich textures)

Be creative! Examples: productivity apps, games, utilities, social apps, health apps, entertainment.

IMPORTANT: Return ONLY valid JSON. Escape all quotes in strings properly. No markdown, no code blocks.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0].message.content || '{"apps":[]}';

    // Clean up potential markdown code blocks
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    const result = JSON.parse(cleanContent);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate app idea' },
      { status: 500 }
    );
  }
}
