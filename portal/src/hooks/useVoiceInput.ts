import { useCallback, useEffect, useRef, useState } from 'react'

type VoiceInputOptions = {
  lang?: string
}

type VoiceInputState = {
  isSupported: boolean
  isRecording: boolean
  transcript: string
  error: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

export const useVoiceInput = ({ lang = 'en-US' }: VoiceInputOptions = {}): VoiceInputState => {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    initializedRef.current = true
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onstart = () => {
      setIsRecording(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let aggregated = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const alternative = result[0]
        if (alternative) {
          aggregated += alternative.transcript
        }
      }

      setTranscript(aggregated.trim())
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.message || event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    setIsSupported(true)

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [lang])

  const start = useCallback(() => {
    if (!recognitionRef.current || isRecording) {
      return
    }

    setError(null)

    try {
      recognitionRef.current.start()
    } catch (error_) {
      if (error_ instanceof Error) {
        setError(error_.message)
      }
    }
  }, [isRecording])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const reset = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    isSupported,
    isRecording,
    transcript,
    error,
    start,
    stop,
    reset,
  }
}
