/**
 * Gets the end offset of a node.
 * @param node - The node to get the end offset for.
 * @returns The end offset of the node.
 */
export const getNodeEndOffset = (node: Node): number => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      return node.childNodes.length
    case Node.TEXT_NODE:
      return node.textContent?.length || 0
    default:
      console.warn(`Unable to get end of node with type: ${ node.nodeType }`)
      return 0
  }
}