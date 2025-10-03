import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const chat = await v0.chats.create({
      message
    });

    // Poll for the demo URL (wait for generation to complete)
    let attempts = 0;
    const maxAttempts = 90; // 3 minutes max (2 second intervals)

    while (attempts < maxAttempts) {
      const updatedChat = await v0.chats.getById({ chatId: chat.id });

      if (updatedChat.latestVersion?.demoUrl) {
        return NextResponse.json({
          demoUrl: updatedChat.latestVersion.demoUrl,
          chatId: chat.id,
          webUrl: chat.webUrl
        });
      }

      // Check if generation failed
      if (updatedChat.latestVersion?.status === 'failed') {
        return NextResponse.json(
          { error: 'App generation failed', webUrl: chat.webUrl },
          { status: 500 }
        );
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    // If we timeout, return error with web URL
    return NextResponse.json(
      { error: 'Generation timed out', webUrl: chat.webUrl },
      { status: 408 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate app' },
      { status: 500 }
    );
  }
}
