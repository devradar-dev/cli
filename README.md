# @devradar-dev/cli

> Check your tech stack compatibility from the terminal

[![npm version](https://badge.fury.io/js/%40devradar-dev%2Fcli.svg)](https://www.npmjs.org/package/@devradar-dev/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g @devradar-dev/cli
```

Or use with npx (no installation required):

```bash
npx @devradar-dev/cli check nextjs prisma
```

## Usage

### Check Compatibility

Check if two technologies work well together:

```bash
devradar check nextjs prisma
```

**Output:**

```
Nextjs + Prisma
────────────────────────────────────────
✓ Compatible

Compatible in Node.js runtime but does NOT work in Edge Runtime.

→ Learn more: https://devradar.dev/check/nextjs-prisma
```

### Scan package.json

Analyze your entire project for compatibility issues:

```bash
# Scan current directory
devradar scan

# Scan specific project
devradar scan ./my-app/package.json
```

**Output:**

```
Stack Compatibility Scan
────────────────────────────────────────
Score: 55/100

Detected Technologies:
  ✓ Nextjs
  ✓ Prisma
  ✓ Tailwind

Issues (1):
  1. Nextjs + Prisma
     [WARNING] Edge Runtime incompatibility detected

Suggestions:
  • Consider using Turso or PlanetScale for Edge-compatible database
    https://devradar.dev/check/prisma-vercel-edge

Scanned: 5 dependencies
```

## Options

### JSON Output

Get machine-readable output for CI/CD:

```bash
devradar check nextjs prisma --json
devradar scan --json
```

**Response:**

```json
{
  "techA": "nextjs",
  "techB": "prisma",
  "version": "1.0",
  "status": "partial",
  "severity": "warning",
  "message": "...",
  "workaround": "...",
  "docsUrl": "https://devradar.dev/check/nextjs-prisma"
}
```

### Help

```bash
devradar --help
devradar check --help
devradar scan --help
```

### Version

```bash
devradar --version
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Compatible / Good score (60+) |
| 1 | Partial compatibility / Medium score (40-59) |
| 2 | Incompatible / Poor score (<40) |

Use in CI/CD:

```bash
devradar check nextjs prisma || echo "Compatibility issues found!"
```

## Examples

### CI/CD Integration

```yaml
# .github/workflows/compatibility-check.yml
- name: Check tech stack compatibility
  run: npx @devradar-dev/cli scan --json > compatibility-report.json
```

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
devradar scan || exit 1
```

### Dockerfile Check

```bash
devradar check node alpine
devradar check nextjs vercel-edge
```

## API

The CLI uses DevRadar's public API:

- **Check API:** `POST /api/v1/check`
- **Scan API:** `POST /api/v1/scan`

Rate limits:
- Check: 60 requests/minute
- Scan: 10 requests/minute

## Development

### Local Testing

```bash
# Clone repo
git clone https://github.com/devradar-dev/cli.git
cd cli

# Install dependencies
npm install

# Link for local testing
npm link

# Test
devradar check nextjs prisma
devradar scan
```

### Project Structure

```
@devradar-dev/cli/
├── bin/
│   └── devradar.js          # CLI entry point
├── src/
│   ├── api/
│   │   └── client.ts        # API client
│   ├── commands/
│   │   ├── check.ts         # Check command
│   │   └── scan.ts          # Scan command
│   └── output/
│       ├── text.ts          # Terminal output
│       └── json.ts          # JSON output
├── package.json
└── README.md
```

## Deployment

### Publish to npm

```bash
# Build (if needed)
npm run build

# Publish to @devradar-dev org
npm publish --access public
```

### GitHub Repository

1. Create new repo: `github.com/devradar-dev/cli`
2. Push code:
   ```bash
   git remote add origin https://github.com/devradar-dev/cli.git
   git branch -M main
   git push -u origin main
   ```

## License

MIT © [DevRadar](https://devradar.dev)

## Links

- **Website:** https://devradar.dev
- **Documentation:** https://github.com/devradar-dev/cli/wiki
- **API Docs:** https://devradar.dev/api
- **Report Issues:** https://github.com/devradar-dev/cli/issues

---

Made with ❤️ for developers worldwide
