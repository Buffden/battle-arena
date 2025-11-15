# Workflow Optimization

## Overview

This document covers optimization strategies for GitHub Actions workflows to reduce execution time, minimize CI costs, and improve developer experience.

## Current Workflow Architecture

### Parallel Job Execution

```
Backend CI Workflow:
├── java-services (parallel: 3 jobs)
│   ├── auth-service
│   ├── profile-service
│   └── leaderboard-service
└── nodejs-services (parallel: 2 jobs)
    ├── matchmaking-service
    └── game-engine

Frontend CI Workflow:
└── frontend-ci (1 job)

Security Scanning:
├── dependency-scanning-java (parallel: 3 jobs)
├── dependency-scanning-nodejs (parallel: 2 jobs)
├── dependency-scanning-frontend (1 job)
├── codeql-analysis (parallel: 2 jobs)
└── license-compliance (1 job)
```

**Total Concurrent Jobs:** Up to 12 jobs during peak

## Optimization Strategies

### 1. Caching Dependencies

#### Java Services - Maven Cache

```yaml
- name: Set up Java 17
  uses: actions/setup-java@v4
  with:
    java-version: '17'
    distribution: 'temurin'
    cache: 'maven'  # Automatic Maven dependency caching
```

**Benefits:**
- Reduces dependency download time from ~2-5 minutes to ~10-30 seconds
- Saves bandwidth and reduces external dependency on Maven Central
- Automatically invalidated on dependency changes

**Cache Key Strategy:**
- Automatically managed by `setup-java@v4`
- Based on `pom.xml` checksum
- Invalidated when dependencies change

#### Node.js Services - npm Cache

```yaml
- name: Set up Node.js 18
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
    cache-dependency-path: backend-services/${{ matrix.service }}/package-lock.json
```

**Benefits:**
- Reduces `npm ci` time from ~1-3 minutes to ~10-20 seconds
- Faster installs with cached `node_modules`
- Uses `package-lock.json` for cache key generation

**Manual Cache (Advanced):**
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: |
      backend-services/${{ matrix.service }}/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('backend-services/${{ matrix.service }}/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2. Concurrency Control

#### Current Implementation

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Benefits:**
- Prevents duplicate runs on same branch
- Cancels outdated runs when new commits pushed
- Saves CI minutes

**Use Cases:**
- Developer pushes multiple commits quickly
- Re-running failed workflows
- Avoiding redundant builds

### 3. Path-Based Filtering

#### Optimize Workflow Triggers

```yaml
on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend-services/**'
      - '.github/workflows/backend-ci.yml'
      - '!backend-services/**/*.md'  # Exclude markdown changes
```

**Benefits:**
- Workflows only run when relevant files change
- Documentation changes don't trigger builds
- Faster feedback loop

**Implementation Considerations:**
- Can be too restrictive if services depend on shared code
- Requires careful path specification
- May miss indirect dependencies

### 4. Conditional Job Execution

#### Skip Unnecessary Jobs

```yaml
jobs:
  java-services:
    if: |
      github.event_name == 'pull_request' &&
      contains(github.event.pull_request.head.ref, 'feature/java')
```

**Use Cases:**
- Skip frontend tests when only backend changes
- Skip security scans for documentation PRs
- Environment-specific job execution

### 5. Matrix Strategy Optimization

#### Current: All Services Run

```yaml
strategy:
  matrix:
    service: [auth-service, profile-service, leaderboard-service]
```

#### Optimized: Changed Services Only

```yaml
jobs:
  detect-changes:
    outputs:
      services: ${{ steps.filter.outputs.services }}
    steps:
      - name: Detect changed services
        id: filter
        run: |
          # Detect which services changed
          changed=$(git diff --name-only ${{ github.event.before }}..${{ github.sha }})
          services=""
          [[ "$changed" =~ auth-service ]] && services+="auth-service "
          [[ "$changed" =~ profile-service ]] && services+="profile-service "
          [[ "$changed" =~ leaderboard-service ]] && services+="leaderboard-service "
          echo "services=$services" >> $GITHUB_OUTPUT

  java-services:
    needs: detect-changes
    if: needs.detect-changes.outputs.services != ''
    strategy:
      matrix:
        service: ${{ fromJson(format('["{0}"]', join(split(needs.detect-changes.outputs.services, ' '), '","'))) }}
```

**Benefits:**
- Only test changed services
- Significant time savings for small PRs
- Still ensures full test coverage on main/develop

**Trade-offs:**
- More complex workflow
- Requires careful change detection
- May miss indirect dependencies

### 6. Fail-Fast Strategy

#### Current: `fail-fast: false`

```yaml
strategy:
  fail-fast: false
```

**Benefits:**
- Complete visibility into all service statuses
- All failures visible at once
- Better for debugging multiple issues

#### Alternative: `fail-fast: true`

**Benefits:**
- Faster feedback on first failure
- Saves CI minutes when failure is certain
- Reduces noise from cascading failures

**Recommendation:**
- Use `fail-fast: false` for production/merge workflows
- Use `fail-fast: true` for development/experimental workflows

### 7. Test Execution Optimization

#### Parallel Test Execution

**Java (Maven Surefire):**
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <configuration>
    <parallel>methods</parallel>
    <threadCount>4</threadCount>
  </configuration>
</plugin>
```

**Node.js (Jest):**
```json
{
  "jest": {
    "maxWorkers": "50%",
    "testTimeout": 10000
  }
}
```

**Angular (Karma):**
```javascript
config.set({
  concurrency: 2,
  singleRun: true
});
```

### 8. Artifact Optimization

#### Selective Artifact Upload

```yaml
- name: Upload coverage reports
  uses: actions/upload-artifact@v4
  with:
    name: coverage-${{ matrix.service }}
    path: |
      coverage/lcov.info
      !coverage/**/*.html  # Exclude HTML reports (large files)
    retention-days: 30
    compression-level: 9  # Maximum compression
```

**Benefits:**
- Reduces artifact storage usage
- Faster upload/download times
- Lower storage costs

### 9. Dependency Scanning Optimization

#### Cache Dependency Check Database

```yaml
- name: Cache OWASP Dependency Check DB
  uses: actions/cache@v4
  with:
    path: ~/.m2/repository/org/owasp/dependency-check-data
    key: dependency-check-db-${{ hashFiles('**/pom.xml') }}
    restore-keys: dependency-check-db-
```

**Benefits:**
- OWASP Dependency Check downloads vulnerability database (~100MB)
- Caching saves ~30-60 seconds per scan
- Updates database weekly or on cache miss

### 10. Workflow Reusability

#### Reusable Workflows

Create `.github/workflows/reusable-backend-ci.yml`:

```yaml
name: Reusable Backend CI

on:
  workflow_call:
    inputs:
      service:
        required: true
        type: string

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      # Reusable steps
```

**Benefits:**
- DRY principle
- Centralized workflow logic
- Easier maintenance
- Consistent CI behavior

## Performance Metrics

### Current Workflow Times (Estimated)

| Workflow | Jobs | Estimated Time | Optimized Time |
|----------|------|----------------|----------------|
| Backend CI | 5 | ~8-12 min | ~5-8 min |
| Frontend CI | 1 | ~4-6 min | ~3-4 min |
| Security | 9 | ~10-15 min | ~7-10 min |

### Optimization Impact

| Optimization | Time Savings | Complexity |
|--------------|--------------|------------|
| Dependency Caching | 30-50% | Low |
| Path Filtering | 20-40% | Medium |
| Changed Services Only | 40-60% | High |
| Parallel Tests | 20-30% | Low |
| Artifact Optimization | 10-20% | Low |

## Cost Considerations

### GitHub Actions Pricing (Public Repos)
- **Free**: Unlimited minutes for public repos
- **Private**: 2,000 minutes/month free, then $0.008/minute

### Cost Optimization

1. **Use Self-Hosted Runners** (if available)
   - Free compute
   - Faster execution
   - More control

2. **Optimize Workflow Triggers**
   - Avoid unnecessary runs
   - Use path filtering

3. **Cache Aggressively**
   - Reduce download time
   - Save bandwidth costs

4. **Set Timeout Limits**
   ```yaml
   jobs:
     test:
       timeout-minutes: 30
   ```

## Monitoring and Metrics

### Workflow Duration Tracking

```yaml
- name: Record workflow duration
  if: always()
  run: |
    echo "Duration: $((${{ github.run_duration }} / 60)) minutes"
```

### Artifact Size Tracking

```yaml
- name: Report artifact sizes
  run: |
    du -sh coverage/ || true
    du -sh dist/ || true
```

## Best Practices Summary

1. ✅ **Cache Everything Possible**: Dependencies, build artifacts, databases
2. ✅ **Use Concurrency Control**: Prevent duplicate runs
3. ✅ **Optimize Test Execution**: Parallel tests, selective execution
4. ✅ **Artifact Optimization**: Upload only necessary files
5. ✅ **Fail-Fast Appropriately**: Balance speed vs. completeness
6. ✅ **Path Filtering**: Skip workflows on irrelevant changes
7. ✅ **Monitor Performance**: Track duration and costs
8. ✅ **Reusable Workflows**: DRY principle for consistency

## Future Enhancements

### 1. **Self-Hosted Runners**
- Faster execution
- Cost savings for private repos
- Custom hardware/software

### 2. **Workflow Visualization**
- Dependency graphs
- Duration trends
- Cost tracking

### 3. **Smart Test Selection**
- Only run tests affected by changes
- Test impact analysis

### 4. **Progressive Testing**
- Quick smoke tests first
- Full suite after smoke tests pass

---

**Related Files:**
- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`
- `.github/workflows/security.yml`

---

**Last Updated:** 2024  
**Status:** Active

