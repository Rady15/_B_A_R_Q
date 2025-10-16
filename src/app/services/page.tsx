'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import VoiceAssistant from '@/components/VoiceAssistant'

export default function ServicesPage() {
  const { t, dir } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Circuit Background Animation
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let circuitNodes: any[] = []
    const nodeCount = 50
    const connectionDistance = 120

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.2
        this.vy = (Math.random() - 0.5) * 0.2
        this.radius = Math.random() * 1.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 123, 255, 0.4)'
        ctx.fill()
      }
    }

    function initNodes() {
      circuitNodes = []
      for (let i = 0; i < nodeCount; i++) {
        circuitNodes.push(new Node())
      }
    }
    initNodes()

    function animateCircuits() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      circuitNodes.forEach(node => {
        node.update()
        node.draw()
      })

      // Draw connections
      for (let i = 0; i < circuitNodes.length; i++) {
        for (let j = i + 1; j < circuitNodes.length; j++) {
          const dx = circuitNodes[i].x - circuitNodes[j].x
          const dy = circuitNodes[i].y - circuitNodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(circuitNodes[i].x, circuitNodes[i].y)
            ctx.lineTo(circuitNodes[j].x, circuitNodes[j].y)
            const opacity = 1 - (distance / connectionDistance)
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(animateCircuits)
    }
    animateCircuits()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const services = [
    {
      icon: '🤖',
      title: t('services.ai.title'),
      description: t('services.ai.description'),
      features: dir === 'rtl' ? 
        ['نماذج ذكاء اصطناعي مخصصة', 'أتمتة العمليات', 'تحليل البيانات الذكي', 'التعلم الآلي'] :
        ['Custom AI models', 'Process automation', 'Smart data analysis', 'Machine learning']
    },
    {
      icon: '☁️',
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
      features: dir === 'rtl' ? 
        ['بنية تحتية سحابية', 'تخزين آمن', 'قابلية التوسع', 'النسخ الاحتياطي'] :
        ['Cloud infrastructure', 'Secure storage', 'Scalability', 'Backup solutions']
    },
    {
      icon: '💡',
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      features: dir === 'rtl' ? 
        ['استشارات تقنية', 'تخطيط استراتيجي', 'تحسين الأداء', 'دعم فني'] :
        ['Technical consulting', 'Strategic planning', 'Performance optimization', 'Technical support']
    }
  ]

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Circuit Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-30"
      />

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {t('services.title')}
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl border border-border bg-card hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              {dir === 'rtl' ? 'كيف نعمل' : 'How We Work'}
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '1', title: dir === 'rtl' ? 'الاستشارة' : 'Consultation', desc: dir === 'rtl' ? 'نفهم احتياجاتك' : 'We understand your needs' },
                { step: '2', title: dir === 'rtl' ? 'التخطيط' : 'Planning', desc: dir === 'rtl' ? 'نضع الخطة المناسبة' : 'We create the right plan' },
                { step: '3', title: dir === 'rtl' ? 'التنفيذ' : 'Implementation', desc: dir === 'rtl' ? 'ننفذ الحلول' : 'We implement solutions' },
                { step: '4', title: dir === 'rtl' ? 'الدعم' : 'Support', desc: dir === 'rtl' ? 'ندعمك مستمراً' : 'We support you continuously' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-border">
            <h2 className="text-3xl font-bold mb-4">
              {dir === 'rtl' ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {dir === 'rtl' ? 
                'تواصل معنا اليوم لتحويل أعمالك إلى المستقبل باستخدام حلول الذكاء الاصطناعي المتقدمة' :
                'Contact us today to transform your business into the future using advanced AI solutions'
              }
            </p>
            <a 
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold rounded-full transition-all transform hover:scale-105"
            >
              {dir === 'rtl' ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}