# Pre-commit Hooks Configuration

This document describes the pre-commit hooks setup for the Battle Arena project using Husky and lint-staged.

## Overview

Pre-commit hooks automatically run code quality checks before each commit, ensuring that:

- Code is properly linted
- Code is properly formatted
- Code style violations are caught early
- Commits are blocked if critical errors are found

## Tools

- **Husky**: Git hooks manager
- **lint-staged**: Run linters on staged files only

## Configuration

### Root Package.json

The project root contains a `package.json` with Husky and lint-staged configuration:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2"
  },
  "lint-staged": {
    // Configuration for different file types
  }
}
```

### Pre-commit Hook

Location: `.husky/pre-commit`

The hook runs `lint-staged` which executes configured linters and formatters on staged files.

## What Gets Checked

### Node.js Services (matchmaking-service, game-engine)

**Files:** `*.js`, `*.json`

**Actions:**

1. ESLint with auto-fix
2. Prettier formatting

**Commands:**

- `npm run lint:fix` - Fixes linting issues
- `npm run format` - Formats code

### Angular Frontend

**Files:** `*.ts`, `*.html`, `*.css`, `*.scss`, `*.json`

**Actions:**

1. ESLint with auto-fix
2. Prettier formatting

**Commands:**

- `npm run lint:fix` - Fixes linting issues
- `npm run format` - Formats code

### Java Services (auth-service, profile-service, leaderboard-service)

**Files:** `*.java`

**Actions:**

1. Checkstyle validation

**Commands:**

- `mvn checkstyle:check` - Validates Java code style

**Note:** Checkstyle failures will block the commit.

### Other Files

**Files:** `*.json`, `*.md`, `*.yml`, `*.yaml`

**Actions:**

1. Prettier formatting

## Behavior

### Auto-fix

- ESLint issues that can be auto-fixed are fixed automatically
- Code is automatically formatted with Prettier
- Fixed files are re-staged for commit

### Blocking Commits

- **ESLint errors** (not warnings) will block the commit
- **Checkstyle violations** will block the commit
- **Prettier** only formats, doesn't block

### Warnings

- ESLint warnings do not block commits
- They are shown in the output for awareness

## Usage

### Normal Workflow

1. Make changes to files
2. Stage files: `git add <files>`
3. Commit: `git commit -m "message"`
4. Pre-commit hook runs automatically
5. If checks pass, commit proceeds
6. If checks fail, commit is blocked

### Bypassing Hooks (Not Recommended)

If you need to bypass hooks (e.g., for emergency fixes):

```bash
git commit --no-verify -m "message"
```

**Warning:** Only use `--no-verify` when absolutely necessary. It bypasses all quality checks.

### Manual Testing

Test lint-staged without committing:

```bash
npx lint-staged
```

Test with dry-run (see what would run):

```bash
npx lint-staged --dry-run
```

## Troubleshooting

### Hook Not Running

1. Ensure Husky is installed: `npm install`
2. Ensure hooks are installed: `npx husky install`
3. Check `.husky/pre-commit` exists and is executable

### ESLint Errors

If ESLint fails:

1. Check the error message
2. Run `npm run lint:fix` in the service directory
3. Fix remaining errors manually
4. Stage and commit again

### Checkstyle Failures

If Checkstyle fails:

1. Check the error message
2. Run `mvn checkstyle:check` in the service directory
3. Fix code style violations
4. Stage and commit again

### Prettier Issues

If Prettier fails:

1. Run `npm run format` in the service directory
2. Stage the formatted files
3. Commit again

## Configuration Files

- **Root:** `package.json` - Husky and lint-staged configuration
- **Hook:** `.husky/pre-commit` - Pre-commit hook script
- **Service configs:**
  - `backend-services/*/package.json` - ESLint/Prettier scripts
  - `backend-services/*/pom.xml` - Checkstyle Maven plugin
  - `frontend-service/package.json` - ESLint/Prettier scripts

## Related Documentation

- [Code Quality Tools](./CODE_QUALITY_TOOLS.md) - Detailed tool configuration
- [Testing Strategy](./02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach
- [Design Principles](./02-ARCHITECTURE/HIGH_LEVEL_DESIGN/11-DESIGN_PRINCIPLES.md) - Code quality standards
