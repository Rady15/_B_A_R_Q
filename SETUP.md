# بارق تك - إعداد OpenAI API

## 🚀 خطوات إعداد مفتاح OpenAI API

### 1. الحصول على مفتاح API
1. اذهب إلى [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. سجل دخولك أو قم بإنشاء حساب جديد
3. اضغط على "Create new secret key"
4. أعط المفتاح اسم (مثلاً: "Barq Tech Assistant")
5. انسخ المفتاح واحتفظ به في مكان آمن

### 2. إضافة المفتاح للمشروع
افتح ملف `.env.local` في المشروع وأضف مفتاحك:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. إعادة تشغيل الخادم
بعد إضافة المفتاح، أعد تشغيل خادم التطوير:
```bash
npm run dev
```

## 🤖 المساعد الصوتي "راضي"

المساعد الصوتي الآن يستخدم OpenAI API واسمه "راضي" ويتحدث:
- **باللهجة المصرية** عند التحدث بالعربية
- **باللغة الإنجليزية** عند التحدث بالإنجليزية

## 📝 ملاحظات هامة

- احتفظ بمفتاح API سرياً ولا تشاركه مع أحد
- يمكنك مراقبة استخدامك من لوحة تحكم OpenAI
- المفتاح مجاني للاستخدام المحدود، ثم يتطلب اشتراكاً مدفوعاً

## 🔧 استكشاف الأخطاء

إذا واجهت مشاكل:
1. تأكد من أن مفتاح API صحيح
2. تحقق من اتصالك بالإنترنت
3. تأكد من أن لديك رصيد كافٍ في حساب OpenAI

---

# Barq Tech - OpenAI API Setup

## 🚀 Steps to Set Up OpenAI API Key

### 1. Get API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create a new account
3. Click "Create new secret key"
4. Give the key a name (e.g., "Barq Tech Assistant")
5. Copy the key and keep it safe

### 2. Add Key to Project
Open the `.env.local` file in the project and add your key:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart Server
After adding the key, restart the development server:
```bash
npm run dev
```

## 🤖 Voice Assistant "Rady"

The voice assistant now uses OpenAI API and is named "Rady" and speaks:
- **Egyptian Arabic** when speaking Arabic
- **English** when speaking English

## 📝 Important Notes

- Keep your API key secret and don't share it with anyone
- You can monitor your usage from the OpenAI dashboard
- The key is free for limited use, then requires a paid subscription

## 🔧 Troubleshooting

If you encounter issues:
1. Make sure your API key is correct
2. Check your internet connection
3. Ensure you have sufficient credit in your OpenAI account