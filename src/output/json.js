/**
 * JSON Output Formatter
 *
 * Formats CLI output as JSON for programmatic use.
 */

/**
 * Format check command output as JSON
 */
export function formatCheckJson(techA, techB, result) {
  const output = {
    techA,
    techB,
    ...result,
  };
  return JSON.stringify(output, null, 2);
}

/**
 * Format scan command output as JSON
 */
export function formatScanJson(result) {
  return JSON.stringify(result, null, 2);
}

/**
 * Format error as JSON
 */
export function formatErrorJson(message) {
  return JSON.stringify({ error: message }, null, 2);
}
