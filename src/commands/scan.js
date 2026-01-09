/**
 * Scan Command
 *
 * Usage: devradar scan [path] [--json]
 */

import { readFile } from 'fs/promises';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { scanPackageJson } from '../api/client.js';
import { formatScanOutput, formatError } from '../output/text.js';
import { formatScanJson, formatErrorJson } from '../output/json.js';

/**
 * Find package.json in directory
 */
function findPackageJson(dirPath) {
  const packagePath = join(dirPath, 'package.json');
  if (existsSync(packagePath)) {
    return packagePath;
  }
  return null;
}

/**
 * Parse package.json and validate structure
 */
async function parsePackageJson(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const parsed = JSON.parse(content);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid package.json: Root must be an object');
  }

  return parsed;
}

export async function scanCommand(args) {
  // Parse arguments
  const pathArg = args.find(arg => !arg.startsWith('--')) || '.';
  const jsonFlag = args.includes('--json') || args.includes('-j');

  let packagePath;

  // Resolve package.json path
  if (pathArg === '.') {
    // Current directory
    const found = findPackageJson(process.cwd());
    if (!found) {
      console.error(formatError('No package.json found in current directory'));
      process.exit(1);
    }
    packagePath = found;
  } else {
    // Specific path - could be file or directory
    const resolved = resolve(pathArg);
    if (!existsSync(resolved)) {
      console.error(formatError(`Path not found: ${resolved}`));
      process.exit(1);
    }
    // If it's a directory, look for package.json
    const stat = await import('fs').then(fs => fs.statSync(resolved));
    if (stat.isDirectory()) {
      const found = findPackageJson(resolved);
      if (!found) {
        console.error(formatError(`No package.json found in: ${resolved}`));
        process.exit(1);
      }
      packagePath = found;
    } else {
      packagePath = resolved;
    }
  }

  try {
    // Parse package.json
    const packageJson = await parsePackageJson(packagePath);

    // Call API
    const result = await scanPackageJson(packageJson);

    // Format output
    if (jsonFlag) {
      console.log(formatScanJson(result));
    } else {
      console.log(formatScanOutput(result));
    }

    // Exit with appropriate code based on score
    const exitCode = result.stack.score >= 60 ? 0 :
                     result.stack.score >= 40 ? 1 : 2;
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
