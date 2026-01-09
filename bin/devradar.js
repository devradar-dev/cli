#!/usr/bin/env node

/**
 * DevRadar CLI
 *
 * Check your tech stack compatibility from the terminal.
 *
 * Usage:
 *   devradar check <techA> <techB>    Check compatibility between two technologies
 *   devradar scan                     Scan package.json in current directory
 *   devradar scan <path>              Scan package.json at specific path
 *
 * @license MIT
 * @see https://devradar.dev
 */

import { checkCommand } from '../src/commands/check.js';
import { scanCommand } from '../src/commands/scan.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'check':
      await checkCommand(args.slice(1));
      break;
    case 'scan':
      await scanCommand(args.slice(1));
      break;
    case '--help':
    case '-h':
    case 'help':
      showHelp();
      break;
    case '--version':
    case '-v':
    case 'version':
      showVersion();
      break;
    default:
      if (!command) {
        console.error('Error: No command specified\n');
      } else {
        console.error(`Error: Unknown command "${command}"\n`);
      }
      showHelp();
      process.exit(1);
  }
}

function showHelp() {
  console.log(`
DevRadar CLI - Check your tech stack compatibility

USAGE:
  devradar <command> [options]

COMMANDS:
  check <techA> <techB>    Check compatibility between two technologies
  scan [path]              Scan package.json (default: ./package.json)

OPTIONS:
  --json, -j               Output results as JSON
  --help, -h               Show this help message
  --version, -v            Show version

EXAMPLES:
  # Check Next.js + Prisma compatibility
  devradar check nextjs prisma

  # Scan current directory
  devradar scan

  # Scan specific package.json
  devradar scan ./my-app/package.json

  # Get JSON output
  devradar check nextjs prisma --json

WEBSITE:
  https://devradar.dev

For more information, visit https://github.com/devradar-dev/cli
  `.trim());
}

function showVersion() {
  console.log('@devradar-dev/cli v1.0.0');
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
