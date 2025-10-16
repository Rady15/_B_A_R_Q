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

  useEffect(() => {
    // Voice Recognition Setup
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language === 'ar' ? 'ar-EG' : 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleAIResponse(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [language])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handleAIResponse = async (userInput: string) => {
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput, language }),
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
        
        setAiResponse(errorMessage)
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
        setAiResponse(errorMessage)
        speakResponse(errorMessage)
        return
      }

      const responseText = data.response || data.error || (language === 'ar' 
        ? 'عذراً، لم أتلقَ استجابة. يرجى المحاولة مرة أخرى.'
        : 'Sorry, I didn\'t receive a response. Please try again.'
      )
      
      setAiResponse(responseText)
      speakResponse(responseText)
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage = language === 'ar' 
        ? 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
        : 'Sorry, an unexpected error occurred. Please try again.'
      setAiResponse(errorMessage)
      speakResponse(errorMessage)
    }
  }

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'ar' ? 'ar-EG' : 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      const ensureVoices = () =>
        new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const voices = synth.getVoices()
          if (voices && voices.length) return resolve(voices)
          const onVoices = () => {
            synth.removeEventListener('voiceschanged', onVoices)
            resolve(synth.getVoices())
          }
          synth.addEventListener('voiceschanged', onVoices)
        })

      ensureVoices()
        .then((voices) => {
          const preferred =
            voices.find(v => (language === 'ar' ? v.lang?.toLowerCase().startsWith('ar') : v.lang?.toLowerCase().startsWith('en'))) ||
            voices[0]
          if (preferred) utterance.voice = preferred

          utterance.onend = () => {
            setIsSpeaking(false)
          }

          synth.cancel()
          synth.speak(utterance)
        })
        .catch(() => {
          utterance.onend = () => {
            setIsSpeaking(false)
          }
          synth.cancel()
          synth.speak(utterance)
        })
    }
  }

  const welcomeMessage = () => {
    const welcome = t('voice.welcomeMessage')
    setAiResponse(welcome)
    speakResponse(welcome)
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