# GitHub Actions Matrix Strategy

## Overview

The GitHub Actions matrix strategy allows running a single job multiple times with different variable values. This is essential for testing multiple services or configurations in parallel.

## Implementation in Backend CI

### Java Services Matrix

```yaml
java-services:
  strategy:
    fail-fast: false
    matrix:
      service: [auth-service, profile-service, leaderboard-service]
```

**Key Concepts:**
- **Matrix Variables**: `service` is a matrix variable that iterates over each value
- **Parallel Execution**: Each service runs in parallel, reducing total CI time
- **Fail-Fast Control**: `fail-fast: false` allows all matrix jobs to complete even if one fails

### Node.js Services Matrix

```yaml
nodejs-services:
  strategy:
    fail-fast: false
    matrix:
      service: [matchmaking-service, game-engine]
```

## Benefits

### 1. **Parallel Execution**
- All services tested simultaneously
- Reduces total CI time from sequential sum to maximum single job time

### 2. **Code Reusability**
- Single job definition for multiple services
- DRY principle: Don't Repeat Yourself
- Easier maintenance - update once, applies to all

### 3. **Independent Results**
- Each service has independent test results
- Failed service doesn't block others
- Clear visibility into which service failed

### 4. **Scalability**
- Easy to add new services: just add to matrix array
- No need to duplicate job definitions

## Matrix Variable Usage

### Accessing Matrix Variables

```yaml
defaults:
  run:
    working-directory: backend-services/${{ matrix.service }}
```

**Usage Patterns:**
- `${{ matrix.service }}` - Access current matrix value
- Used in paths, artifact names, job names
- Can create dependent variables

### Dynamic Matrix (Advanced)

For future enhancements, matrices can be generated dynamically:

```yaml
strategy:
  matrix:
    service: ${{ fromJson(needs.setup.outputs.services) }}
```

## Fail-Fast Strategy

### Current Configuration: `fail-fast: false`

**Rationale:**
- Provides complete visibility into all service statuses
- Developers can see all failures at once
- Better for debugging multiple service issues

**Alternative: `fail-fast: true`**

**Use When:**
- Want to stop immediately on first failure
- Reduce CI minutes consumed
- Failures are typically isolated

## Matrix Job Naming

GitHub Actions automatically generates job names:
- `java-services (auth-service)`
- `java-services (profile-service)`
- `java-services (leaderboard-service)`

**Custom Names:**
```yaml
name: Java Services CI - ${{ matrix.service }}
```

## Dependencies and Needs

### Independent Jobs
```yaml
jobs:
  java-services:
    # ... runs independently
  
  nodejs-services:
    # ... runs independently
```

### Dependent Jobs
```yaml
build-summary:
  needs: [java-services, nodejs-services]
  if: always()  # Run even if dependencies fail
```

## Best Practices

### 1. **Service-Specific Configuration**
Use matrix variables to configure per-service settings:
```yaml
matrix:
  include:
    - service: auth-service
      java-version: '17'
    - service: profile-service
      java-version: '17'
```

### 2. **Artifact Naming**
Include matrix variables in artifact names for clarity:
```yaml
name: coverage-java-${{ matrix.service }}-${{ github.sha }}
```

### 3. **Conditional Steps**
Use matrix values for conditional logic:
```yaml
- name: Service-specific step
  if: matrix.service == 'auth-service'
  run: # auth-service specific command
```

## Limitations and Considerations

### 1. **GitHub Actions Limits**
- Maximum 256 matrix jobs per workflow run
- Current implementation: 3 Java + 2 Node.js = 5 jobs (well within limits)

### 2. **Runner Availability**
- Parallel jobs consume multiple runners
- May need to scale self-hosted runners for faster execution

### 3. **Cost Considerations**
- Each matrix job consumes CI minutes
- Parallel execution increases concurrent usage
- Balance between speed and cost

## Future Enhancements

### 1. **Cross-Matrix Testing**
Test services against multiple configurations:
```yaml
matrix:
  service: [auth-service, profile-service]
  java-version: ['17', '21']
```

### 2. **Exclude Combinations**
Skip specific combinations:
```yaml
matrix:
  service: [auth-service, profile-service]
  test-type: [unit, integration]
  exclude:
    - service: auth-service
      test-type: integration
```

### 3. **Dynamic Matrix Generation**
Generate matrix from repository contents or API responses

## Troubleshooting

### Issue: Matrix job fails but others succeed
**Solution**: Check service-specific logs using `${{ matrix.service }}` in artifact names

### Issue: Matrix job times out
**Solution**: Increase timeout per job or optimize test execution

### Issue: Need to skip specific matrix combinations
**Solution**: Use `exclude` in matrix configuration

---

**Related Files:**
- `.github/workflows/backend-ci.yml`
- [GitHub Actions Documentation - Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)

---

**Last Updated:** 2024  
**Status:** Active

