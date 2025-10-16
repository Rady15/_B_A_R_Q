'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import VoiceAssistant from '@/components/VoiceAssistant'

export default function Home() {
  const { t, dir, language } = useLanguage()
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<Array<{left: number, duration: number, delay: number}>>([])

  // Generate particle data once on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 15
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    // Circuit Background Animation
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let circuitNodes: any[] = []
    const nodeCount = 80
    const connectionDistance = 150

    function resizeCanvas() {
      const canvasElement = canvasRef.current
      if (!canvasElement) return
      canvasElement.width = window.innerWidth
      canvasElement.height = window.innerHeight
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
        const canvasElement = canvasRef.current
        if (!canvasElement) {
          this.x = 0
          this.y = 0
          this.vx = 0
          this.vy = 0
          this.radius = 1
          return
        }
        this.x = Math.random() * canvasElement.width
        this.y = Math.random() * canvasElement.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1
      }

      update() {
        const canvasElement = canvasRef.current
        if (!canvasElement) return
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvasElement.width) this.vx = -this.vx
        if (this.y < 0 || this.y > canvasElement.height) this.vy = -this.vy
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'dark' ? 'rgba(0, 123, 255, 0.8)' : 'rgba(0, 123, 255, 0.6)'
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
      const canvasElement = canvasRef.current
      if (!ctx || !canvasElement) return
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)

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
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(0, 255, 255, ${opacity * 0.5})`
              : `rgba(0, 255, 255, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(animateCircuits)
    }
    animateCircuits()

    // Scroll animations
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach(el => {
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Circuit Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Floating Particles */}
      <div className="fixed w-full h-full top-0 left-0 pointer-events-none z-10">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_2px_rgba(0,123,255,0.8)] opacity-0"
            style={{
              left: `${particle.left}%`,
              animation: `float-up ${particle.duration}s infinite ${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Main Content */}
      <main className="relative z-20">
        {/* Hero Section */}
        <header className="hero flex flex-col justify-center items-center text-center min-h-screen px-5 py-10 relative overflow-hidden">
          <div className="hero-bg-effect absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(0,123,255,0.1)_0%,rgba(0,0,0,0)_70%)] animate-spin-slow z-[-1]" />
          
          <div className="logo text-[6rem] font-black text-blue-500 drop-shadow-[0_0_20px_rgba(0,123,255,1)] mb-5 tracking-[-2px] animate-on-scroll" data-speed="0.5">
            BARQ
          </div>
          
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent animate-on-scroll">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl font-light text-muted-foreground mb-10 max-w-[600px] animate-on-scroll">
            {t('hero.subtitle')}
          </p>
          
          <a href="#services" className="cta-button inline-block px-10 py-5 text-lg font-semibold text-black bg-yellow-400 rounded-full transition-all hover:transform hover:translate-y-[-3px] hover:shadow-[0_5px_25px_rgba(255,211,0,0.7)] animate-on-scroll">
            {t('hero.cta')}
          </a>
        </header>

        {/* About Section */}
        <section id="about" className="py-20 px-5 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-on-scroll">
          <div className={`about-visual relative h-[400px] flex justify-center items-center ${dir === 'rtl' ? 'order-2' : 'order-1'}`}>
            <div className="hologram-brain w-[250px] h-[250px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-spin-slow shadow-[0_0_60px_rgba(0,123,255,1)]" />
          </div>
          
          <div className={`about-text ${dir === 'rtl' ? 'order-1' : 'order-2'}`}>
            <h2 className="text-4xl font-bold mb-5 text-foreground">{t('about.title')}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('about.description')}
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-5 max-w-6xl mx-auto text-center animate-on-scroll">
          <h2 className="text-4xl font-bold mb-12">{t('services.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="service-card bg-card p-10 rounded-2xl border border-border transition-all hover:transform hover:translate-y-[-10px] hover:shadow-[0_10px_30px_rgba(0,123,255,0.3)] cursor-pointer animate-on-scroll">
              <div className="icon text-5xl mb-5">🤖</div>
              <h3 className="text-2xl mb-4 text-foreground">{t('services.ai.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('services.ai.description')}
              </p>
            </div>
            
            <div className="service-card bg-card p-10 rounded-2xl border border-border transition-all hover:transform hover:translate-y-[-10px] hover:shadow-[0_10px_30px_rgba(0,123,255,0.3)] cursor-pointer animate-on-scroll">
              <div className="icon text-5xl mb-5">⚡</div>
              <h3 className="text-2xl mb-4 text-foreground">{t('services.automation.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('services.automation.description')}
              </p>
            </div>
            
            <div className="service-card bg-card p-10 rounded-2xl border border-border transition-all hover:transform hover:translate-y-[-10px] hover:shadow-[0_10px_30px_rgba(0,123,255,0.3)] cursor-pointer animate-on-scroll">
              <div className="icon text-5xl mb-5">☁️</div>
              <h3 className="text-2xl mb-4 text-foreground">{t('services.cloud.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('services.cloud.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 px-5 max-w-6xl mx-auto animate-on-scroll">
          <h2 className="text-4xl font-bold mb-12 text-center">{t('portfolio.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="showcase-item relative overflow-hidden rounded-2xl h-64 bg-card border border-border transition-transform hover:transform hover:scale-105 animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt={t('portfolio.project1.title')} 
                className="w-full h-full object-cover transition-transform hover:transform hover:scale-110"
              />
              <div className="overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 transform translate-y-full transition-transform hover:translate-y-0">
                <h4 className="text-xl font-bold text-white mb-2">{t('portfolio.project1.title')}</h4>
                <p className="text-gray-300">{t('portfolio.project1.description')}</p>
              </div>
            </div>
            
            <div className="showcase-item relative overflow-hidden rounded-2xl h-64 bg-card border border-border transition-transform hover:transform hover:scale-105 animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt={t('portfolio.project2.title')} 
                className="w-full h-full object-cover transition-transform hover:transform hover:scale-110"
              />
              <div className="overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 transform translate-y-full transition-transform hover:translate-y-0">
                <h4 className="text-xl font-bold text-white mb-2">{t('portfolio.project2.title')}</h4>
                <p className="text-gray-300">{t('portfolio.project2.description')}</p>
              </div>
            </div>
            
            <div className="showcase-item relative overflow-hidden rounded-2xl h-64 bg-card border border-border transition-transform hover:transform hover:scale-105 animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt={t('portfolio.project3.title')} 
                className="w-full h-full object-cover transition-transform hover:transform hover:scale-110"
              />
              <div className="overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 transform translate-y-full transition-transform hover:translate-y-0">
                <h4 className="text-xl font-bold text-white mb-2">{t('portfolio.project3.title')}</h4>
                <p className="text-gray-300">{t('portfolio.project3.description')}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/portfolio"
              className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold rounded-full transition-all transform hover:scale-105"
            >
              {dir === 'rtl' ? 'عرض جميع المشاريع' : 'View All Projects'}
            </a>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(100vh) scale(0);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(1.5);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  )
}