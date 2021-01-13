/**
 * @param {string} message The message to parse.
 * @return The parsed JSON object or null.
 */
export function safeParseJSON<T>(message?: any): T | null {
  if (!message){ return null; }
  try {
    return JSON.parse(message)
  } catch (error) {
    return null
  }
}

export function jsonToString<T>(data: T): string {
  return typeof data === 'string' ?
      data :
      JSON.stringify(data);
}