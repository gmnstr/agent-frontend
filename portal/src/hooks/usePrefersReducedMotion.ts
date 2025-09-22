import { useEffect, useState } from 'react'

const getPrefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getPrefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

export default usePrefersReducedMotion
