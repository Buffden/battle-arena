# SonarCloud Setup Guide

## Quick Start

### Step 1: Create SonarCloud Account

1. Go to https://sonarcloud.io
2. Sign up with GitHub account
3. Authorize SonarCloud to access your repositories

### Step 2: Create Organization

1. Go to SonarCloud dashboard
2. Create a new organization (or use existing)
3. Note the organization key (e.g., `your-org-key`)

### Step 3: Create Projects

Create a project for each service in SonarCloud:

1. **Java Services**:
   - `battle-arena-auth-service`
   - `battle-arena-profile-service`
   - `battle-arena-leaderboard-service`

2. **Node.js Services**:
   - `battle-arena-matchmaking-service`
   - `battle-arena-game-engine`

3. **Frontend**:
   - `battle-arena-frontend`

**Project Key Format**: `{SONAR_PROJECT_KEY_PREFIX}-{service-name}`

### Step 4: Generate SonarCloud Token

1. Go to SonarCloud → My Account → Security
2. Generate a new token
3. Copy the token (you'll need it for GitHub secrets)

### Step 5: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. **SONAR_TOKEN**: SonarCloud authentication token
2. **SONAR_ORGANIZATION**: SonarCloud organization key
3. **SONAR_PROJECT_KEY_PREFIX**: Project key prefix (e.g., `battle-arena`)

**How to add secrets**:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

### Step 6: Enable SonarCloud Integration

1. Go to SonarCloud → Administration → GitHub
2. Enable GitHub integration
3. Configure repository access

### Step 7: Configure Quality Gates

1. Go to SonarCloud → Quality Gates
2. Configure quality gate rules:
   - Coverage threshold: 80%
   - Security rating: A
   - Reliability rating: A
   - Maintainability rating: A
   - Duplicated lines: < 3%
   - Technical debt: < 5%

### Step 8: Test the Workflow

1. Push a commit to trigger the workflow
2. Check SonarCloud dashboard for analysis results
3. Verify quality gate status in PRs

## Configuration

### Project Keys

Each service needs a unique project key in SonarCloud:

- **Format**: `{SONAR_PROJECT_KEY_PREFIX}-{service-name}`
- **Example**: `battle-arena-auth-service`

### Coverage Configuration

#### Java Services (JaCoCo)

```xml
<!-- pom.xml -->
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
  </executions>
</plugin>
```

#### Node.js Services (Istanbul/NYC)

```json
{
  "scripts": {
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "coverageReporters": ["lcov", "text"]
  }
}
```

#### Frontend (Karma)

```javascript
// karma.conf.js
coverageIstanbulReporter: {
  reports: ['html', 'lcovonly', 'text-summary'],
  fixWebpackSourcePaths: true
}
```

## Quality Gates

### Default Quality Gate

SonarCloud provides a default quality gate with:
- Coverage threshold: 80%
- Security rating: A
- Reliability rating: A
- Maintainability rating: A

### Custom Quality Gate

Create a custom quality gate:

1. Go to SonarCloud → Quality Gates
2. Create a new quality gate
3. Configure rules:
   - Coverage: ≥ 80%
   - Security: A rating
   - Reliability: A rating
   - Maintainability: A rating
   - Duplicated lines: < 3%
   - Technical debt: < 5%

## PR Integration

SonarCloud automatically:
- Comments on PRs with analysis results
- Shows quality gate status
- Highlights new issues
- Shows coverage changes

## Troubleshooting

### Issue: SonarCloud scan fails

**Solution**:
- Check SonarCloud token is correct
- Verify organization key is correct
- Check project keys match SonarCloud projects
- Verify coverage reports are generated

### Issue: Coverage not showing

**Solution**:
- Verify coverage reports are generated
- Check coverage report paths in workflow
- Verify coverage format is correct (LCOV for Node.js, JaCoCo for Java)

### Issue: Quality gate fails

**Solution**:
- Check quality gate rules
- Review analysis results in SonarCloud
- Fix code quality issues
- Increase coverage if needed

### Issue: PR comments not showing

**Solution**:
- Verify GitHub integration is enabled
- Check GITHUB_TOKEN is set
- Verify SonarCloud has repository access

## Best Practices

1. **Coverage Threshold**: Set to 80% minimum
2. **Quality Gates**: Enforce quality standards
3. **PR Comments**: Enable for better visibility
4. **Historical Tracking**: Monitor quality trends
5. **Technical Debt**: Track and reduce debt

## Cost

### SonarCloud Pricing

- **Public Repos**: Free (unlimited)
- **Private Repos**: 
  - Free tier: 1 project, 20k lines of code
  - Paid: $10/month per developer (unlimited projects)

### SonarQube Self-Hosted

- **Community Edition**: Free (open source)
- **Developer Edition**: $150/year per developer
- **Enterprise Edition**: Custom pricing

## Related Documentation

- [SonarQube Integration Analysis](./07-SONARQUBE_INTEGRATION.md)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarCloud GitHub Action](https://github.com/SonarSource/sonarcloud-github-action)

---

**Last Updated:** 2024  
**Status:** Active

