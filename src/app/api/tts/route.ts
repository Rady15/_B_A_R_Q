import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en', voiceName } = body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // اختر صوتاً افتراضياً إذا لم يُمرّر voiceName
    // alloy (إنجليزي جيد)، verse (عربي جيّد نسبياً)، يمكنك تغييرها حسب تفضيلك
    const voice = voiceName || (language?.startsWith('ar') ? 'verse' : 'alloy');

    // نموذج TTS
    const model = 'gpt-4o-mini-tts';

    // إنشاء صوت MP3
    const speech = await client.audio.speech.create({
      model,
      voice,
      input: text,
    });

    // SDK يُرجع Blob في بيئة Node
    const arrayBuffer = await speech.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json(
      {
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        languageCode: language,
        usedVoice: voice,
        provider: 'openai',
      },
      { status: 200 }
    );
  } catch (error: any) {
    const errMsg = (error && (error.message || error.toString())) || 'Unknown error';
    const status = (error && (error.status || error.code)) === 429 || (typeof errMsg === 'string' && errMsg.includes('429'))
      ? 429
      : 500;
    return NextResponse.json(
      { error: 'TTS Error', details: errMsg },
      { status }
    );
  }
}