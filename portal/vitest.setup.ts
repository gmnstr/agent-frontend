import '@testing-library/jest-dom/vitest'
import { installNodeFilterShim } from './src/polyfills/nodeFilter'

installNodeFilterShim()

if (typeof window !== 'undefined' && 'MutationObserver' in window) {
  const OriginalMutationObserver = window.MutationObserver
  class NodeFilterSafeObserver implements MutationObserver {
    private readonly observer: MutationObserver

    constructor(callback: MutationCallback) {
      this.observer = new OriginalMutationObserver((mutations, observer) => {
        try {
          callback(mutations, observer)
        } catch (error) {
          if (error instanceof ReferenceError && /NodeFilter/.test(String(error?.message))) {
            return
          }

          throw error
        }
      })
    }

    disconnect(): void {
      this.observer.disconnect()
    }

    observe(target: Node, options?: MutationObserverInit): void {
      this.observer.observe(target, options)
    }

    takeRecords(): MutationRecord[] {
      return this.observer.takeRecords()
    }
  }

  window.MutationObserver = NodeFilterSafeObserver as unknown as typeof window.MutationObserver
}


class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in window)) {
  // @ts-expect-error Vitest environment shim
  window.ResizeObserver = ResizeObserverMock
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) => {
    return {
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }
  }
}

if (!('IntersectionObserver' in window)) {
  class IntersectionObserverMock {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }

  // @ts-expect-error Vitest environment shim
  window.IntersectionObserver = IntersectionObserverMock
}

installNodeFilterShim()
