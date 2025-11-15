# CI/CD Pipeline Tech Notes

Quick reference for our GitHub Actions CI/CD setup.

## Workflow Structure

### Backend CI (`backend-ci.yml`)
- **Java Services**: Runs Maven tests, generates JaCoCo coverage, builds JARs
- **Node.js Services**: Runs npm tests, generates coverage reports
- Uses matrix strategy to run all services in parallel

### Frontend CI (`frontend-ci.yml`)
- Runs ESLint, Prettier checks
- Runs Karma/Jasmine tests with coverage
- Builds production Angular app

### Security Scanning (`security.yml`)
- **Dependency Scanning**: OWASP Dependency-Check (Java), npm audit (Node.js/Frontend)
- **SAST**: CodeQL analysis for Java and JavaScript
- **License Compliance**: Checks for acceptable licenses (MIT, Apache-2.0, BSD, ISC)
- Runs on PRs, pushes, and weekly schedule

### SonarCloud Analysis (`sonarcloud.yml`)
- Analyzes all services (Java, Node.js, Frontend)
- Integrates coverage reports from tests
- Enforces quality gates
- Single project key: `Buffden_battle-arena`

## Key Concepts

### Matrix Strategy
Runs the same job across multiple services in parallel:
```yaml
strategy:
  matrix:
    service: [auth-service, profile-service, leaderboard-service]
```

### Coverage Reports
- **Java**: JaCoCo XML reports → `target/site/jacoco/jacoco.xml`
- **Node.js/Frontend**: LCOV reports → `coverage/lcov.info`
- Uploaded as artifacts (30-day retention)

### Security Scanning
- **OWASP Dependency-Check**: Scans Java dependencies for CVSS vulnerabilities (fails on CVSS ≥ 7.0)
- **npm audit**: Scans Node.js dependencies
- **CodeQL**: Static analysis for security issues

### SonarCloud Setup
- Project key: `Buffden_battle-arena` (single project)
- Modules: Each service is analyzed as a separate module (auth-service, profile-service, etc.)
- Organization: `Buffden`
- Requires `SONAR_TOKEN` secret in GitHub
- Quality gates block PRs if standards aren't met
- **Module Analysis**: View individual service metrics in SonarCloud dashboard under "Modules"

## Common Issues

**Workflow not running?**
- Check branch name (must be `main` or `develop`)
- Check file paths match workflow triggers

**Coverage not showing?**
- Ensure tests generate coverage reports
- Check coverage file paths match workflow configuration

**SonarCloud failing?**
- Verify `SONAR_TOKEN` secret is set
- Check project key matches: `Buffden_battle-arena`
- Ensure at least one analysis has completed

## Optimization Tips

- **Caching**: Dependencies are cached automatically (Maven, npm)
- **Parallel Execution**: Matrix strategy runs services in parallel
- **Fail-fast**: Disabled to see all failures, not just the first one
- **Artifact Retention**: Coverage (30 days), Security reports (90 days), Builds (7 days)

