import { createSymmetricEnlarger, EnlargerSettings } from './utils'

/**
 * Settings for text enlargement.
 */
export const enlargers: EnlargerSettings[] = [
  {
    test: (selectedContent, fullContent, range) => {
      if (/[^A-Za-zА-Яа-яЁё0-9_]/.test(selectedContent)) {
        return false
      }
      const start = range.startOffset
      if (start > 0 && /[A-Za-zА-Яа-яЁё0-9_]/.test(fullContent[start - 1])) {
        return true
      }
      const end = range.endOffset
      return end < fullContent.length && /[A-Za-zА-Яа-яЁё0-9_]/.test(fullContent[end])
    },
    matchStart: /(?<=^|[^A-Za-zА-Яа-яЁё0-9_])/,
    matchEnd: /(?=[^A-Za-zА-Яа-яЁё0-9_]|$)/,
    build: (start, end) => ({ start, end }),
  },
  {
    test: selectedContent => !/[.!?;]/.test(selectedContent),
    matchStart: /^|[.!?;]\s/,
    matchEnd: /[.!?;]\s|$/,
    build: (start, end, fullContent) => ({ start, end: fullContent.length > end + 1 ? end + 1 : end }),
  },
  createSymmetricEnlarger("'"),
  createSymmetricEnlarger('"'),
  createSymmetricEnlarger('[', ']'),
  createSymmetricEnlarger('{', '}'),
  createSymmetricEnlarger('(', ')'),
]
