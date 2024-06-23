import { escapeRegExp } from '../utils/escapeRegExp.ts'

export interface TextRange {
  start: number
  end: number
}

/**
 * Interface representing the settings for the enlarger.
 */
export interface EnlargerSettings {
  /**
   * Tests whether the selected content can be enlarged.
   *
   * @param {string} selectedContent - The content currently selected.
   * @param {string} fullContent - The full content of the text node.
   * @param {Range} range - The current selection range.
   * @returns {boolean} - Whether the selected content can be enlarged.
   */
  test: (selectedContent: string, fullContent: string, range: Range) => boolean

  /**
   * Regular expression to match the start boundary for enlargement.
   */
  matchStart: RegExp

  /**
   * Regular expression to match the end boundary for enlargement.
   */
  matchEnd: RegExp

  /**
   * Builds the new start and end positions for the enlarged selection.
   *
   * @param {number} start - The start offset of the original selection.
   * @param {number} end - The end offset of the original selection.
   * @param {string} fullContent - The full content of the text node.
   * @param {Range} range - The current selection range.
   * @returns {TextRange} - The new start and end positions for the enlarged selection.
   */
  build: (start: number, end: number, fullContent: string, range: Range) => TextRange
}

/**
 * Creates an enlarger settings object that symmetrically enlarges selections based on given boundaries.
 *
 * @param {string} leftBound - The left boundary string.
 * @param {string} [rightBound=leftBound] - The right boundary string, defaults to the left boundary if not provided.
 * @returns {EnlargerSettings} - The settings object for the enlarger.
 */
export const createSymmetricEnlarger = (leftBound: string, rightBound: string = leftBound): EnlargerSettings => {
  const escapedLeftBound = escapeRegExp(leftBound)
  const escapedRightBound = escapeRegExp(rightBound)

  return {
    test: (selectedContent: string) => !selectedContent.includes(leftBound) && !selectedContent.includes(rightBound),
    matchStart: new RegExp(escapedLeftBound),
    matchEnd: new RegExp(escapedRightBound),
    build: (start, end, fullContent, range) => {
      const selectionWithBounds = fullContent.substring(start - 1, end + 1)
      const testRegex = new RegExp(`^${escapedLeftBound}\\s*${escapeRegExp(range.toString())}\\s*${escapedRightBound}$`)
      if (testRegex.test(selectionWithBounds)) {
        return { start: start - 1, end: end + 1 }
      }
      return collapseSpaces(fullContent, start, end)
    },
  }
}

/**
 * @param source - The source text.
 * @param start - The start offset.
 * @param end - The end offset.
 */
const collapseSpaces = (source: string, start: number, end: number): { start: number; end: number } => {
  if (/^\s*$/.test(source.substring(start, end))) {
    return { start, end }
  }
  while (/\s/.test(source[start])) {
    start++
  }
  while (/\s/.test(source[end - 1])) {
    end--
  }
  return { start, end }
}
