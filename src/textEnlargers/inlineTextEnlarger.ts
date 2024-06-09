import { enlargers } from './enlargers'
import { EnlargerSettings, TextRange } from './utils'

/**
 * Expands the text selection within a range based on predefined settings.
 * @param range - The range to be expanded.
 */
export const expandTextSelection = (range: Range) => {
  const textNode = range.startContainer as Text
  const selectedContent = range.toString()
  const fullContent = textNode.wholeText

  const appliableEnlargers = enlargers
    .map(enlarger => tryApplyEnlarger(enlarger, selectedContent, fullContent, range))
    .filter(enlarge => enlarge != null) as TextRange[]

  const minEnlarge = appliableEnlargers.sort(textRangesComparer)[0] || {
    start: 0,
    end: fullContent.length,
  }

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
  const startMatches = [...source.matchAll(new RegExp(matchStart, 'g'))]
  const endMatches = [...source.matchAll(new RegExp(matchEnd, 'g'))]

  const nearerStartMatch = startMatches.filter(match => match.index + match[0].length <= targetStart).pop()
  const nearerEndMatch = endMatches.find(match => match.index >= targetEnd)

  if (nearerStartMatch && nearerEndMatch) {
    return { start: nearerStartMatch.index + nearerStartMatch[0].length, end: nearerEndMatch.index }
  }
  return null
}

const textRangesComparer = (a: TextRange, b: TextRange): number => {
  return a.end - a.start - (b.end - b.start)
}
