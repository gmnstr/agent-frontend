import { useEffect } from 'react'

type HotkeyOptions = {
  allowWhileFocusingInput?: boolean
}

const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return (
    target.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select'
  )
}

export const useHotkey = (
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
) => {
  useEffect(() => {
    const normalizedKey = key.length === 1 ? key.toLowerCase() : key

    const listener = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return
      }

      if (!options.allowWhileFocusingInput && isEditableElement(event.target)) {
        return
      }

      const matchesKey =
        event.key.toLowerCase() === normalizedKey ||
        event.code.toLowerCase() === normalizedKey.toLowerCase()

      if (matchesKey) {
        handler(event)
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handler, key, options.allowWhileFocusingInput])
}
