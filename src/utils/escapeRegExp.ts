/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param {string} source - The string to escape.
 * @returns {string} - The escaped string.
 */
export const escapeRegExp = (source: string): string => source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')