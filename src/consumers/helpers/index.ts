/**
 * @param {string} message The message to parse.
 * @return The parsed JSON object or null.
 */
export function safeParseJSON(message: string): any {
  try {
    return JSON.parse(message)
  } catch (error) {
    return null
  }
}