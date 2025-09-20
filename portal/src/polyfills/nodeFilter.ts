export const nodeFilterShim = {
  FILTER_ACCEPT: 1,
  FILTER_REJECT: 2,
  FILTER_SKIP: 3,
  SHOW_ALL: 0xffffffff,
  SHOW_ELEMENT: 0x1,
  SHOW_ATTRIBUTE: 0x2,
  SHOW_TEXT: 0x4,
  SHOW_CDATA_SECTION: 0x8,
  SHOW_ENTITY_REFERENCE: 0x10,
  SHOW_ENTITY: 0x20,
  SHOW_PROCESSING_INSTRUCTION: 0x40,
  SHOW_COMMENT: 0x80,
  SHOW_DOCUMENT: 0x100,
  SHOW_DOCUMENT_TYPE: 0x200,
  SHOW_DOCUMENT_FRAGMENT: 0x400,
  SHOW_NOTATION: 0x800,
} as const

export const installNodeFilterShim = () => {
  if (typeof globalThis.NodeFilter !== 'undefined') {
    return
  }

  try {
    new Function('value', 'NodeFilter = value;')(nodeFilterShim)
  } catch {
    ;(globalThis as typeof globalThis & { NodeFilter?: typeof nodeFilterShim }).NodeFilter = nodeFilterShim
  }

  if (typeof window !== 'undefined') {
    ;(window as Window & { NodeFilter?: typeof nodeFilterShim }).NodeFilter = nodeFilterShim
  }
}

installNodeFilterShim()
