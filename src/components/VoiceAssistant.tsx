'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function VoiceAssistant() {
  const { t, language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ttsBusyRef = useRef(false)
  const lastTtsAtRef = useRef(0)
  const TTS_COOLDOWN_MS = 1000

  // Pause/Resume state and idle detection
  const [isPaused, setIsPaused] = useState(false)
  const lastActivityRef = useRef<number>(Date.now())
  const IDLE_TIMEOUT_MS = 20000 // 20s idle auto-stop
  const firstTurnRef = useRef(true)
  const cleanIntro = (text: string, isFirst: boolean) => {
    if (isFirst) return text
    let cleaned = text || ''
    const patterns = [
      /^\s*(مرحب|أهلًا|اهلاً|السلام\s+عليكم|أنا|اسمي|مساعد)/i,
      /^\s*(hello|hi|hey|greetings|i am|i'm|my name|assistant)/i
    ]
    for (const p of patterns) {
      if (p.test(cleaned)) {
        const cuts = [cleaned.indexOf('\n'), cleaned.indexOf('.'), cleaned.indexOf('!'), cleaned.indexOf('?'), cleaned.indexOf('؟')]
        const idx = cuts.filter(i => i >= 0).sort((a,b)=>a-b)[0]
        cleaned = idx !== undefined ? cleaned.slice(idx + 1).trim() : cleaned
        break
      }
    }
    return cleaned
  }

  const markActivity = () => {
    lastActivityRef.current = Date.now()
  }

  const resumeListeningIfAllowed = () => {
    if (recognitionRef.current && !isPaused) {
      recognitionRef.current.start()
    }
  }

  // Auto stop listening on idle
  useEffect(() => {
    const timer = setInterval(() => {
      if (isListening && !isSpeaking) {
        const idleFor = Date.now() - lastActivityRef.current
        if (idleFor > IDLE_TIMEOUT_MS && recognitionRef.current) {
          recognitionRef.current.stop()
          setIsListening(false)
        }
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [isListening, isSpeaking, isPaused])

  useEffect(() => {
    // Voice Recognition Setup
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language === 'ar' ? 'ar-EG' : 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const idx = event.resultIndex
        const res = event.results[idx]
        if (res && res.isFinal) {
          const finalTranscript = res[0].transcript
          const trimmed = (finalTranscript || '').trim()
          setTranscript(finalTranscript)
          if (trimmed.length === 0) {
            return
          }
          markActivity()
          // barge-in: أوقف أي صوت جارٍ
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          handleAIResponse(trimmed)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      // عند بدء الاستماع، أوقف أي صوت جارٍ (barge-in)
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        markActivity()
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [language])

  const startListening = () => {
    if (isPaused) return
    if (recognitionRef.current) {
      // barge-in: أوقف أي صوت قبل البدء
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsListening(true)
      markActivity()
      recognitionRef.current.start()
    }
  }

  const handleAIResponse = async (userInput: string) => {
    const message = (userInput || '').trim()
    if (!message) {
      return
    }
    const isFirst = firstTurnRef.current
    firstTurnRef.current = false
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, language, isFirst }),
      })

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = ''
        if (response.status === 429) {
          errorMessage = language === 'ar' 
            ? 'عذراً، لقد تجاوزنا الحد المسموح لاستخدام الخدمة حالياً. يرجى المحاولة مرة أخرى لاحقاً.'
            : 'Sorry, we\'ve exceeded our current usage limit. Please try again later.'
        } else {
          errorMessage = language === 'ar' 
            ? 'عذراً، حدث خطأ في الاتصال مع الخادم. يرجى المحاولة مرة أخرى.'
            : 'Sorry, there was an error connecting to the server. Please try again.'
        }
        
        speakResponse(errorMessage)
        return
      }

      // Try to parse JSON, handle parsing errors
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        const errorMessage = language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة الاستجابة. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing the response. Please try again.'
        speakResponse(errorMessage)
        return
      }

      const responseText = data.response || data.error || (language === 'ar' 
        ? 'عذراً، لم أتلقَ استجابة. يرجى المحاولة مرة أخرى.'
        : 'Sorry, I didn\'t receive a response. Please try again.'
      )
      const finalText = cleanIntro(responseText, isFirst)
      speakResponse(finalText)
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage = language === 'ar' 
        ? 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
        : 'Sorry, an unexpected error occurred. Please try again.'
      speakResponse(errorMessage)
    }
  }

  const speakResponse = async (text: string) => {
    // امنع الاستدعاء المتكرر أثناء النطق
    if (isPaused) return
    if (ttsBusyRef.current) return
    const now = Date.now()
    // تبريد بين الطلبات لتفادي 429
    if (now - lastTtsAtRef.current < TTS_COOLDOWN_MS) {
      // استخدم الصوت المحلي أثناء التبريد
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = language === 'ar' ? 'ar-EG' : 'en-US'
        setIsSpeaking(true)
        utter.onstart = () => {
          setAiResponse(text)
        }
        utter.onend = () => {
          setIsSpeaking(false)
          lastTtsAtRef.current = Date.now()
          resumeListeningIfAllowed()
        }
        synth.cancel()
        synth.speak(utter)
      }
      return
    }
    ttsBusyRef.current = true
    try {
      // أوقف الاستماع أثناء تشغيل الصوت لتجنب التداخل
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsSpeaking(true)

      // تأخير بسيط قبل الإرسال لتقليل الضغط على المزود
      await new Promise(r => setTimeout(r, 500))
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
          // يمكن تخصيص الصوت إن أردت:
          // voiceName: language === 'ar' ? 'ar-XA-Wavenet-A' : 'en-US-Wavenet-D',
          speakingRate: 0.95,
          pitch: 0.0,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('TTS API Error:', errText)

        // Fallback: عند انتهاء الحصة (429) استخدم Web Speech API محلياً
        if (res.status === 429 && 'speechSynthesis' in window) {
          const synth = window.speechSynthesis
          const utter = new SpeechSynthesisUtterance(text)
          utter.lang = language === 'ar' ? 'ar-EG' : 'en-US'
          setIsSpeaking(true)
          utter.onend = () => {
            setIsSpeaking(false)
            lastTtsAtRef.current = Date.now()
            ttsBusyRef.current = false
            resumeListeningIfAllowed()
          }
          synth.cancel()
          synth.speak(utter)
          return
        }

        setIsSpeaking(false)
        lastTtsAtRef.current = Date.now()
        ttsBusyRef.current = false
        resumeListeningIfAllowed()
        return
      }

      const data = await res.json()
      const { audioContent, contentType } = data
      if (!audioContent) {
        setIsSpeaking(false)
        resumeListeningIfAllowed()
        return
      }

      const audioBytes = atob(audioContent)
      const len = audioBytes.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) bytes[i] = audioBytes.charCodeAt(i)

      const blob = new Blob([bytes], { type: contentType || 'audio/mpeg' })
      const url = URL.createObjectURL(blob)

      // barge-in: أوقف أي صوت سابق
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onplay = () => {
        setAiResponse(text)
      }

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
        lastTtsAtRef.current = Date.now()
        ttsBusyRef.current = false
        markActivity()
        // استئناف الاستماع بعد انتهاء الصوت
        resumeListeningIfAllowed()
      }

      audio.play().catch(err => {
        console.error('Audio play error:', err)
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
        lastTtsAtRef.current = Date.now()
        ttsBusyRef.current = false
        resumeListeningIfAllowed()
      })
    } catch (e) {
      console.error('speakResponse error:', e)
      setIsSpeaking(false)
      lastTtsAtRef.current = Date.now()
      ttsBusyRef.current = false
      resumeListeningIfAllowed()
    }
  }

  const welcomeMessage = () => {
    const welcome = t('voice.welcomeMessage')
    // barge-in: أوقف الصوت قبل تشغيل رسالة الترحيب
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (!isPaused) speakResponse(welcome)
    firstTurnRef.current = false
  }

  return (
    <>
      {/* Voice Assistant UI */}
      <div className="fixed top-20 right-4 z-40 bg-card/80 backdrop-blur-lg rounded-2xl p-4 border border-border shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={welcomeMessage}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold rounded-lg transition-all transform hover:scale-105 text-sm"
          >
            🎤 {language === 'ar' ? 'ترحيب' : 'Welcome'}
          </button>
          <button
            onClick={() => {
              setIsPaused(prev => {
                const next = !prev
                if (next) {
                  // Pausing: stop recognition and any audio/tts
                  if (recognitionRef.current) recognitionRef.current.stop()
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                  }
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel()
                  }
                  setIsListening(false)
                  setIsSpeaking(false)
                  ttsBusyRef.current = false
                } else {
                  // Resuming: mark activity so idle timer doesn't instantly stop
                  markActivity()
                }
                return next
              })
            }}
            className={`px-3 py-2 ${isPaused ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-600 hover:bg-gray-500'} text-primary-foreground font-semibold rounded-lg transition-all transform hover:scale-105 text-sm`}
          >
            {isPaused ? (language === 'ar' ? '▶️ استئناف' : '▶️ Resume') : (language === 'ar' ? '⏸️ إيقاف' : '⏸️ Pause')}
          </button>
          <button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : isSpeaking 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            {isListening ? '🔴' : isSpeaking ? '🔊' : '🎤'}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            {isListening ? t('voice.listening') : isSpeaking ? t('voice.speaking') : t('voice.clickToTalk')}
          </p>
        </div>
      </div>

      {/* Chat Display */}
      {(transcript || aiResponse) && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="bg-card/90 backdrop-blur-lg rounded-2xl p-4 border border-border shadow-lg">
            {transcript && (
              <div className="mb-3">
                <p className="text-blue-400 text-sm font-semibold">
                  {t('voice.you') + ':'}
                </p>
                <p className="text-foreground">{transcript}</p>
              </div>
            )}
            {aiResponse && (
              <div>
                <p className="text-blue-400 text-sm font-semibold">
                  {t('voice.assistant') + ':'}
                </p>
                <p className="text-foreground">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}