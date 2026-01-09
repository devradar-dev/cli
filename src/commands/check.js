/**
 * Check Command
 *
 * Usage: devradar check <techA> <techB> [--json]
 */

import { checkCompatibility } from '../api/client.js';
import { formatCheckOutput, formatError } from '../output/text.js';
import { formatCheckJson, formatErrorJson } from '../output/json.js';

export async function checkCommand(args) {
  // Parse arguments
  const techA = args[0]?.toLowerCase();
  const techB = args[1]?.toLowerCase();
  const jsonFlag = args.includes('--json') || args.includes('-j');

  // Validate arguments
  if (!techA || !techB) {
    console.error(formatError('Two technology names are required'));
    console.error('Usage: devradar check <techA> <techB> [--json]');
    process.exit(1);
  }

  try {
    // Call API
    const result = await checkCompatibility(techA, techB);

    // Format output
    if (jsonFlag) {
      console.log(formatCheckJson(techA, techB, result));
    } else {
      console.log(formatCheckOutput(techA, techB, result));
    }

    // Exit with appropriate code
    const exitCode = result.status === 'compatible' ? 0 :
                     result.status === 'partial' ? 0 :
                     result.status === 'incompatible' ? 1 : 2;
    process.exit(exitCode);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (jsonFlag) {
      console.error(formatErrorJson(message));
    } else {
      console.error(formatError(message));
    }
    process.exit(1);
  }
}
