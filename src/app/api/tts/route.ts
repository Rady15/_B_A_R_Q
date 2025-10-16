import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limit (best-effort): 1 request/sec per IP
const lastHitPerIp = new Map<string, number>();
const RATE_LIMIT_MS = 1000;

const DEFAULT_ELEVEN_VOICE = 'nPczCjzI2devNBz1zQrb'; // "Rachel" default voiceId

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId, modelId = 'eleven_turbo_v2_5' } = body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key is not configured on the server.' },
        { status: 500 }
      );
    }

    // Rate-limit per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const last = lastHitPerIp.get(ip) || 0;
    if (now - last < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: 'TTS Error', details: '429 Too Many Requests (server cooldown)' },
        { status: 429 }
      );
    }
    lastHitPerIp.set(ip, now);

    // Small delay to reduce bursts
    await new Promise((r) => setTimeout(r, 200));

    const vId = (voiceId && typeof voiceId === 'string' && voiceId.trim()) ? voiceId : DEFAULT_ELEVEN_VOICE;

    // ElevenLabs Text-to-Speech API
    // https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(vId)}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        // يمكنك تخصيص إعدادات الصوت حسب الحاجة
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    });

    if (!res.ok) {
      // حاول الحصول على تفاصيل الخطأ من JSON
      let details = '';
      try {
        const j = await res.json();
        details = JSON.stringify(j);
      } catch {
        details = await res.text();
      }
      const status = res.status === 429 ? 429 : 500;
      return NextResponse.json(
        { error: 'TTS Error', details },
        { status }
      );
    }

    // ElevenLabs يعيد Blob/stream صوتي (audio/mpeg)
    const arrayBuffer = await res.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json(
      {
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        provider: 'elevenlabs',
        voiceId: vId
      },
      { status: 200 }
    );
  } catch (error: any) {
    const errMsg = (error && (error.message || error.toString())) || 'Unknown error';
    const statusFromResp = (error?.response && (error.response.status || error.response.statusCode)) || undefined;
    const statusDirect = (typeof error?.status === 'number') ? error.status : undefined;
    const has429 = typeof errMsg === 'string' && errMsg.includes('429');
    const status = statusFromResp === 429 || statusDirect === 429 || has429 ? 429 : 500;

    return NextResponse.json(
      { error: 'TTS Error', details: errMsg, provider: 'elevenlabs' },
      { status }
    );
  }
}