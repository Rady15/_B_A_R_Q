'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Smart. Fast. Limitless.',
    'hero.subtitle': 'AI-driven automation & technology solutions for the modern world.',
    'hero.cta': 'Discover Our Solutions ⚡',
    
    // About Section
    'about.title': 'About Barq Tech',
    'about.description': 'We are pioneers in the digital frontier, fusing the power of artificial intelligence with cutting-edge technology. Our mission is to electrify industries, automate the complex, and build intelligent systems that propel your business into the future. We don\'t just follow trends; we create the currents of tomorrow.',
    
    // Services Section
    'services.title': 'Our Core Services',
    'services.ai.title': 'AI Automation',
    'services.ai.description': 'Streamline your workflows with intelligent automation. We build custom AI models that learn, adapt, and optimize your processes for maximum efficiency.',
    'services.cloud.title': 'Cloud & Data Systems',
    'services.cloud.description': 'Harness the power of the cloud. We design scalable, secure, and robust data architectures that turn your information into a strategic asset.',
    'services.consulting.title': 'Tech Consulting',
    'services.consulting.description': 'Navigate the complex tech landscape with confidence. Our experts provide strategic guidance to help you make the right technology investments.',
    
    // Portfolio Section
    'portfolio.title': 'Project Showcase',
    'portfolio.project1.title': 'Neural Finance AI',
    'portfolio.project1.description': 'Predictive analytics for stock markets.',
    'portfolio.project2.title': 'Smart Grid Manager',
    'portfolio.project2.description': 'IoT solution for energy distribution.',
    'portfolio.project3.title': 'Logistics Optimizer',
    'portfolio.project3.description': 'AI-driven route planning and fleet management.',
    
    // Contact Section
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Ready to transform your business with AI? Let\'s talk!',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    
    // Voice Assistant
    'voice.welcome': 'Welcome! I\'m Rady, the smart assistant from Barq Tech. How can I help you today?',
    'voice.listening': 'Listening...',
    'voice.speaking': 'Rady is responding...',
    'voice.tapToTalk': 'Tap to talk with Rady',
    
    // Footer
    'footer.copyright': '© 2024 Barq Tech. All Rights Reserved.',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'خدماتنا',
    'nav.portfolio': 'معرض الأعمال',
    'nav.contact': 'اتصل بنا',
    
    // Hero Section
    'hero.title': 'ذكية. سريعة. بلا حدود.',
    'hero.subtitle': 'حلول الأتمتة والتكنولوجيا المدعومة بالذكاء الاصطناعي للعالم الحديث.',
    'hero.cta': 'اكتشف حلولنا ⚡',
    
    // About Section
    'about.title': 'حول بارق تك',
    'about.description': 'نحن رواد في الحدود الرقمية، نجمع قوة الذكاء الاصطناعي مع أحدث التقنيات. مهمتنا هي كهربة الصناعات، أتمتة المعقد، وبناء أنظمة ذكية تدفع أعمالك نحو المستقبل. نحن لا نتبع الاتجاهات فقط؛ بل نخلق تيارات الغد.',
    
    // Services Section
    'services.title': 'خدماتنا الأساسية',
    'services.ai.title': 'أتمتة الذكاء الاصطناعي',
    'services.ai.description': 'بسط سير العمل الخاص بك مع الأتمتة الذكية. نبني نماذج ذكاء اصطناعي مخصصة تتعلم وتتكيف وتحسن عملياتك لتحقيق أقصى كفاءة.',
    'services.cloud.title': 'السحابة وأنظمة البيانات',
    'services.cloud.description': 'استغل قوة السحابة. نصمم بنى تحتية للبيانات قابلة للتطوير وآمنة وقوية تحول معلوماتك إلى أصل استراتيجي.',
    'services.consulting.title': 'الاستشارات التقنية',
    'services.consulting.description': 'تنقل في المشهد التقني المعقد بثقة. يقدم خبراؤنا إرشاداً استراتيجياً لمساعدتك في اتخاذ استثمارات التكنولوجيا الصحيحة.',
    
    // Portfolio Section
    'portfolio.title': 'معرض المشاريع',
    'portfolio.project1.title': 'التمويل العصبي بالذكاء الاصطناعي',
    'portfolio.project1.description': 'التحليلات التنبؤية لأسواق الأسهم.',
    'portfolio.project2.title': 'مدير الشبكة الذكية',
    'portfolio.project2.description': 'حل إنترنت الأشياء لتوزيع الطاقة.',
    'portfolio.project3.title': 'محسن الخدمات اللوجستية',
    'portfolio.project3.description': 'تخطيط المسارات وإدارة الأسطول المدعومة بالذكاء الاصطناعي.',
    
    // Contact Section
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل أنت مستعد لتحويل أعمالك بالذكاء الاصطناعي؟ هيا نتحدث!',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    
    // Voice Assistant
    'voice.welcome': 'أهلاً بك! أنا راضي، مساعد بارق تك الذكي. إيه اللي أقدر أساعدك فيه اليوم؟',
    'voice.listening': 'جاري الاستماع...',
    'voice.speaking': 'راضي بيرد...',
    'voice.tapToTalk': 'اضغط لتكلم مع راضي',
    
    // Footer
    'footer.copyright': '© 2024 بارق تك. جميع الحقوق محفوظة.',
    
    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}