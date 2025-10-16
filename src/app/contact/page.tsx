'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import VoiceAssistant from '@/components/VoiceAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Circuit Background Animation
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let circuitNodes: any[] = []
    const nodeCount = 40
    const connectionDistance = 100

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
        this.vx = (Math.random() - 0.5) * 0.15
        this.vy = (Math.random() - 0.5) * 0.15
        this.radius = Math.random() * 1 + 0.5
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
        ctx.fillStyle = 'rgba(0, 123, 255, 0.3)'
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
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.15})`
            ctx.lineWidth = 0.2
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: dir === 'rtl' ? 'نجح!' : 'Success!',
          description: dir === 'rtl' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully',
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast({
        title: dir === 'rtl' ? 'خطأ' : 'Error',
        description: dir === 'rtl' ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى' : 'Failed to send message. Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📧',
      title: dir === 'rtl' ? 'البريد الإلكتروني' : 'Email',
      content: 'info@barqtech.com'
    },
    {
      icon: '📱',
      title: dir === 'rtl' ? 'الهاتف' : 'Phone',
      content: '+966 50 123 4567'
    },
    {
      icon: '📍',
      title: dir === 'rtl' ? 'الموقع' : 'Location',
      content: dir === 'rtl' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'
    }
  ]

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Circuit Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-20"
      />

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('contact.name')}
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-blue-500 focus:outline-none"
                    placeholder={dir === 'rtl' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact.email')}
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-blue-500 focus:outline-none"
                    placeholder={dir === 'rtl' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact.message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-blue-500 focus:outline-none resize-none"
                    placeholder={dir === 'rtl' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (dir === 'rtl' ? 'جاري الإرسال...' : 'Sending...')
                    : t('contact.send')
                  }
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {dir === 'rtl' ? 'معلومات التواصل' : 'Contact Information'}
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <h4 className="font-semibold mb-1">{info.title}</h4>
                        <p className="text-muted-foreground">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">
                  {dir === 'rtl' ? 'ساعات العمل' : 'Business Hours'}
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{dir === 'rtl' ? 'السبت - الخميس' : 'Saturday - Thursday'}</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{dir === 'rtl' ? 'الجمعة' : 'Friday'}</span>
                    <span>{dir === 'rtl' ? 'مغلق' : 'Closed'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">
                  {dir === 'rtl' ? 'تابعنا' : 'Follow Us'}
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center transition-colors">
                    📧
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center transition-colors">
                    💼
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center transition-colors">
                    🐦
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}