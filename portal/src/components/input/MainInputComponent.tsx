import { Button, Textarea, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { Mic24Regular } from '@fluentui/react-icons'
import type { ChangeEvent } from 'react'

type MainInputAction = 'ask' | 'code'

export type MainInputProps = {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: (action: MainInputAction) => void
  isLoading?: boolean
  hasVoiceInput?: boolean
}

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
    alignItems: 'stretch',
    gap: '0.75rem',
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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleSubmit = (action: MainInputAction) => {
    onSubmit(action)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {hasVoiceInput ? (
          <Button
            appearance="transparent"
            icon={<Mic24Regular />}
            aria-label="Start voice input"
            disabled
          />
        ) : null}
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
          <Button
            appearance="transparent"
            icon={<Mic24Regular />}
            aria-label="Send voice message"
            disabled
          />
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
    </div>
  )
}
