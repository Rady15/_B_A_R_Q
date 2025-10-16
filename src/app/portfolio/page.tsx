'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import VoiceAssistant from '@/components/VoiceAssistant'

export default function PortfolioPage() {
  const { t, dir } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Circuit Background Animation
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let circuitNodes: any[] = []
    const nodeCount = 45
    const connectionDistance = 130

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
        this.vx = (Math.random() - 0.5) * 0.25
        this.vy = (Math.random() - 0.5) * 0.25
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
        ctx.fillStyle = 'rgba(0, 123, 255, 0.5)'
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
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.25})`
            ctx.lineWidth = 0.4
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

  const categories = [
    { id: 'all', name: dir === 'rtl' ? 'الكل' : 'All' },
    { id: 'ai', name: dir === 'rtl' ? 'ذكاء اصطناعي' : 'AI' },
    { id: 'cloud', name: dir === 'rtl' ? 'سحابة' : 'Cloud' },
    { id: 'automation', name: dir === 'rtl' ? 'أتمتة' : 'Automation' },
    { id: 'consulting', name: dir === 'rtl' ? 'استشارات' : 'Consulting' }
  ]

  const projects = [
    {
      id: 1,
      title: t('portfolio.project1.title'),
      description: t('portfolio.project1.description'),
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['ذكاء اصطناعي', 'تحليل', 'تمويل'] : ['AI', 'Analytics', 'Finance'],
      link: '#'
    },
    {
      id: 2,
      title: t('portfolio.project2.title'),
      description: t('portfolio.project2.description'),
      category: 'iot',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['إنترنت الأشياء', 'طاقة', 'ذكي'] : ['IoT', 'Energy', 'Smart'],
      link: '#'
    },
    {
      id: 3,
      title: t('portfolio.project3.title'),
      description: t('portfolio.project3.description'),
      category: 'automation',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['أتمتة', 'لوجستيات', 'ذكاء اصطناعي'] : ['Automation', 'Logistics', 'AI'],
      link: '#'
    },
    {
      id: 4,
      title: dir === 'rtl' ? 'منصة التعلم الذكي' : 'Smart Learning Platform',
      description: dir === 'rtl' ? 'نظام تعليمي متكامل بالذكاء الاصطناعي' : 'Integrated AI educational system',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['تعليم', 'ذكاء اصطناعي', 'منصة'] : ['Education', 'AI', 'Platform'],
      link: '#'
    },
    {
      id: 5,
      title: dir === 'rtl' ? 'الحلول السحابية للمؤسسات' : 'Enterprise Cloud Solutions',
      description: dir === 'rtl' ? 'بنية تحتية سحابية متطورة للشركات' : 'Advanced cloud infrastructure for companies',
      category: 'cloud',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['سحابة', 'مؤسسات', 'بنية تحتية'] : ['Cloud', 'Enterprise', 'Infrastructure'],
      link: '#'
    },
    {
      id: 6,
      title: dir === 'rtl' ? 'نظام إدارة المستشفيات' : 'Hospital Management System',
      description: dir === 'rtl' ? 'حلول ذكية لإدارة المرافق الصحية' : 'Smart solutions for healthcare facilities management',
      category: 'consulting',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      tags: dir === 'rtl' ? ['رعاية صحية', 'إدارة', 'استشارات'] : ['Healthcare', 'Management', 'Consulting'],
      link: '#'
    }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Circuit Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-35"
      />

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {t('portfolio.title')}
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-primary-foreground'
                    : 'bg-card border border-border hover:border-blue-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={project.link}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {dir === 'rtl' ? 'عرض المشروع' : 'View Project'}
                    <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl border border-border bg-card">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'مشروع مكتمل' : 'Completed Projects'}
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl border border-border bg-card">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">30+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'عميل سعيد' : 'Happy Clients'}
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl border border-border bg-card">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">15+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'جائزة' : 'Awards'}
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl border border-border bg-card">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                {dir === 'rtl' ? 'سنوات خبرة' : 'Years Experience'}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-border">
            <h2 className="text-3xl font-bold mb-4">
              {dir === 'rtl' ? 'هل لديك مشروع في ذهنك؟' : 'Have a Project in Mind?'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {dir === 'rtl' ? 
                'دعنا نحول فكرتك إلى واقع باستخدام أحدث التقنيات والذكاء الاصطناعي' :
                'Let\'s turn your idea into reality using the latest technologies and AI'
              }
            </p>
            <a 
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold rounded-full transition-all transform hover:scale-105"
            >
              {dir === 'rtl' ? 'ابدأ مشروعك' : 'Start Your Project'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}