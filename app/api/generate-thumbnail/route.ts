import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Use predictions API to get the model version first
    const model = await replicate.models.get('black-forest-labs', 'flux-schnell');
    const version = model.latest_version;

    // Create prediction with the correct version
    const prediction = await replicate.predictions.create({
      version: version!.id,
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: '1:1',
        output_format: 'png',
        output_quality: 80,
      },
    });

    // Wait for completion
    const finalPrediction = await replicate.wait(prediction);

    const imageUrl = Array.isArray(finalPrediction.output)
      ? finalPrediction.output[0]
      : finalPrediction.output;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}
