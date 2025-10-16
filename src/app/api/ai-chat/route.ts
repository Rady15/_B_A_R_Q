import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en', isFirst = false } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: language === 'ar' ? 'مفتاح Google API غير مضبوط على الخادم.' : 'Google API key is not configured on the server.' },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create system prompt based on language
    const systemPrompt = language === 'ar' 
      ? (isFirst
          ? `أنت "راضي"، مساعد برق تك الذكي. تتحدث بلهجة مصرية واضحة وودودة.
- في هذه الرسالة الأولى فقط: قدّم نفسك باختصار شديد ثم أجب مباشرةً.
- كن احترافيًا ومفيدًا وبسيطًا في الشرح.
- ركّز على خدمات برق تك (الذكاء الاصطناعي، الأتمتة، الحلول السحابية، الاستشارات التقنية).
مهمتك الآن: أجب على سؤال العميل التالي بشكل موجز وواضح: "${message}"`
          : `أنت "راضي"، مساعد برق تك الذكي. لا تعرّف بنفسك الآن لأن التعريف تم سابقًا.
- أجب مباشرةً وباختصار، بشكل احترافي ومفيد.
- ركّز على خدمات برق تك (الذكاء الاصطناعي، الأتمتة، الحلول السحابية، الاستشارات التقنية).
مهمتك الآن: أجب على سؤال العميل التالي بشكل موجز وواضح: "${message}"`)
      : (isFirst
          ? `You are "Rady", Barq Tech's smart assistant. Speak in a clear, friendly, and professional tone.
- For this first message only: briefly introduce yourself, then answer directly.
- Be concise, helpful, and focus on Barq Tech services (AI, automation, cloud, consulting).
Your task now: answer the client's question clearly and briefly: "${message}"`
          : `You are "Rady", Barq Tech's smart assistant. Do NOT introduce yourself now (already done).
- Answer directly and concisely in a helpful, professional tone.
- Focus on Barq Tech services (AI, automation, cloud, consulting).
Your task now: answer the client's question clearly and briefly: "${message}"`)

    // Helper: clean intro lines if model repeats introduction on non-first turns
    function cleanIntro(input: string, lang: string) {
      if (!input) return input;
      const s = input.trim();
      if (lang === 'ar') {
        // Remove common Arabic intros like greetings and self-intros
        return s
          .replace(/^(\s*السلام\s+عليكم.*?\s)?\s*أنا\s+راضي.*?\s*/i, '')
          .replace(/^\s*(أهلين|مرحبًا|مرحباً|يا\s?أهلاً|أهلاً\s+وسهلاً).*?\s*/i, '')
          .trim();
      }
      return s.replace(/^\s*(Hi|Hello|Welcome)!?\s*I'?m\s*Rady.*?\s*/i, '').trim();
    }

    // Combine system prompt and user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    let result;
    try {
      result = await model.generateContent(fullPrompt);
    } catch (err) {
      // Fallback to older model in case 2.5 fails on the deployment
      const fallback = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await fallback.generateContent(fullPrompt);
    }
    const response = await result.response;
    let text = response.text() || (language === 'ar' 
      ? 'عذراً، لم أتمكن من فهم سؤالك. هل يمكن إعادة صياغته؟'
      : 'Sorry, I couldn\'t understand your question. Could you please rephrase it?');

    if (!isFirst) {
      text = cleanIntro(text, language);
    }
    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("Google AI API Error:", error);
    
    // Extract language from request body if available, otherwise default to 'en'
    let errorLanguage = 'en'
    try {
      const requestBody = await req.clone().json()
      errorLanguage = requestBody.language || 'en'
    } catch (e) {
      // If we can't parse the request body, use default language
      errorLanguage = 'en'
    }
    
    return NextResponse.json(
      { 
        error: errorLanguage === 'ar' 
          ? 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while processing your request. Please try again.'
      },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from 'next/server'
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req: NextRequest) {
//   try {
//     const { message } = await req.json();

//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const result = await model.generateContent(message);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ response: text }, { status: 200 });
//   } catch (error: any) {
//     console.error("Google AI API Error:", error);
//     return NextResponse.json(
//       { error: "Google AI API Error", details: error.message || error.toString() },
//       { status: 500 }
//     );
//   }
// }