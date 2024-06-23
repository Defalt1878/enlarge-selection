import { Enumerable } from '../Enumerable/Enumerable.ts'
import { enlargers } from './enlargers'
import { EnlargerSettings } from './utils'

/**
 * Expands the text selection within a range based on predefined settings.
 * @param range - The range to be expanded.
 */
export const expandTextSelection = (range: Range) => {
  if (range.commonAncestorContainer.nodeType !== Node.TEXT_NODE) {
    throw new Error('Not text node passed')
  }

  const textNode = range.commonAncestorContainer as Text
  const selectedContent = range.toString()
  const fullContent = textNode.wholeText

  const minEnlarge = Enumerable(enlargers)
    .select(enlarger => tryApplyEnlarger(enlarger, selectedContent, fullContent, range))
    .whereNotNull()
    .defaultIfEmpty({ start: 0, end: fullContent.length })
    .minBy(e => e.end - e.start)!

  range.setStart(textNode, minEnlarge.start)
  range.setEnd(textNode, minEnlarge.end)
}

const tryApplyEnlarger = (enlarger: EnlargerSettings, selectedContent: string, fullContent: string, range: Range) => {
  if (!enlarger.test(selectedContent, fullContent, range)) {
    return null
  }
  const surround = surroundWith(fullContent, enlarger.matchStart, enlarger.matchEnd, range.startOffset, range.endOffset)
  if (!surround) {
    return null
  }
  return enlarger.build(surround.start, surround.end, fullContent, range)
}

/**
 * Finds the surrounding text boundaries based on start and end matches.
 * @param source - The source text.
 * @param matchStart - Regular expression to match the start boundary.
 * @param matchEnd - Regular expression to match the end boundary.
 * @param targetStart - The start offset within the text.
 * @param targetEnd - The end offset within the text.
 * @returns The start and end boundaries, or null if not found.
 */
const surroundWith = (
  source: string,
  matchStart: RegExp,
  matchEnd: RegExp,
  targetStart: number,
  targetEnd: number,
): { start: number; end: number } | null => {
  const nearerStartMatch = Enumerable(source.matchAll(new RegExp(matchStart, 'g')))
    .where(match => match.index + match[0].length <= targetStart)
    .lastOrDefault()

  const nearerEndMatch = Enumerable(source.matchAll(new RegExp(matchEnd, 'g'))).firstOrDefault(
    match => match.index >= targetEnd,
  )

  if (nearerStartMatch && nearerEndMatch) {
    return { start: nearerStartMatch.index + nearerStartMatch[0].length, end: nearerEndMatch.index }
  }
  return null
}
