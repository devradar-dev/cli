/**
 * Text Output Formatter
 *
 * Formats CLI output for terminal display with colors and symbols.
 */

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Symbols
const symbols = {
  check: '✓',
  cross: '✗',
  warning: '⚠',
  info: 'ℹ',
  arrow: '→',
  bullet: '•',
};

/**
 * Format tech pair name
 */
function formatTechName(tech) {
  return tech.charAt(0).toUpperCase() + tech.slice(1);
}

/**
 * Get status color
 */
function getStatusColor(status) {
  switch (status) {
    case 'compatible':
      return colors.green;
    case 'partial':
      return colors.yellow;
    case 'incompatible':
      return colors.red;
    case 'deprecated':
      return colors.gray;
    default:
      return colors.gray;
  }
}

/**
 * Get severity color
 */
function getSeverityColor(severity) {
  switch (severity) {
    case 'info':
      return colors.green;
    case 'warning':
      return colors.yellow;
    case 'error':
      return colors.red;
    case 'critical':
      return colors.red;
    default:
      return colors.gray;
  }
}

/**
 * Format check command output
 */
export function formatCheckOutput(techA, techB, result) {
  const lines = [];

  // Header
  lines.push('');
  lines.push(`${colors.bright}${formatTechName(techA)} + ${formatTechName(techB)}${colors.reset}`);
  lines.push(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);
  lines.push('');

  // Status
  const statusColor = getStatusColor(result.status);
  const statusLabel = result.status.charAt(0).toUpperCase() + result.status.slice(1);
  const symbol = result.status === 'compatible' ? symbols.check :
                 result.status === 'partial' ? symbols.warning :
                 result.status === 'incompatible' ? symbols.cross : symbols.info;

  lines.push(`${statusColor}${colors.bright}${symbol} ${statusLabel}${colors.reset}`);

  // Message
  if (result.message) {
    lines.push('');
    lines.push(`${colors.dim}${result.message}${colors.reset}`);
  }

  // Severity
  if (result.severity) {
    const severityColor = getSeverityColor(result.severity);
    const severityLabel = result.severity.toUpperCase();
    lines.push('');
    lines.push(`${severityColor}[${severityLabel}]${colors.reset}`);
  }

  // Workaround
  if (result.workaround) {
    lines.push('');
    lines.push(`${colors.cyan}${symbols.bullet} Workaround:${colors.reset}`);
    lines.push(`  ${result.workaround}`);
  }

  // Docs URL
  if (result.docsUrl) {
    lines.push('');
    lines.push(`${colors.dim}${symbols.arrow} Learn more: ${result.docsUrl}${colors.reset}`);
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Format scan command output
 */
export function formatScanOutput(result) {
  const lines = [];

  // Header
  lines.push('');
  lines.push(`${colors.bright}Stack Compatibility Scan${colors.reset}`);
  lines.push(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);
  lines.push('');

  // Score
  const score = result.stack.score;
  const scoreColor = score >= 80 ? colors.green :
                    score >= 60 ? colors.yellow :
                    score >= 40 ? colors.red : colors.red;

  lines.push(`${colors.bright}Score: ${scoreColor}${score}/100${colors.reset}`);

  // Detected technologies
  if (result.stack.detected.length > 0) {
    lines.push('');
    lines.push(`${colors.bright}Detected Technologies:${colors.reset}`);
    result.stack.detected.forEach(tech => {
      lines.push(`  ${colors.green}${symbols.check}${colors.reset} ${formatTechName(tech)}`);
    });
  }

  // Issues
  if (result.stack.issues.length > 0) {
    lines.push('');
    lines.push(`${colors.bright}Issues (${result.stack.issues.length}):${colors.reset}`);
    result.stack.issues.forEach((issue, i) => {
      const severityColor = issue.severity === 'error' ? colors.red :
                           issue.severity === 'warning' ? colors.yellow : colors.green;
      const [techA, techB] = issue.pair.split('-');
      lines.push(`  ${i + 1}. ${formatTechName(techA)} + ${formatTechName(techB)}`);
      lines.push(`     ${severityColor}[${issue.severity.toUpperCase()}]${colors.reset} ${issue.message}`);
    });
  } else if (score >= 80) {
    lines.push('');
    lines.push(`${colors.green}${symbols.check} No compatibility issues found!${colors.reset}`);
  }

  // Suggestions
  if (result.stack.suggestions.length > 0) {
    lines.push('');
    lines.push(`${colors.bright}Suggestions:${colors.reset}`);
    result.stack.suggestions.forEach((suggestion) => {
      lines.push(`  ${colors.cyan}${symbols.bullet}${colors.reset} ${suggestion.message}`);
      if (suggestion.url) {
        lines.push(`    ${colors.dim}${suggestion.url}${colors.reset}`);
      }
    });
  }

  // Metadata
  lines.push('');
  lines.push(`${colors.dim}Scanned: ${result.metadata.dependencyCount} dependencies${colors.reset}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Format error message
 */
export function formatError(message) {
  return `${colors.red}${symbols.cross} Error: ${message}${colors.reset}\n`;
}
