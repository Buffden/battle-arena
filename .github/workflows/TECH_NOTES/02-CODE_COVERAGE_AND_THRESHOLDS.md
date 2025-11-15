# Code Coverage and Thresholds

## Overview

Code coverage measures how much of the codebase is executed by tests. This document explains the coverage setup for Java (JaCoCo), Node.js (Istanbul/NYC), and Angular (Karma), and how to enforce coverage thresholds.

## Coverage Targets

**Project Requirement:** 80%+ code coverage threshold

### Coverage Metrics
- **Line Coverage**: Percentage of executable lines covered
- **Branch Coverage**: Percentage of conditional branches covered
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

## Java Services - JaCoCo

### Setup in pom.xml

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.11</version>
  <executions>
    <execution>
      <id>prepare-agent</id>
      <goals>
        <goal>prepare-agent</goal>
      </goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals>
        <goal>report</goal>
      </goals>
    </execution>
    <execution>
      <id>check</id>
      <goals>
        <goal>check</goal>
      </goals>
      <configuration>
        <rules>
          <rule>
            <element>PACKAGE</element>
            <limits>
              <limit>
                <counter>LINE</counter>
                <value>COVEREDRATIO</value>
                <minimum>0.80</minimum>
              </limit>
              <limit>
                <counter>BRANCH</counter>
                <value>COVEREDRATIO</value>
                <minimum>0.75</minimum>
              </limit>
            </limits>
          </rule>
        </rules>
      </configuration>
    </execution>
  </executions>
</plugin>
```

### Coverage Report Generation

```bash
mvn jacoco:report
```

**Report Location:** `target/site/jacoco/index.html`

### Enforcing Thresholds

The `check` goal fails the build if thresholds aren't met:
```bash
mvn jacoco:check
```

## Node.js Services - Istanbul/NYC

### Setup in package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:coverage:check": "jest --coverage --coverageThreshold='{\"global\":{\"branches\":80,\"functions\":80,\"lines\":80,\"statements\":80}}'"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Coverage Report Generation

```bash
npm run test:coverage
```

**Report Location:** `coverage/` directory

### Report Formats
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **Text**: Console output
- **JSON**: `coverage/coverage-final.json`

## Angular Frontend - Karma Coverage

### Setup in karma.conf.js

```javascript
module.exports = function (config) {
  config.set({
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 75,
        functions: 80
      },
      check: {
        emitWarning: false,
        global: {
          statements: 80,
          lines: 80,
          branches: 75,
          functions: 80
        }
      }
    }
  });
};
```

### Coverage Report Generation

```bash
ng test --code-coverage
# or
npm run test:coverage
```

**Report Location:** `coverage/` directory

## CI/CD Integration

### Current Implementation

The workflows currently:
1. Generate coverage reports
2. Upload as artifacts
3. Display basic coverage information

### Future Enhancement: Strict Threshold Enforcement

To enforce thresholds in CI:

#### Java Services
```yaml
- name: Check coverage threshold
  run: mvn jacoco:check
  continue-on-error: false
```

#### Node.js Services
```yaml
- name: Check coverage threshold
  run: npm run test:coverage:check
  continue-on-error: false
```

#### Angular Frontend
```yaml
- name: Check coverage threshold
  run: npm test -- --code-coverage --watch=false
  continue-on-error: false
  # Karma will fail if thresholds not met
```

## Coverage Upload to Codecov

### Integration with Codecov

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    fail_ci_if_error: true
    token: ${{ secrets.CODECOV_TOKEN }} # Optional, for private repos
```

### Benefits
- Historical coverage tracking
- Coverage badges
- PR comments with coverage changes
- Coverage visualization

## Coverage Best Practices

### 1. **Focus on Quality, Not Just Percentage**
- 80% coverage of critical paths > 90% coverage of trivial code
- Prioritize testing business logic and edge cases

### 2. **Exclude Generated Code**
- JaCoCo: Exclude Lombok generated code
- Istanbul: Exclude node_modules and build artifacts
- Karma: Exclude third-party libraries

### 3. **Coverage Reports in PRs**
- Use codecov or similar tools for PR comments
- Highlight coverage changes in PR description

### 4. **Incremental Coverage**
- Allow coverage to decrease gradually
- Set stricter thresholds for new code
- Legacy code can have lower thresholds initially

### 5. **Coverage Metrics**
- **Minimum**: Lines and statements (80%)
- **Good**: Include branches (75%)
- **Excellent**: Include functions (80%)

## Troubleshooting

### Issue: Coverage threshold too strict
**Solution**: 
- Gradually increase thresholds
- Start with 60%, increase to 80% over time
- Use different thresholds for different modules

### Issue: Coverage decreases on refactoring
**Solution**:
- Refactoring may improve code without affecting coverage
- Focus on maintaining or improving coverage for new code
- Allow temporary decreases if refactoring improves code quality

### Issue: Generated code counted in coverage
**Solution**:
- Configure exclusions in coverage tool
- JaCoCo: Exclude Lombok, MapStruct generated code
- Istanbul: Exclude build directories

### Issue: Coverage reports not generated
**Solution**:
- Verify test execution completed successfully
- Check report output directory
- Ensure coverage plugin/package is configured correctly

## Coverage Exclusion Patterns

### Java (JaCoCo)
```xml
<configuration>
  <excludes>
    <exclude>**/generated/**</exclude>
    <exclude>**/dto/**</exclude>
    <exclude>**/entity/**</exclude>
  </excludes>
</configuration>
```

### Node.js (Jest/Istanbul)
```javascript
coveragePathIgnorePatterns: [
  '/node_modules/',
  '/dist/',
  '/build/',
  '/coverage/'
]
```

### Angular (Karma)
```javascript
coverageIstanbulReporter: {
  skipFilesWithNoCoverage: true,
  instrumenterOptions: {
    istanbul: {
      noCompact: true
    }
  }
}
```

## Future Enhancements

### 1. **Coverage Quality Gates**
- Enforce coverage for new code only (differential coverage)
- Use tools like Codecov or SonarQube

### 2. **Coverage Visualization**
- Integrate with SonarQube for advanced analysis
- Coverage trend visualization

### 3. **Mutation Testing**
- Complement coverage with mutation testing
- Tools: PIT (Java), Stryker (JavaScript/TypeScript)

---

**Related Files:**
- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`
- Service-specific `pom.xml` or `package.json` files

---

**Last Updated:** 2024  
**Status:** Active

