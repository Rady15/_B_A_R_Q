export interface Translations {
  // Navigation
  nav: {
    home: string
    about: string
    services: string
    portfolio: string
    blog: string
    team: string
    contact: string
  }
  
  // Hero Section
  hero: {
    title: string
    subtitle: string
    description: string
    cta: string
  }
  
  // About Section
  about: {
    title: string
    description: string
  }
  
  // Services Section
  services: {
    title: string
    ai: {
      title: string
      description: string
    }
    cloud: {
      title: string
      description: string
    }
    consulting: {
      title: string
      description: string
    }
  }
  
  // Portfolio Section
  portfolio: {
    title: string
    project1: {
      title: string
      description: string
    }
    project2: {
      title: string
      description: string
    }
    project3: {
      title: string
      description: string
    }
  }
  
  // Contact Section
  contact: {
    title: string
    name: string
    email: string
    message: string
    send: string
    success: string
    error: string
  }
  
  // Footer
  footer: {
    copyright: string
    allRightsReserved: string
  }
  
  // Voice Assistant
  voice: {
    welcome: string
    listening: string
    speaking: string
    clickToTalk: string
    welcomeMessage: string
    you: string
    assistant: string
  }
  
  // Common
  common: {
    loading: string
    error: string
    retry: string
    close: string
    menu: string
    language: string
    theme: string
  }
}

export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      blog: 'Blog',
      team: 'Team',
      contact: 'Contact'
    },
    hero: {
      title: 'Smart. Fast. Limitless.',
      subtitle: 'BARQ',
      description: 'AI-driven automation & technology solutions for the modern world.',
      cta: 'Discover Our Solutions ⚡'
    },
    about: {
      title: 'About Barq Tech',
      description: 'We are pioneers in the digital frontier, fusing the power of artificial intelligence with cutting-edge technology. Our mission is to electrify industries, automate the complex, and build intelligent systems that propel your business into the future. We don\'t just follow trends; we create the currents of tomorrow.'
    },
    services: {
      title: 'Our Core Services',
      ai: {
        title: 'AI Automation',
        description: 'Streamline your workflows with intelligent automation. We build custom AI models that learn, adapt, and optimize your processes for maximum efficiency.'
      },
      cloud: {
        title: 'Cloud & Data Systems',
        description: 'Harness the power of the cloud. We design scalable, secure, and robust data architectures that turn your information into a strategic asset.'
      },
      consulting: {
        title: 'Tech Consulting',
        description: 'Navigate the complex tech landscape with confidence. Our experts provide strategic guidance to help you make the right technology investments.'
      }
    },
    portfolio: {
      title: 'Project Showcase',
      project1: {
        title: 'Neural Finance AI',
        description: 'Predictive analytics for stock markets.'
      },
      project2: {
        title: 'Smart Grid Manager',
        description: 'IoT solution for energy distribution.'
      },
      project3: {
        title: 'Logistics Optimizer',
        description: 'AI-driven route planning and fleet management.'
      }
    },
    contact: {
      title: 'Get In Touch',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    },
    footer: {
      copyright: '© 2024 Barq Tech.',
      allRightsReserved: 'All Rights Reserved.'
    },
    voice: {
      welcome: 'Welcome',
      listening: 'Listening...',
      speaking: 'Speaking...',
      clickToTalk: 'Click to Talk',
      welcomeMessage: 'Welcome to Barq Tech! I am your intelligent assistant, how can I help you today?',
      you: 'You',
      assistant: 'AI Assistant'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
      menu: 'Menu',
      language: 'Language',
      theme: 'Theme'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      portfolio: 'معرض الأعمال',
      blog: 'المدونة',
      team: 'فريقنا',
      contact: 'اتصل بنا'
    },
    hero: {
      title: 'ذكية. سريعة. بلا حدود.',
      subtitle: 'بارق',
      description: 'حلول الأتمتة والتكنولوجيا المدعومة بالذكاء الاصطناعي للعالم الحديث.',
      cta: 'اكتشف حلولنا ⚡'
    },
    about: {
      title: 'حول بارق تك',
      description: 'نحن رواد في الحدود الرقمية، نجمع قوة الذكاء الاصطناعي مع أحدث التقنيات. مهمتنا هي كهربة الصناعات، أتمتة المعقد، وبناء أنظمة ذكية تدفع أعمالك نحو المستقبل. نحن لا نتبع الاتجاهات فقط؛ بل نخلق تيارات الغد.'
    },
    services: {
      title: 'خدماتنا الأساسية',
      ai: {
        title: 'أتمتة الذكاء الاصطناعي',
        description: 'بسط سير العمل الخاص بك مع الأتمتة الذكية. نبني نماذج ذكاء اصطناعي مخصصة تتعلم وتتكيف وتحسن عملياتك لتحقيق أقصى كفاءة.'
      },
      cloud: {
        title: 'السحابة وأنظمة البيانات',
        description: 'استغل قوة السحابة. نصمم بنى تحتية للبيانات قابلة للتطوير وآمنة وقوية تحول معلوماتك إلى أصل استراتيجي.'
      },
      consulting: {
        title: 'الاستشارات التقنية',
        description: 'تنقل في المشهد التقني المعقد بثقة. يقدم خبراؤنا إرشاداً استراتيجياً لمساعدتك في اتخاذ استثمارات التكنولوجيا الصحيحة.'
      }
    },
    portfolio: {
      title: 'معرض المشاريع',
      project1: {
        title: 'التمويل العصبي بالذكاء الاصطناعي',
        description: 'التحليلات التنبؤية لأسواق الأسهم.'
      },
      project2: {
        title: 'مدير الشبكة الذكية',
        description: 'حل إنترنت الأشياء لتوزيع الطاقة.'
      },
      project3: {
        title: 'محسن الخدمات اللوجستية',
        description: 'تخطيط المسارات وإدارة الأسطول المدعومة بالذكاء الاصطناعي.'
      }
    },
    contact: {
      title: 'تواصل معنا',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      send: 'إرسال الرسالة',
      success: 'تم إرسال الرسالة بنجاح!',
      error: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
    },
    footer: {
      copyright: '© 2024 بارق تك.',
      allRightsReserved: 'جميع الحقوق محفوظة.'
    },
    voice: {
      welcome: 'ترحيب',
      listening: 'جاري الاستماع...',
      speaking: 'جاري الرد...',
      clickToTalk: 'اضغط للتحدث',
      welcomeMessage: 'أهلاً بك في بارق تك! أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟',
      you: 'أنت',
      assistant: 'المساعد الذكي'
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      retry: 'إعادة المحاولة',
      close: 'إغلاق',
      menu: 'القائمة',
      language: 'اللغة',
      theme: 'المظهر'
    }
  }
}