import { NextResponse } from 'next/server';
import { createClient } from 'v0-sdk';

const client = createClient({
  apiKey: process.env.V0_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { chatId } = await request.json();

    const messages = await client.chats.findMessages({
      chatId: chatId,
    });

    return NextResponse.json({ messages: messages.data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
