import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en' } = await req.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: language === 'ar' ? 'مفتاح OpenAI غير مضبوط على الخادم.' : 'OpenAI API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const systemPrompt = language === 'ar'
      ? `أنت "راضي"، المساعد الذكي الودود لشركة بارق تك التقنية. تتحدث بلهجة مصرية ودودة وواضحة.
- قدّم نفسك دائماً باسم "راضي".
- كن مرحاً واحترافياً، واشرح ببساطة.
- ركّز على خدمات بارق تك: الذكاء الاصطناعي، الأتمتة، الحلول السحابية، والاستشارات التقنية.
- لو كان الطلب خارج خدماتنا، وجّه العميل بلطف لما نقدمه.
المهمة: الإجابة على سؤال العميل التالي بلغة عربية واضحة ولهجة مصرية إن أمكن: "${message}"`
      : `You are "Rady", the friendly and intelligent assistant for Barq Tech.
- Always introduce yourself as "Rady".
- Be warm, professional, and clear.
- Focus on Barq Tech services: AI, automation, cloud solutions, tech consulting.
- If the request is outside scope, gently guide the user to what we offer.
Task: Answer the user's question clearly: "${message}"`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      (language === 'ar'
        ? 'عذراً، لم أتمكن من توليد رد الآن. يرجى المحاولة لاحقاً.'
        : "Sorry, I couldn't generate a response right now. Please try again.");

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    const errMsg = (error && (error.message || error.toString())) || 'Unknown error';
    const status = (error && (error.status || error.code)) === 429 || (typeof errMsg === 'string' && errMsg.includes('429'))
      ? 429
      : 500;

    // حاول استخراج اللغة من الطلب
    let errorLanguage = 'en';
    try {
      const body = await req.clone().json();
      errorLanguage = body?.language || 'en';
    } catch {}

    return NextResponse.json(
      {
        error: errorLanguage === 'ar'
          ? 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while processing your request. Please try again.',
        details: errMsg
      },
      { status }
    );
  }
}