# SonarCloud Coverage Report Setup

This document describes how code coverage is configured and integrated with SonarCloud for the Battle Arena project.

## Overview

SonarCloud automatically imports code coverage reports from our CI/CD pipeline to provide comprehensive code quality metrics including coverage percentages, uncovered lines, and coverage trends.

## Coverage Tools by Service Type

### Java Services (auth-service, profile-service, leaderboard-service)

**Tool:** JaCoCo (Java Code Coverage)

**Configuration:**

- JaCoCo Maven plugin configured in `pom.xml`
- Coverage threshold: 80% line coverage
- Report format: XML (for SonarCloud) and HTML (for local viewing)

**Coverage Report Location:**

- `target/site/jacoco/jacoco.xml` - XML report for SonarCloud
- `target/site/jacoco/index.html` - HTML report for local viewing

**CI/CD Integration:**

- Tests run with JaCoCo agent (automatically configured)
- Coverage report generated after tests
- SonarCloud imports: `target/site/jacoco/jacoco.xml`

**SonarCloud Configuration:**

```yaml
-Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

### Node.js Services (matchmaking-service, game-engine)

**Tool:** Jest with Istanbul/NYC

**Configuration:**

- Jest configured in `jest.config.js`
- Coverage reporters: `text`, `lcov`, `html`
- Coverage directory: `coverage/`

**Coverage Report Location:**

- `coverage/lcov.info` - LCOV report for SonarCloud
- `coverage/index.html` - HTML report for local viewing

**CI/CD Integration:**

- Tests run with `npm run test:coverage`
- LCOV report generated automatically
- SonarCloud imports: `coverage/lcov.info`

**SonarCloud Configuration:**

```yaml
-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### Angular Frontend (frontend-service)

**Tool:** Karma with Istanbul

**Configuration:**

- Karma configured in `karma.conf.js`
- Coverage reporter: LCOV format
- Coverage threshold: 80% (statements, branches, functions, lines)

**Coverage Report Location:**

- `coverage/lcov.info` - LCOV report for SonarCloud
- `coverage/index.html` - HTML report for local viewing

**CI/CD Integration:**

- Tests run with `npm run test:coverage`
- LCOV report generated automatically
- SonarCloud imports: `coverage/lcov.info`

**SonarCloud Configuration:**

```yaml
-Dsonar.typescript.lcov.reportPaths=coverage/lcov.info
```

## CI/CD Workflow

### SonarCloud Analysis Workflow

**File:** `.github/workflows/sonarcloud.yml`

**Process:**

1. **Build** - Compile/build the project
2. **Run Tests** - Execute tests with coverage collection enabled
3. **Generate Coverage Report** - Create coverage reports in required formats
4. **Verify Reports** - Check that coverage reports exist
5. **SonarCloud Scan** - Upload coverage reports to SonarCloud

### Coverage Report Generation

**Java Services:**

```bash
mvn clean compile        # Build project
mvn test                # Run tests (JaCoCo agent collects coverage)
mvn jacoco:report       # Generate XML and HTML reports
```

**Node.js Services:**

```bash
npm ci                  # Install dependencies
npm run test:coverage   # Run tests and generate LCOV report
```

**Frontend:**

```bash
npm ci                  # Install dependencies
npm run test:coverage   # Run tests and generate LCOV report
```

## Viewing Coverage in SonarCloud

### Dashboard

1. Navigate to SonarCloud project: `Buffden_battle-arena`
2. Go to **Measures** → **Coverage**
3. View overall coverage percentage and trends

### Module-Level Coverage

1. In SonarCloud dashboard, click on **Modules**
2. Select individual service (auth-service, profile-service, etc.)
3. View service-specific coverage metrics

### Coverage Details

- **Coverage**: Overall line coverage percentage
- **Uncovered Lines**: Lines not covered by tests
- **Coverage on New Code**: Coverage for new/changed code
- **Coverage Trends**: Historical coverage over time

## Coverage Thresholds

### Target Coverage

- **Minimum Target**: 80% line coverage
- **Enforcement**: Configured in build tools (JaCoCo, Jest, Karma)
- **Quality Gate**: SonarCloud quality gates can enforce coverage thresholds

### Current Thresholds

**Java Services:**

- Line coverage: 80% minimum (configured in `pom.xml`)

**Node.js Services:**

- Coverage thresholds can be configured in `jest.config.js`

**Frontend:**

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Configured in `karma.conf.js`

## Troubleshooting

### Coverage Not Appearing in SonarCloud

**Check:**

1. Coverage reports are generated in CI/CD
2. Report paths are correct in SonarCloud configuration
3. Reports exist before SonarCloud scan runs
4. File permissions allow SonarCloud to read reports

**Common Issues:**

- Tests not running (coverage reports won't be generated)
- Wrong report path in SonarCloud configuration
- Reports generated after SonarCloud scan
- Coverage reports in wrong format

### Java Services - No Coverage

**Solution:**

- Ensure tests run: `mvn test` (not `mvn package -DskipTests`)
- Verify JaCoCo plugin is configured in `pom.xml`
- Check that `target/site/jacoco/jacoco.xml` exists

### Node.js/Frontend - No Coverage

**Solution:**

- Ensure `npm run test:coverage` runs successfully
- Verify Jest/Karma is configured to generate LCOV reports
- Check that `coverage/lcov.info` exists

## Local Testing

### Generate Coverage Reports Locally

**Java Services:**

```bash
cd backend-services/auth-service
mvn clean test jacoco:report
# View: target/site/jacoco/index.html
```

**Node.js Services:**

```bash
cd backend-services/matchmaking-service
npm run test:coverage
# View: coverage/index.html
```

**Frontend:**

```bash
cd frontend-service
npm run test:coverage
# View: coverage/index.html
```

## Related Documentation

- [CI/CD Workflows](../.github/workflows/README.md) - CI/CD pipeline documentation
- [Testing Strategy](../02-ARCHITECTURE/LOW_LEVEL_DESIGN/COMMON/TESTING_STRATEGY.md) - Testing approach and coverage targets
- [SonarCloud Setup](../.github/workflows/README.md#sonarcloud-analysis-workflow) - SonarCloud configuration
