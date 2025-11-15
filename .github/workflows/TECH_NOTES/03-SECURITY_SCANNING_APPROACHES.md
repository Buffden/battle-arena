# Security Scanning Approaches

## Overview

This document explains the multi-layered security scanning approach implemented in the CI/CD pipeline, including dependency scanning, SAST (Static Application Security Testing), and license compliance checking.

## Security Scanning Layers

### 1. Dependency Vulnerability Scanning
### 2. Static Application Security Testing (SAST)
### 3. License Compliance Checking

---

## Layer 1: Dependency Vulnerability Scanning

### Purpose
Identify known vulnerabilities in third-party dependencies and libraries.

### Implementation

#### Java Services - OWASP Dependency-Check

**Tool**: [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)

**Configuration:**
```yaml
- name: Run OWASP Dependency Check
  uses: dependency-check/Dependency-Check_Action@main
  with:
    project: '${{ matrix.service }}'
    path: '.'
    format: 'HTML'
    args: >
      --failOnCVSS 7
      --enableRetired
    generateSARIF: 'true'
```

**Key Features:**
- Scans Maven dependencies
- CVSS (Common Vulnerability Scoring System) based severity
- Fails build on CVSS ≥ 7.0 (High/Critical)
- Generates SARIF format for GitHub Security tab
- Includes retired vulnerabilities for comprehensive analysis

**Output Formats:**
- **HTML Report**: Detailed vulnerability report
- **SARIF**: Integration with GitHub Security tab
- **JSON**: Machine-readable format

**Severity Levels:**
- **Critical (9.0-10.0)**: Immediate action required
- **High (7.0-8.9)**: Should be fixed promptly
- **Medium (4.0-6.9)**: Should be addressed
- **Low (0.1-3.9)**: Consider fixing

#### Node.js Services - npm audit

**Tool**: Built-in npm audit

**Configuration:**
```yaml
- name: Run npm audit
  run: |
    npm audit --audit-level=moderate --json > npm-audit-report.json || true
    npm audit --audit-level=moderate
```

**Key Features:**
- Native npm command, no additional setup
- Scans package.json dependencies
- Reports vulnerabilities with severity levels
- Automatic fix suggestions with `npm audit fix`

**Severity Levels:**
- **Critical**: Immediate action required
- **High**: Fix promptly
- **Moderate**: Should be addressed
- **Low**: Consider fixing

**Enforcement:**
```yaml
- name: Check for critical vulnerabilities
  run: |
    CRITICAL=$(jq -r '.metadata.vulnerabilities.critical // 0' npm-audit-report.json)
    HIGH=$(jq -r '.metadata.vulnerabilities.high // 0' npm-audit-report.json)
    
    if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
      echo "⚠️ Critical or High severity vulnerabilities found!"
      exit 1
    fi
```

---

## Layer 2: Static Application Security Testing (SAST)

### Purpose
Analyze source code for security vulnerabilities, coding errors, and security anti-patterns.

### Implementation - CodeQL

**Tool**: [GitHub CodeQL](https://codeql.github.com/)

**Configuration:**
```yaml
codeql-analysis:
  strategy:
    matrix:
      language: ['java', 'javascript']
  
  steps:
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: ${{ matrix.language }}
        queries: security-extended,security-and-quality
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
```

**Key Features:**
- Free for open-source projects
- Supports Java and JavaScript/TypeScript
- Multiple query suites:
  - **security-extended**: Additional security checks
  - **security-and-quality**: Security + code quality checks
- Results appear in GitHub Security tab
- SARIF format output

**Query Suites:**
- **Default**: Essential security queries
- **Security Extended**: Additional security-focused queries
- **Security and Quality**: Security + code quality queries

**Common Findings:**
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure cryptographic storage
- Hardcoded secrets
- Insecure deserialization
- Insecure random number generation

---

## Layer 3: License Compliance Checking

### Purpose
Ensure all dependencies use acceptable licenses and comply with organizational policies.

### Implementation

**Tool**: [license-checker](https://www.npmjs.com/package/license-checker)

**Configuration:**
```yaml
- name: Check Node.js service licenses
  run: |
    license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD"
```

**Allowed Licenses:**
- **MIT**: Permissive, widely used
- **Apache-2.0**: Permissive, patent grant
- **BSD-2-Clause**: Permissive
- **BSD-3-Clause**: Permissive
- **ISC**: Permissive, simplified BSD
- **0BSD**: Public domain equivalent

**Why License Checking Matters:**
- Legal compliance
- Avoid GPL/LGPL copyleft restrictions
- Ensure license compatibility
- Protect intellectual property

**Blocked Licenses (examples):**
- **GPL**: Copyleft, requires source code distribution
- **AGPL**: Copyleft, requires source code even for SaaS
- **LGPL**: Lesser copyleft
- **Unlicense**: May have legal ambiguities

---

## Security Workflow Architecture

### Parallel Execution

All security scans run in parallel for efficiency:

```yaml
jobs:
  dependency-scanning-java: # Runs in parallel
  dependency-scanning-nodejs: # Runs in parallel
  dependency-scanning-frontend: # Runs in parallel
  codeql-analysis: # Runs in parallel
  license-compliance: # Runs in parallel
```

### Schedule-Based Scanning

Weekly scheduled scans for ongoing monitoring:

```yaml
on:
  schedule:
    - cron: '0 0 * * 1'  # Every Monday at 00:00 UTC
```

**Benefits:**
- Continuous security monitoring
- Detects vulnerabilities in dependencies over time
- Early warning system for new vulnerabilities

---

## Security Reporting

### Artifacts

All security reports are saved as artifacts:
- Retention: 90 days
- Accessible via GitHub Actions UI
- Downloadable for offline review

### GitHub Security Tab

- **CodeQL Results**: Automatic integration
- **Dependency-Check SARIF**: Manual upload or automatic
- **Dependency Alerts**: Automatic via Dependabot (if enabled)

### SARIF Format

**Benefits:**
- Standardized format
- GitHub Security tab integration
- IDE integration (VS Code, IntelliJ)
- Third-party tool compatibility

---

## Security Best Practices

### 1. **Fail Fast on Critical Issues**
```yaml
--failOnCVSS 7  # Fail on High/Critical vulnerabilities
```

### 2. **Include Retired Vulnerabilities**
```yaml
--enableRetired  # Check even retired CVEs
```

### 3. **Regular Updates**
- Schedule weekly scans
- Update security tools regularly
- Monitor security advisories

### 4. **Remediation Process**
1. **Identify**: Security scan identifies vulnerability
2. **Assess**: Determine severity and impact
3. **Plan**: Create remediation plan
4. **Fix**: Update dependency or apply patch
5. **Verify**: Re-run security scan to confirm fix

### 5. **Automated Dependency Updates**
Consider enabling:
- **Dependabot**: Automatic dependency updates
- **Renovate**: Alternative to Dependabot
- **GitHub Security Advisories**: Automatic alerts

---

## Integration with Development Workflow

### Pre-Merge Checks
- All security scans must pass before merge
- Critical vulnerabilities block PRs
- High vulnerabilities warn but may allow merge with approval

### PR Comments
- CodeQL results automatically comment on PRs
- Dependency check results can be integrated
- Security findings visible to reviewers

### Branch Protection
Require status checks to pass:
- `dependency-scanning-java`
- `dependency-scanning-nodejs`
- `dependency-scanning-frontend`
- `codeql-analysis`

---

## Troubleshooting

### Issue: False Positives
**Solution:**
- Review findings manually
- Suppress known false positives in tool configuration
- Document reasoning for suppression

### Issue: Dependency Updates Break Code
**Solution:**
- Test thoroughly before updating
- Use semantic versioning constraints
- Gradual updates, not all at once

### Issue: License Check Too Strict
**Solution:**
- Review license compatibility
- Add exceptions for specific packages if needed
- Document license compatibility rationale

### Issue: Security Scan Takes Too Long
**Solution:**
- Cache dependency check database
- Use incremental scans when possible
- Optimize query suites in CodeQL

---

## Future Enhancements

### 1. **Secret Scanning**
- GitHub Secret Scanning (automatic for public repos)
- GitLeaks or similar tools for private repos
- Pre-commit hooks for local scanning

### 2. **Container Image Scanning**
```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'your-image:tag'
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### 3. **Dynamic Application Security Testing (DAST)**
- OWASP ZAP scanning
- Runtime security testing
- API security testing

### 4. **Software Composition Analysis (SCA)**
- Snyk integration
- WhiteSource/Bearer integration
- Advanced dependency analysis

### 5. **Infrastructure as Code Scanning**
- Checkov for Terraform
- TFLint for Terraform
- Kube-score for Kubernetes manifests

---

**Related Files:**
- `.github/workflows/security.yml`
- [OWASP Dependency-Check Documentation](https://jeremylong.github.io/DependencyCheck/)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

**Last Updated:** 2024  
**Status:** Active

