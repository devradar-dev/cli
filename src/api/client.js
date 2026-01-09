/**
 * API Client for DevRadar V1 API
 *
 * Handles communication with DevRadar's public API endpoints.
 */

const API_BASE_URL = 'https://devradar.dev/api/v1';

/**
 * Check compatibility between two technologies
 */
export async function checkCompatibility(techA, techB) {
  const response = await fetch(`${API_BASE_URL}/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ techA, techB }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Check request failed');
  }

  return await response.json();
}

/**
 * Scan package.json for compatibility issues
 */
export async function scanPackageJson(packageJson) {
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ packageJson }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Scan request failed');
  }

  return await response.json();
}
