# SonarCloud Badges for GitHub README

## Overview

This guide explains how to add SonarCloud badges to your GitHub repository README.md, similar to how Bitbucket displays code quality badges.

## Quick Start (5 Minutes)

### Step 0: Prerequisites

- SonarCloud account created
- Projects created in SonarCloud for each service
- At least one SonarCloud analysis completed

### Step 1: Get Your SonarCloud Project Keys

#### Method 1: From SonarCloud URL (Easiest)

1. Go to https://sonarcloud.io
2. Navigate to your project dashboard
3. Look at the URL - it will look like:
   ```
   https://sonarcloud.io/project/overview?id=your-org_battle-arena-auth-service
                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                      This is your project key!
   ```

#### Method 2: From SonarCloud Dashboard

1. Go to https://sonarcloud.io
2. Navigate to your project dashboard
3. Click on "Project Information" or "Administration"
4. Find "Project Key" section
5. Copy the project key (e.g., `your-org_battle-arena-auth-service`)

#### Method 3: From Project Settings

1. Go to SonarCloud → Your Project
2. Click on "Project Settings" (gear icon)
3. Click on "General Settings"
4. Find "Project Key" field
5. Copy the project key

**Project Key Format:**
- **Organization-based**: `{organization-key}_{project-key}` (e.g., `buffden_battle-arena-auth-service`)
- **User-based**: `{project-key}` (e.g., `battle-arena-auth-service`)

**Example Project Keys:**
- `buffden_battle-arena-auth-service`
- `buffden_battle-arena-profile-service`
- `buffden_battle-arena-leaderboard-service`
- `buffden_battle-arena-matchmaking-service`
- `buffden_battle-arena-game-engine`
- `buffden_battle-arena-frontend`

> **Note**: Replace `buffden` with your actual SonarCloud organization key or username.

### Step 2: Replace Placeholders in README.md

1. Open `README.md` in your repository
2. Find the `{YOUR_ORG}` placeholder
3. Replace `{YOUR_ORG}` with your actual SonarCloud organization key

**Example:**
```markdown
<!-- Before -->
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project={YOUR_ORG}_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id={YOUR_ORG}_battle-arena-auth-service)

<!-- After (if your org is 'buffden') -->
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=buffden_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=buffden_battle-arena-auth-service)
```

### Step 3: Verify Badges Work

1. Commit and push the changes to GitHub
2. View your README.md on GitHub
3. Check if badges display correctly
4. Click on badges to verify they link to SonarCloud dashboard

### Step 4: Get Badge URLs from SonarCloud (Alternative Method)

#### Method 1: From SonarCloud Dashboard

1. Go to your SonarCloud project
2. Click on "Project Information" or "Administration"
3. Scroll to "Badges" section
4. Copy the badge URLs

#### Method 2: Construct Badge URLs Manually

SonarCloud badge URLs follow this pattern:

```
https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric={metric}
```

### Step 3: Available Badge Metrics

| Metric | Description | Example URL |
|--------|-------------|-------------|
| `alert_status` | Quality Gate Status (Pass/Fail) | `...&metric=alert_status` |
| `coverage` | Code Coverage Percentage | `...&metric=coverage` |
| `bugs` | Number of Bugs | `...&metric=bugs` |
| `vulnerabilities` | Number of Vulnerabilities | `...&metric=vulnerabilities` |
| `code_smells` | Number of Code Smells | `...&metric=code_smells` |
| `security_rating` | Security Rating (A-E) | `...&metric=security_rating` |
| `reliability_rating` | Reliability Rating (A-E) | `...&metric=reliability_rating` |
| `sqale_rating` | Maintainability Rating (A-E) | `...&metric=sqale_rating` |
| `duplicated_lines_density` | Duplicated Lines Percentage | `...&metric=duplicated_lines_density` |
| `technical_debt` | Technical Debt (hours) | `...&metric=technical_debt` |

### Step 4: Add Badges to README.md

Add badges to your README.md using Markdown image syntax:

```markdown
![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=alert_status)
![Coverage](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=coverage)
![Security Rating](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=security_rating)
```

**Make badges clickable** (link to SonarCloud dashboard):

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=alert_status)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=coverage)](https://sonarcloud.io/summary/new_code?id={project-key})
```

## Badge Examples

### Single Service Badges

```markdown
## Auth Service

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
```

### Multiple Services (Horizontal Layout)

```markdown
### Backend Services

**Auth Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)

**Profile Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)
```

### Comprehensive Badge Set

```markdown
### Code Quality Metrics

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=alert_status)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=coverage)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=bugs)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=code_smells)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=security_rating)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id={project-key})
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project={project-key}&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id={project-key})
```

## Project Structure for Multiple Services

If you have multiple services, you have two options:

### Option 1: Individual Service Badges (Recommended)

Create separate badges for each service:

```markdown
### Backend Services

#### Java Services
**Auth Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)

**Profile Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)
```

### Option 2: Aggregate Project Badge

Create a single SonarCloud project that aggregates all services:

1. Create a new project in SonarCloud (e.g., `battle-arena`)
2. Configure it to analyze all services together
3. Use a single badge for the entire project

```markdown
## Overall Project Quality

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena)
```

## Getting Your Project Key

### From SonarCloud Dashboard

1. Go to https://sonarcloud.io
2. Navigate to your project
3. Click on "Project Information" or "Administration"
4. Find "Project Key" - it will look like:
   - `your-org_battle-arena-auth-service` (organization-based)
   - `battle-arena-auth-service` (user-based)

### From SonarCloud URL

The project key is in the SonarCloud URL:

```
https://sonarcloud.io/project/overview?id=your-org_battle-arena-auth-service
                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                      This is your project key
```

## Badge Colors

SonarCloud badges automatically change colors based on status:

- **Quality Gate**: 
  - 🟢 Green: Passed
  - 🔴 Red: Failed
- **Coverage**: 
  - 🟢 Green: ≥ 80%
  - 🟡 Yellow: 60-79%
  - 🔴 Red: < 60%
- **Security Rating**: 
  - 🟢 Green: A
  - 🟡 Yellow: B
  - 🟠 Orange: C
  - 🔴 Red: D, E

## Troubleshooting

### Issue: Badges Not Displaying

**Solution**:
- Verify project key is correct
- Check if project is public (private projects may require authentication)
- Verify SonarCloud analysis has run at least once
- Check badge URL syntax

### Issue: Badges Show "N/A"

**Solution**:
- Run SonarCloud analysis first
- Verify project exists in SonarCloud
- Check if project key matches SonarCloud project key

### Issue: Badges Not Updating

**Solution**:
- SonarCloud badges update after each analysis
- Check if CI/CD workflow is running SonarCloud analysis
- Verify SonarCloud analysis is successful

### Issue: Private Project Badges

**Solution**:
- For private projects, badges may require authentication
- Consider using SonarCloud public badges (if project is public)
- Use SonarCloud API with authentication token (advanced)

## Best Practices

1. **Use Clickable Badges**: Make badges link to SonarCloud dashboard
2. **Group Related Badges**: Group badges by service or metric type
3. **Use Consistent Format**: Use same badge format for all services
4. **Update After Analysis**: Badges update automatically after SonarCloud analysis
5. **Monitor Badge Status**: Check badge colors regularly for quality issues

## Alternative: Using Shields.io

If you want more control over badge appearance, you can use Shields.io with SonarCloud data:

```markdown
![Coverage](https://img.shields.io/sonar/coverage/{project-key}?server=https://sonarcloud.io)
![Quality Gate](https://img.shields.io/sonar/quality_gate/{project-key}?server=https://sonarcloud.io)
```

**Note**: Shields.io badges may have rate limits and may not update as frequently as SonarCloud badges.

## Example: Complete Badge Section

```markdown
## 🔍 Code Quality

### Overall Project
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena)

### Backend Services

#### Java Services
**Auth Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-auth-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-auth-service)

**Profile Service**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-profile-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-profile-service)

### Frontend
**Angular Frontend**
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=your-org_battle-arena-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=your-org_battle-arena-frontend)
```

## Related Documentation

- [SonarCloud Setup Guide](./SONARCLOUD_SETUP.md)
- [SonarQube Integration Analysis](./07-SONARQUBE_INTEGRATION.md)
- [SonarCloud Badge API Documentation](https://docs.sonarcloud.io/api-reference/badges/)

---

**Last Updated:** 2024  
**Status:** Active

