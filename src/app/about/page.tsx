'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import VoiceAssistant from '@/components/VoiceAssistant'

export default function AboutPage() {
  const { t, dir } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Circuit Background Animation
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let circuitNodes: any[] = []
    const nodeCount = 60
    const connectionDistance = 150

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
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.radius = Math.random() * 2 + 1
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
        ctx.fillStyle = 'rgba(0, 123, 255, 0.6)'
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
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
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

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Circuit Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-40"
      />

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* About Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className={`order-2 ${dir === 'rtl' ? 'md:order-1' : 'md:order-1'}`}>
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-64 h-64 mx-auto bg-gradient-to-tr from-transparent to-blue-500/20 rounded-full animate-spin-slow"></div>
              </div>
            </div>
            
            <div className={`order-1 ${dir === 'rtl' ? 'md:order-2 md:pr-8' : 'md:order-2 md:pl-8'}`}>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {t('about.description')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    {dir === 'rtl' ? 'نحن نبتكر حلولاً تقنية متطورة تلبي احتياجات العصر الرقمي' : 'We innovate advanced technological solutions that meet the needs of the digital age'}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    {dir === 'rtl' ? 'نستخدم الذكاء الاصطناعي لتحسين وتطوير الأعمال' : 'We use artificial intelligence to improve and develop businesses'}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    {dir === 'rtl' ? 'نحن شريكك الموثوق في رحلة التحول الرقمي' : 'We are your trusted partner in the digital transformation journey'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'عميل سعيد' : 'Happy Clients'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'مشروع مكتمل' : 'Projects Done'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'خبير تقني' : 'Tech Experts'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'دعم فني' : 'Support'}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-12">
              {dir === 'rtl' ? 'قيمنا' : 'Our Values'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">
                  {dir === 'rtl' ? 'الابتكار' : 'Innovation'}
                </h3>
                <p className="text-muted-foreground">
                  {dir === 'rtl' ? 'نحن نسعى دائماً للابتكار والتطوير' : 'We always strive for innovation and development'}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">
                  {dir === 'rtl' ? 'الجودة' : 'Quality'}
                </h3>
                <p className="text-muted-foreground">
                  {dir === 'rtl' ? 'نلتزم بأعلى معايير الجودة في كل ما نفعله' : 'We are committed to the highest quality standards in everything we do'}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">
                  {dir === 'rtl' ? 'الشراكة' : 'Partnership'}
                </h3>
                <p className="text-muted-foreground">
                  {dir === 'rtl' ? 'نبني علاقات طويلة الأمد مع عملائنا' : 'We build long-term relationships with our clients'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}