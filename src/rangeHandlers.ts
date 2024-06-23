import { getNodeEndOffset } from './utils/getNodeEndOffset.ts'
import { expandTextSelection } from './textEnlargers/inlineTextEnlarger'

/**
 * Handles the range enlargement when start and end containers are different.
 * @param range - The range to be processed.
 */
export const handleDifferentContainers = (range: Range) => {
  const endContainerEndOffset = getNodeEndOffset(range.endContainer)
  if (range.startOffset !== 0 || range.endOffset !== endContainerEndOffset) {
    range.setStartBefore(range.startContainer)
    range.setEndAfter(range.endContainer)
  } else {
    range.selectNode(range.commonAncestorContainer)
  }
}

/**
 * Handles the range enlargement when the start and end containers are the same.
 * @param range - The range to be processed.
 */
export const handleSameContainer = (range: Range) => {
  const container = range.commonAncestorContainer

  const containerEndOffset = getNodeEndOffset(container)
  if (range.startOffset === 0 && range.endOffset === containerEndOffset) {
    if (container.parentNode) {
      range.selectNode(container.parentNode)
    }
    return
  }

  if (container.nodeType === Node.TEXT_NODE) {
    expandTextSelection(range)
  } else if (container.parentNode) {
    range.selectNode(container)
  }
}

/**
 * Normalizes a given range by enlarging it to the common ancestor container if necessary.
 * @param range - The range to be normalized.
 */
export const normalize = (range: Range) => {
  if (canEnlargeToCommonAncestor(range)) {
    range.selectNode(range.commonAncestorContainer)
  }

  while (canEnlargeToParent(range)) {
    range.selectNode(range.commonAncestorContainer.parentNode!)
  }
}

/**
 * Checks if the range can be enlarged to its common ancestor container.
 * @param range - The range to be checked.
 * @returns Whether the range can be enlarged to its common ancestor.
 */
const canEnlargeToCommonAncestor = (range: Range): boolean =>
  (range.commonAncestorContainer !== range.startContainer || range.commonAncestorContainer !== range.endContainer) &&
  range.toString().trim() === range.commonAncestorContainer.textContent?.trim()

/**
 * Checks if the range can be enlarged to its parent node.
 * @param range - The range to be checked.
 * @returns Whether the range can be enlarged to its parent node.
 */
const canEnlargeToParent = (range: Range): boolean =>
  range.commonAncestorContainer.parentNode?.textContent != null &&
  range.commonAncestorContainer.parentNode.textContent.trim() === range.toString().trim()
