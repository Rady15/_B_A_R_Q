import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en', voiceName, speakingRate = 1.0, pitch = 0.0 } = body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const projectId = process.env.GOOGLE_PROJECT_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Google Cloud TTS credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    // Vercel env often needs newline fix for private keys:
    privateKey = privateKey.replace(/\\n/g, '\n');

    const client = new TextToSpeechClient({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    // Map language to Google Cloud TTS languageCode
    // ar -> ar-XA (generic Arabic), en -> en-US as default; allow custom voiceName override
    const languageCode = language === 'ar' ? 'ar-XA' : (language === 'en' ? 'en-US' : language);

    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName || undefined, // e.g., 'en-US-Wavenet-D' or 'ar-XA-Wavenet-A' if available
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch,
      },
    };

    const result = await client.synthesizeSpeech(request as any);
    const response = (result as any)[0];
    const audioContent = response?.audioContent as Uint8Array | Buffer | undefined;

    if (!audioContent) {
      return NextResponse.json(
        { error: 'TTS synthesis produced no audio.' },
        { status: 500 }
      );
    }

    const base64Audio = Buffer.from(audioContent).toString('base64');

    return NextResponse.json(
      {
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        languageCode,
        usedVoice: request.voice?.name || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const errMsg = (error && (error.message || error.toString())) || 'Unknown error';
    return NextResponse.json(
      { error: 'TTS Error', details: errMsg },
      { status: 500 }
    );
  }
}