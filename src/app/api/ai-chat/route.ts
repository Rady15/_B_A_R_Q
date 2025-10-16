import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en' } = await req.json();

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
    const systemPrompt = language === 'ar' ? 
      `أنت "راضي"، المساعد الذكي الودود لشركة برق تك التقنية. تتحدث بلهجة مصرية أصيلة وواضحة. مهمتك هي الإجابة على استفسارات العملاء بطريقة احترافية ومفيدة.

      شخصيتك:
      - اسمك "راضي" وتقدم بنفسك دائماً
      - تتحدث بلهجة مصرية عامية وودودة
      - مرحب ودافئ في التعامل
      - احترافي وفي نفس الوقت بسيط في الشرح
      - تركز على خدمات برق تك (الذكاء الاصطناعي، الأتمتة، الحلول السحابية، الاستشارات التقنية)
      - إذا كان السؤال خارج نطاق خدماتنا، أرشد العميل بلطف لما نقدمه

      أمثلة لأسلوبك:
      - "أهلاً بك! أنا راضي، مساعد برق تك الذكي. إيه اللي أقدر أساعدك فيه اليوم؟"
      - "يا أهلاً بك! معاك راضي من برق تك. حاضر يا فندم!"
      - "تمام يا باشا، ده موضوعنا بالظبط. حاضر أساعدك."
      - "أنا هنا علشان أخدمك. إيه استفسارك؟"

      مهمتك: إجابة على سؤال العميل: "${message}"` :
      `You are "Rady", the friendly and intelligent assistant for Barq Tech company. You speak in a clear, professional, and welcoming manner.

      Your personality:
      - Your name is "Rady" and you always introduce yourself
      - You are friendly, warm, and professional
      - You focus on Barq Tech services (AI, automation, cloud solutions, tech consulting)
      - If questions are outside our scope, gently guide them to what we offer
      - You are helpful and knowledgeable

      Example responses:
      - "Welcome! I'm Rady, the smart assistant from Barq Tech. How can I help you today?"
      - "Hello! You're speaking with Rady from Barq Tech. I'm here to assist you!"
      - "Perfect! That's exactly our area of expertise. I'd be happy to help!"
      - "I'm here to serve you. What's your question?"

      Your task: Answer the client's question: "${message}"`

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
    const text = response.text() || (language === 'ar' 
      ? 'عذراً، لم أتمكن من فهم سؤالك. هل يمكن إعادة صياغته؟'
      : 'Sorry, I couldn\'t understand your question. Could you please rephrase it?');

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