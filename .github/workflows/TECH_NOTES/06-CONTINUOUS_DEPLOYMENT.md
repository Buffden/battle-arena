# Continuous Deployment

## Overview

This document outlines the strategy for continuous deployment (CD) as part of the CI/CD pipeline. CD automates the deployment of applications to various environments after successful CI validation.

## Current Status

**Status**: Planned for future implementation (post-Story 1-3)  
**Related**: Deployment architecture and Docker image building

## Deployment Strategy

### Environments

1. **Development**
   - Branch: `develop`
   - Purpose: Integration testing
   - Auto-deploy: Yes

2. **Staging**
   - Branch: `main` (or dedicated `staging`)
   - Purpose: Pre-production testing
   - Auto-deploy: Yes

3. **Production**
   - Branch: `main` (with tags)
   - Purpose: Live environment
   - Auto-deploy: Manual approval required

## Deployment Workflow Architecture

### Workflow Stages

```
1. CI Validation (existing workflows)
   ↓
2. Docker Image Build
   ↓
3. Image Scanning
   ↓
4. Deploy to Development
   ↓
5. Smoke Tests
   ↓
6. Deploy to Staging (on main)
   ↓
7. Integration Tests
   ↓
8. Deploy to Production (manual approval)
   ↓
9. Post-Deployment Verification
```

## Deployment Targets

### Option 1: Kubernetes (Recommended for Production)

```yaml
name: Deploy to Kubernetes

on:
  workflow_run:
    workflows: ["Docker Build and Push"]
    types: [completed]

jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG_DEV }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/auth-service \
            auth-service=ghcr.io/${{ github.repository_owner }}/auth-service:${{ github.sha }} \
            -n battle-arena-dev
          
          kubectl rollout status deployment/auth-service -n battle-arena-dev
```

### Option 2: Docker Compose (Development/Staging)

```yaml
- name: Deploy with Docker Compose
  run: |
    docker-compose pull
    docker-compose up -d
    docker-compose ps
```

### Option 3: Cloud Provider Services

- **AWS**: ECS, EKS, App Runner
- **Azure**: AKS, Container Instances
- **GCP**: GKE, Cloud Run

## Deployment Workflow

### Development Deployment

```yaml
jobs:
  deploy-development:
    name: Deploy to Development
    runs-on: ubuntu-latest
    environment: development
    if: github.ref == 'refs/heads/develop'
    needs: [build-images]
    
    steps:
      - name: Deploy services
        # Service-specific deployment steps
      
      - name: Run smoke tests
        run: |
          # Verify services are healthy
          curl -f https://dev.example.com/health || exit 1
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployed to development'
```

### Staging Deployment

```yaml
jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/main'
    needs: [deploy-development]
    
    steps:
      # Similar to development with staging-specific config
```

### Production Deployment

```yaml
jobs:
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production
    if: startsWith(github.ref, 'refs/tags/v')
    needs: [deploy-staging]
    
    steps:
      - name: Request approval
        # Manual approval required via environment protection rules
      
      - name: Deploy to production
        # Production deployment steps
      
      - name: Post-deployment verification
        run: |
          # Verify production deployment
          curl -f https://api.example.com/health || exit 1
```

## Environment Protection Rules

### GitHub Environments

Configure in repository settings:
- **Required reviewers**: Manual approval for production
- **Wait timer**: Delay before deployment
- **Deployment branches**: Which branches can deploy
- **Environment secrets**: Environment-specific secrets

### Example Configuration

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy-production:
    environment:
      name: production
      url: https://api.example.com
```

## Deployment Strategies

### 1. Rolling Update (Default)

**Kubernetes:**
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

**Benefits:**
- Zero downtime
- Automatic rollback on failure
- Gradual traffic shift

### 2. Blue-Green Deployment

```yaml
# Deploy to green environment
# Switch traffic when healthy
# Keep blue as backup
```

**Benefits:**
- Instant rollback
- Testing before switch
- No traffic mixing

### 3. Canary Deployment

```yaml
# Deploy to small subset
# Monitor metrics
# Gradually increase traffic
# Full rollout or rollback
```

**Benefits:**
- Risk mitigation
- Gradual rollout
- Real-world testing

## Health Checks and Verification

### Pre-Deployment Checks

```yaml
- name: Pre-deployment checks
  run: |
    # Check image exists
    docker manifest inspect ghcr.io/owner/service:${{ github.sha }} || exit 1
    
    # Check dependencies
    # Verify configuration
```

### Post-Deployment Verification

```yaml
- name: Health check
  run: |
    for i in {1..30}; do
      if curl -f https://api.example.com/health; then
        echo "Service is healthy"
        exit 0
      fi
      sleep 10
    done
    echo "Health check failed"
    exit 1
```

### Integration Tests

```yaml
- name: Run integration tests
  run: |
    npm run test:integration -- --base-url=https://staging.example.com
```

## Rollback Strategy

### Automatic Rollback

```yaml
- name: Rollback on failure
  if: failure()
  run: |
    kubectl rollout undo deployment/service -n namespace
    kubectl rollout status deployment/service -n namespace
```

### Manual Rollback

```yaml
- name: Manual rollback trigger
  uses: actions/github-script@v7
  with:
    script: |
      // Create rollback workflow dispatch
      await github.rest.actions.createWorkflowDispatch({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'rollback.yml',
        ref: 'main',
        inputs: {
          service: 'auth-service',
          previous_version: 'v1.2.3'
        }
      });
```

## Secrets Management

### Environment Secrets

Store in GitHub Environments:
- Database credentials
- API keys
- Service URLs
- Kubeconfig files

### Access in Workflows

```yaml
- name: Use secret
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: echo $DATABASE_URL
```

## Deployment Notifications

### Slack Integration

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployed ${{ github.sha }} to ${{ github.ref_name }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

```yaml
- name: Send email
  uses: dawidd6/action-send-mail@v3
  with:
    to: team@example.com
    subject: 'Deployment: ${{ github.ref_name }}'
    body: 'Deployed ${{ github.sha }}'
```

## Monitoring and Observability

### Deployment Metrics

- Deployment duration
- Success/failure rates
- Rollback frequency
- Time to healthy

### Post-Deployment Monitoring

```yaml
- name: Monitor deployment
  run: |
    # Check metrics
    # Verify logs
    # Monitor alerts
```

## Best Practices

### 1. **Immutable Deployments**
- Use image tags (SHA) not `latest`
- Don't modify running containers
- Always deploy new versions

### 2. **Database Migrations**
- Run migrations before deployment
- Use versioned migrations
- Test migrations in staging

### 3. **Feature Flags**
- Use feature flags for gradual rollout
- Disable features if issues arise
- A/B testing capabilities

### 4. **Configuration Management**
- Environment-specific configs
- Use secrets for sensitive data
- Version control configuration

### 5. **Deployment Windows**
- Schedule deployments during low traffic
- Maintenance windows
- Communicate with team

## Deployment Workflow Example

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]
    tags: ['v*']

jobs:
  build:
    # Build Docker images
  
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    needs: build
    environment: development
    # Deploy to dev
  
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: [build, deploy-dev]
    environment: staging
    # Deploy to staging
  
  deploy-production:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: [build, deploy-staging]
    environment: production
    # Deploy to production with approval
```

## Future Enhancements

### 1. **Automated Canary Deployments**
- Automatic traffic shifting
- Metrics-based decisions
- Automated rollback

### 2. **Multi-Region Deployment**
- Deploy to multiple regions
- Regional health checks
- Geographic load balancing

### 3. **Chaos Engineering**
- Automated chaos tests
- Failure injection
- Resilience validation

### 4. **GitOps**
- ArgoCD or Flux integration
- Git as source of truth
- Automated synchronization

---

**Related Files:**
- Future: `.github/workflows/deploy.yml`
- Deployment documentation
- Kubernetes manifests

---

**Last Updated:** 2024  
**Status:** Planned

