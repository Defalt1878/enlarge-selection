import { handleDifferentContainers, handleSameContainer, normalize } from './rangeHandlers'

/**
 * Enlarges the selection.
 */
export const handleEnlargeSelection = () => {
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  console.debug(selection)

  for (let index = 0; index < selection.rangeCount; index++) {
    const range = selection.getRangeAt(index)
    processRange(range)
  }
}

/**
 * Processes a given range by enlarging and normalizing it.
 * @param range - The range to be processed.
 */
const processRange = (range: Range) => {
  if (range.startContainer !== range.endContainer) {
    handleDifferentContainers(range)
  } else {
    handleSameContainer(range)
  }
  normalize(range)
}
