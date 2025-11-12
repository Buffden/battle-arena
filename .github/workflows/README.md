# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Battle Arena project.

## 📊 Generate UML Diagrams Workflow

**File:** `generate-diagrams.yml`

### Overview

This workflow automatically validates PlantUML diagram syntax and generates PNG images from `.puml` files in the `docs/03-DIAGRAMS/` directory.

### What It Does

1. **Validates** PlantUML syntax on pull requests and pushes
2. **Generates** PNG diagrams on merges (push events)
3. **Commits** generated diagrams back to the repository
4. **Uploads** diagrams as artifacts for download

### When It Runs

| Event | Actions Performed | Purpose |
|-------|-------------------|---------|
| **Pull Request** | ✅ Validate only | Fast syntax check before merge |
| **Push/Merge** | ✅ Validate + Generate + Commit | Full workflow on merge |
| **Manual Trigger** | ✅ Validate + Generate + Commit | Full workflow execution |

### Trigger Conditions

The workflow triggers when:
- **Push** to `main` or `develop` branches that modify:
  - `docs/03-DIAGRAMS/**/*.puml` files
  - `.github/workflows/generate-diagrams.yml` file
- **Pull Request** targeting `main` or `develop` that modifies:
  - `docs/03-DIAGRAMS/**/*.puml` files
- **Manual trigger** via GitHub Actions UI (`workflow_dispatch`)

### Workflow Steps

#### 1. Setup
- Checks out the repository
- Sets up Java 17
- Installs Graphviz (required for PlantUML)
- Downloads PlantUML JAR

#### 2. Smart Validation Check
- **On PRs:** Always validates (catches errors early)
- **On Push:** Only validates if `.puml` files were changed
  - Skips validation if no `.puml` files changed (already validated in PR)
  - Validates if `.puml` files changed (safety net for direct pushes, force pushes, etc.)

#### 3. Diagram Generation
- **Only runs on:** Push events and manual triggers
- **Skips on:** Pull requests (to avoid redundant work)
- Generates PNG files from all `.puml` files
- Saves to `docs/03-DIAGRAMS/exported/`

#### 4. Validation
- Validates all `.puml` files for syntax errors
- Provides detailed error messages with file names
- Fails the workflow if validation errors are found

#### 5. Commit & Push
- **Only runs on:** Push events (after merge)
- Commits generated PNG files back to the repository
- Uses commit message: `docs: auto-update UML diagrams [skip ci]`
- Skips CI on the commit to prevent infinite loops

#### 6. Artifact Upload
- Uploads generated PNG files as artifacts
- Artifacts are named: `uml-diagrams-{event}-{sha}`
- Retention: 30 days

#### 7. Summary
- Creates a workflow summary with statistics
- Shows event type, validation status, and diagram counts

### Optimization: Smart Validation

The workflow includes an optimization to avoid redundant validation:

**Scenario 1: PR with `.puml` changes**
```
PR opened → ✅ Validate → Pass → Merge → ✅ Validate again (safety net)
```

**Scenario 2: PR without `.puml` changes**
```
PR opened → ⏭️ Skip (no .puml files) → Merge → ⏭️ Skip (no .puml files)
```

**Scenario 3: Direct push with `.puml` changes**
```
Direct push → ✅ Validate (no PR validation occurred)
```

**Why validate on push even after PR validation?**
- **Direct pushes:** Someone might bypass PRs and push directly
- **Force pushes:** Can overwrite validated code
- **Manual triggers:** No PR context
- **Hotfixes:** Emergency fixes that might bypass PRs
- **Safety net:** Catches edge cases and configuration issues

### Concurrency Control

The workflow uses concurrency groups to prevent duplicate runs:
- If a new workflow run starts for the same branch, it cancels any in-progress runs
- Prevents multiple workflows from running simultaneously on the same branch

### Common Scenarios

#### ✅ Normal PR Flow
1. Developer creates PR with `.puml` file changes
2. Workflow validates syntax → ✅ Pass
3. PR is merged to `main`/`develop`
4. Workflow validates again → ✅ Pass
5. Workflow generates PNG diagrams
6. Workflow commits diagrams back to repository

#### ⚠️ PR with Syntax Errors
1. Developer creates PR with invalid `.puml` syntax
2. Workflow validates syntax → ❌ Fail
3. PR shows failed check
4. Developer fixes syntax errors
5. Workflow validates again → ✅ Pass
6. PR can be merged

#### 🔧 Manual Trigger
1. Developer manually triggers workflow via GitHub Actions UI
2. Workflow validates all `.puml` files → ✅ Pass
3. Workflow generates all PNG diagrams
4. Workflow commits diagrams back to repository

#### 🚀 Direct Push (if allowed)
1. Developer pushes directly to `main`/`develop` (bypassing PR)
2. Workflow validates syntax → ✅ Pass
3. Workflow generates PNG diagrams
4. Workflow commits diagrams back to repository

### Troubleshooting

#### Workflow Not Running
- **Check:** Are you modifying `.puml` files in `docs/03-DIAGRAMS/`?
- **Check:** Is the target branch `main` or `develop`?
- **Check:** Are you pushing to the correct branch?

#### Validation Failing
- **Check:** PlantUML syntax errors in the error output
- **Fix:** Review the error messages and fix syntax issues
- **Common issues:**
  - Missing `@startuml` or `@enduml` tags
  - Incorrect component notation
  - Package/component name conflicts
  - Invalid note syntax

#### Diagrams Not Generated
- **Check:** Is this a pull request? (Diagrams only generate on push/merge)
- **Check:** Are there any `.puml` files in `docs/03-DIAGRAMS/`?
- **Check:** Did validation pass? (Generation only happens after validation)

#### Diagrams Not Committed
- **Check:** Is this a push event? (Commits only happen on push, not PRs)
- **Check:** Did diagrams actually change? (No commit if no changes)
- **Check:** Are there write permissions? (Check workflow permissions)

### File Structure

```
docs/03-DIAGRAMS/
├── architecture/
│   ├── *.puml          # Source PlantUML files
│   └── ...
├── class-diagrams/
│   ├── *.puml
│   └── ...
└── exported/           # Generated PNG files (auto-created)
    ├── architecture/
    │   ├── *.png
    │   └── ...
    └── ...
```

### Dependencies

- **Java 17:** Required for PlantUML
- **Graphviz:** Required for diagram generation
- **PlantUML 1.2023.12:** Automatically downloaded

### Permissions

The workflow requires:
- **Contents: write** - To commit generated diagrams
- **Pull-requests: read** - To read PR information

### Best Practices

1. **Always validate on PRs:** Catch syntax errors before merge
2. **Don't commit `.puml` files with errors:** Fix validation errors first
3. **Review generated diagrams:** Check that diagrams render correctly
4. **Use meaningful commit messages:** The workflow uses `[skip ci]` to prevent loops
5. **Monitor workflow runs:** Check for failures and fix issues promptly

### Related Documentation

- [PlantUML Documentation](https://plantuml.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Project Documentation](../docs/README.md)

---

**Last Updated:** 2025-01-21  
**Maintainer:** Development Team

