'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface VoiceHistory {
  id: string
  timestamp: Date
  transcript: string
  response: string
  language: string
}

export default function VoiceAssistant() {
  const { t, language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [volume, setVolume] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [voiceHistory, setVoiceHistory] = useState<VoiceHistory[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected')

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ttsBusyRef = useRef(false)
  const lastTtsAtRef = useRef(0)
  const volumeIntervalRef = useRef<NodeJS.Timeout>()
  const TTS_COOLDOWN_MS = 1000

  const [isPaused, setIsPaused] = useState(false)
  const lastActivityRef = useRef<number>(Date.now())
  const IDLE_TIMEOUT_MS = 20000
  const firstTurnRef = useRef(true)

  // تحليل شدة الصوت
  const startVolumeAnalysis = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
    }

    volumeIntervalRef.current = setInterval(() => {
      if (isListening) {
        const newVolume = Math.floor(Math.random() * 80) + 20
        setVolume(newVolume)
      } else {
        setVolume(0)
      }
    }, 100)
  }

  const stopVolumeAnalysis = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
      setVolume(0)
    }
  }

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

  const addToHistory = (transcript: string, response: string) => {
    const newEntry: VoiceHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      transcript,
      response,
      language
    }
    setVoiceHistory(prev => [newEntry, ...prev.slice(0, 49)])
  }

  const resumeListeningIfAllowed = () => {
    if (recognitionRef.current && !isPaused && !isSpeaking) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.log('Resume listening error:', error)
      }
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
    if (isListening) {
      startVolumeAnalysis()
    } else {
      stopVolumeAnalysis()
    }
    return () => {
      stopVolumeAnalysis()
    }
  }, [isListening])

  useEffect(() => {
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
          setShowWelcome(false)
          if (trimmed.length === 0) return
          markActivity()
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
        setConnectionStatus('error')
      }

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setConnectionStatus('connected')
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
      setConnectionStatus('connecting')
      setShowWelcome(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsListening(true)
      markActivity()
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.log('Start listening error:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleAIResponse = async (userInput: string) => {
    const message = (userInput || '').trim()
    if (!message) return
    const isFirst = firstTurnRef.current
    firstTurnRef.current = false
    setConnectionStatus('connecting')
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, language, isFirst }),
      })

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
        
        speakResponse(errorMessage, message)
        return
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        const errorMessage = language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة الاستجابة. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing the response. Please try again.'
        speakResponse(errorMessage, message)
        return
      }

      const responseText = data.response || data.error || (language === 'ar' 
        ? 'عذراً، لم أتلقَ استجابة. يرجى المحاولة مرة أخرى.'
        : 'Sorry, I didn\'t receive a response. Please try again.'
      )
      const finalText = cleanIntro(responseText, isFirst)
      speakResponse(finalText, message)
    } catch (error) {
      console.error('AI response error:', error)
      setConnectionStatus('error')
      const errorMessage = language === 'ar' 
        ? 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
        : 'Sorry, an unexpected error occurred. Please try again.'
      speakResponse(errorMessage, message)
    }
  }

  const speakResponse = async (text: string, userMessage?: string) => {
    if (isPaused) return
    if (ttsBusyRef.current) return
    
    if (userMessage) {
      addToHistory(userMessage, text)
    }

    const now = Date.now()
    if (now - lastTtsAtRef.current < TTS_COOLDOWN_MS) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = language === 'ar' ? 'ar-EG' : 'en-US'
        setIsSpeaking(true)
        setConnectionStatus('connected')
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
    setConnectionStatus('connecting')
    
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsSpeaking(true)

      await new Promise(r => setTimeout(r, 500))
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
          speakingRate: 0.95,
          pitch: 0.0,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('TTS API Error:', errText)

        if (res.status === 429 && 'speechSynthesis' in window) {
          const synth = window.speechSynthesis
          const utter = new SpeechSynthesisUtterance(text)
          utter.lang = language === 'ar' ? 'ar-EG' : 'en-US'
          setIsSpeaking(true)
          setConnectionStatus('connected')
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
        setConnectionStatus('error')
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

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onplay = () => {
        setAiResponse(text)
        setConnectionStatus('connected')
      }

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
        lastTtsAtRef.current = Date.now()
        ttsBusyRef.current = false
        markActivity()
        resumeListeningIfAllowed()
      }

      audio.play().catch(err => {
        console.error('Audio play error:', err)
        setIsSpeaking(false)
        setConnectionStatus('error')
        URL.revokeObjectURL(url)
        lastTtsAtRef.current = Date.now()
        ttsBusyRef.current = false
        resumeListeningIfAllowed()
      })
    } catch (e) {
      console.error('speakResponse error:', e)
      setIsSpeaking(false)
      setConnectionStatus('error')
      lastTtsAtRef.current = Date.now()
      ttsBusyRef.current = false
      resumeListeningIfAllowed()
    }
  }

  const startConversation = () => {
    setShowWelcome(false)
    startListening()
  }

  const welcomeMessage = () => {
    const welcome = language === 'ar' ? 'مرحباً! أنا مساعدك الصوتي. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am your voice assistant. How can I help you today?'
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (!isPaused) speakResponse(welcome)
    firstTurnRef.current = false
    setShowWelcome(false)
  }

  return (
    <>
      {/* Main Voice Assistant Interface */}
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 z-40">
        <div className="w-full max-w-md mx-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {language === 'ar' ? 'المساعد الصوتي' : 'Voice Assistant'}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? 
                  (language === 'ar' ? 'متصل' : 'Connected') :
                 connectionStatus === 'connecting' ? 
                  (language === 'ar' ? 'جاري الاتصال...' : 'Connecting...') :
                  (language === 'ar' ? 'خطأ في الاتصال' : 'Connection Error')
                }
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            
            {/* Voice Visualization */}
            <div className="mb-8">
              <div className="flex items-end justify-center gap-1 h-20">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-t transition-all duration-150 ${
                      volume > i * 8 ? 'bg-gradient-to-t from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`}
                    style={{ 
                      height: `${Math.max(10, (i + 1) * 8)}%`,
                      opacity: volume > i * 8 ? 1 : 0.3
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center mb-8">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {isListening ? 
                  (language === 'ar' ? 'جاري الاستماع...' : 'Listening...') :
                 isSpeaking ? 
                  (language === 'ar' ? 'المساعد يتحدث...' : 'Assistant Speaking...') :
                  (language === 'ar' ? 'جاهز للمحادثة' : 'Ready for Conversation')
                }
              </p>
              <p className="text-sm text-gray-500">
                {isListening ? 
                  (language === 'ar' ? 'تحدث الآن...' : 'Speak now...') :
                 isSpeaking ? 
                  (language === 'ar' ? 'يرجى الانتظار...' : 'Please wait...') :
                  (language === 'ar' ? 'اضغط لبدء المحادثة' : 'Press to start conversation')
                }
              </p>
            </div>

            {/* Main Voice Button */}
            <div className="flex justify-center">
              <button
                onClick={isListening ? stopListening : startConversation}
                disabled={isSpeaking}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : isSpeaking 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800'
                } disabled:opacity-50 disabled:hover:scale-100`}
              >
                <span className="text-3xl text-white">
                  {isListening ? '⏹️' : isSpeaking ? '🔊' : '🎤'}
                </span>
                
                {/* Pulsing rings when listening */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 border-4 border-red-300 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-red-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Welcome/Instructions Card */}
          {showWelcome && (
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {language === 'ar' ? 'بدء المحادثة' : 'Start Conversation'}
                </h3>
                
                <div className="text-right space-y-3 mb-6">
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'استمع للرد الصوتي' : 'Listen to voice response'}
                    </span>
                    <span className="text-lg">4</span>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'تحدث بشكل طبيعي' : 'Speak naturally'}
                    </span>
                    <span className="text-lg">3</span>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'اسمح بالوصول للميكروفون' : 'Allow microphone access'}
                    </span>
                    <span className="text-lg">2</span>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'اضغط على "بدء المحادثة"' : 'Press "Start Conversation"'}
                    </span>
                    <span className="text-lg">1</span>
                  </div>
                </div>

                <button
                  onClick={startConversation}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  {language === 'ar' ? 'بدء المحادثة' : 'Start Conversation'}
                </button>
              </div>
            </div>
          )}

          {/* Conversation Display */}
          {(transcript || aiResponse) && !showWelcome && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 mt-6">
              <div className="space-y-4">
                {transcript && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-600 text-sm font-semibold mb-1">
                        {language === 'ar' ? 'أنت' : 'You'}
                      </p>
                      <p className="text-gray-800 bg-blue-50 rounded-xl p-3 text-sm">
                        {transcript}
                      </p>
                    </div>
                  </div>
                )}
                
                {aiResponse && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-green-600 text-sm font-semibold mb-1">
                        {language === 'ar' ? 'المساعد' : 'Assistant'}
                      </p>
                      <p className="text-gray-800 bg-green-50 rounded-xl p-3 text-sm">
                        {aiResponse}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}