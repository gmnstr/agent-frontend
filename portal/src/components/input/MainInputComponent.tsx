import {
  Button,
  Textarea,
  Tooltip,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { Attach24Regular, Mic24Regular } from '@fluentui/react-icons'
import { keyframes } from '@griffel/react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useVoiceInput } from '../../hooks/useVoiceInput'

type MainInputAction = 'ask' | 'code'

export type MainInputProps = {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: (action: MainInputAction) => void
  isLoading?: boolean
  hasVoiceInput?: boolean
}

const voicePulse = keyframes({
  '0%': {
    boxShadow: '0 0 0 0 rgba(56, 139, 253, 0.45)',
  },
  '50%': {
    boxShadow: '0 0 0 6px rgba(56, 139, 253, 0.15)',
  },
  '100%': {
    boxShadow: '0 0 0 0 rgba(56, 139, 253, 0)',
  },
})

const useStyles = makeStyles({
  container: {
    backgroundColor: '#21262D',
    borderRadius: '12px',
    border: '1px solid #30363D',
    ...shorthands.padding('1.5rem', '1.75rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: tokens.shadow4,
    selectors: {
      '&:focus-within': {
        borderColor: '#58A6FF',
        boxShadow: '0 0 0 3px rgba(88, 166, 255, 0.35)',
      },
    },
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconButton: {
    minWidth: '2.5rem',
    height: '2.5rem',
    borderRadius: '0.75rem',
  },
  voiceButtonActive: {
    color: tokens.colorBrandForegroundLink,
    animationName: voicePulse,
    animationDuration: '1.25s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
  voiceButtonReducedMotion: {
    animationDuration: '0s',
  },
  input: {
    flex: 1,
    minHeight: '3rem',
    fontSize: '1.05rem',
    lineHeight: 1.5,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '0.75rem',
    selectors: {
      '& textarea': {
        minHeight: '3rem',
        maxHeight: '7.5rem',
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
      },
    },
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
  statusArea: {
    minHeight: '1.25rem',
  },
  statusText: {
    color: tokens.colorNeutralForeground3,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: 1,
  },
})

export const MainInputComponent = ({
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading = false,
  hasVoiceInput = true,
}: MainInputProps) => {
  const styles = useStyles()
  const prefersReducedMotion = usePrefersReducedMotion()
  const voice = useVoiceInput()
  const voiceBaselineRef = useRef('')
  const lastTranscriptRef = useRef('')
  const [voiceNotice, setVoiceNotice] = useState<string>('')
  const [voiceAttempted, setVoiceAttempted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleSubmit = (action: MainInputAction) => {
    onSubmit(action)
  }

  const handleVoiceToggle = () => {
    if (!hasVoiceInput) {
      return
    }

    setVoiceAttempted(true)

    if (!voice.isSupported) {
      setVoiceNotice('Voice input is not supported in this browser yet.')
      return
    }

    if (voice.isRecording) {
      voice.stop()
      setVoiceNotice('Processing voice input…')
      return
    }

    voiceBaselineRef.current = value.trim()
    lastTranscriptRef.current = ''
    setVoiceNotice('Listening… tap the microphone again to stop recording.')
    voice.reset()
    voice.start()
  }

  useEffect(() => {
    if (!hasVoiceInput) {
      return
    }

    if (voice.error) {
      setVoiceNotice(`Voice input error: ${voice.error}`)
    }
  }, [hasVoiceInput, voice.error])

  useEffect(() => {
    if (!hasVoiceInput) {
      return
    }

    if (voice.isRecording) {
      setVoiceNotice('Listening… tap the microphone again to stop recording.')
      return
    }

    const transcript = voice.transcript.trim()
    if (!transcript) {
      if (voiceNotice.startsWith('Processing')) {
        setVoiceNotice('')
      }
      return
    }

    if (lastTranscriptRef.current === transcript) {
      return
    }

    const baseline = voiceBaselineRef.current.trim() || value.trim()
    const combined = [baseline, transcript].filter(Boolean).join(baseline && transcript ? ' ' : '')
    onChange(combined)
    voiceBaselineRef.current = combined
    lastTranscriptRef.current = transcript
    setVoiceNotice(`Captured “${transcript}” from voice input.`)
  }, [hasVoiceInput, onChange, value, voice.isRecording, voice.transcript, voiceNotice])

  const voiceMessage = useMemo(() => {
    if (!hasVoiceInput) {
      return ''
    }

    if (voice.isRecording) {
      return 'Listening… tap the microphone again to stop recording.'
    }

    if (voiceNotice) {
      return voiceNotice
    }

    if (!voice.isSupported) {
      return voiceAttempted ? 'Voice input is not supported in this browser yet.' : ''
    }

    return ''
  }, [hasVoiceInput, voice.isRecording, voice.isSupported, voiceNotice, voiceAttempted])

  const voiceButtonClassName = mergeClasses(
    styles.iconButton,
    voice.isRecording && styles.voiceButtonActive,
    prefersReducedMotion && styles.voiceButtonReducedMotion,
  )

  const voiceButtonLabel = voice.isRecording ? 'Stop voice input' : 'Start voice input'

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Tooltip content="Attach reference files" relationship="label">
          <Button
            className={styles.iconButton}
            appearance="transparent"
            icon={<Attach24Regular />}
            aria-label="Attach reference files"
            disabled
          />
        </Tooltip>
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={styles.input}
          resize="vertical"
          disabled={isLoading}
          aria-label="Describe your next task"
        />
        {hasVoiceInput ? (
          <Tooltip
            content={voice.isSupported ? voiceButtonLabel : 'Voice input is not supported'}
            relationship="label"
          >
            <Button
              className={voiceButtonClassName}
              appearance="transparent"
              icon={<Mic24Regular />}
              aria-label={voice.isSupported ? voiceButtonLabel : 'Voice input unavailable'}
              aria-pressed={voice.isRecording}
              onClick={handleVoiceToggle}
              disabled={isLoading}
            />
          </Tooltip>
        ) : null}
      </div>
      <div className={styles.actions}>
        <Button appearance="secondary" onClick={() => handleSubmit('ask')} disabled={isLoading}>
          Ask
        </Button>
        <Button appearance="primary" onClick={() => handleSubmit('code')} disabled={isLoading}>
          Code
        </Button>
      </div>
      <div className={styles.statusArea}>
        <span
          className={voiceMessage ? styles.statusText : styles.visuallyHidden}
          role="status"
          aria-live="polite"
        >
          {voiceMessage}
        </span>
      </div>
    </div>
  )
}
