# EPIC-VS-7: Gold Master

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Deployment Architecture (monitoring, logging, production deployment) have been consolidated into this file. You no longer need to reference multiple documents when creating GitHub issues.

---

## EPIC-VS-7: Gold Master

### Issue Template:

````
Title: EPIC-VS-7: Gold Master

Description:
## Overview
Implement the seventh and final vertical slice to reach Gold Master milestone - the game is production-ready, fully monitored, and ready to launch. This epic includes production monitoring (Prometheus, Grafana), logging infrastructure (ELK Stack or Loki + Grafana), final bug fixes, production deployment automation, launch preparation, and operational runbooks. This is the "launch-ready" milestone - no critical bugs, all systems monitored, ready for players.

**This is the seventh and final vertical slice** - it prepares the game for launch by ensuring production readiness, observability, and operational excellence.

## Vertical Slice Goal
The game is:
1. Production-ready and deployed (monitoring, logging, alerting)
2. Fully monitored (metrics, dashboards, alerts)
3. Comprehensively logged (centralized logging, log aggregation)
4. Bug-free (all critical bugs fixed, all tests passing)
5. Documented (runbooks, deployment guides, operational procedures)
6. Launch-ready (launch checklist complete, go-live procedures defined)

## Success Criteria
- [ ] Production monitoring infrastructure deployed (Prometheus, Grafana)
- [ ] Application metrics collected and visualized (dashboards, alerts)
- [ ] Logging infrastructure deployed (ELK Stack or Loki + Grafana)
- [ ] Centralized logging configured (all services logging to central system)
- [ ] Alerting configured (critical issues trigger alerts)
- [ ] All critical bugs fixed
- [ ] All tests passing (unit, integration, E2E)
- [ ] Production deployment automated (CI/CD for production)
- [ ] Disaster recovery plan documented and tested
- [ ] Operational runbooks created
- [ ] Launch checklist complete
- [ ] Go-live procedures documented
- [ ] Performance benchmarks met in production
- [ ] Security audit completed

## MVP Scope (Minimal for Gold Master Milestone)

**What's Included:**
- Production monitoring (Prometheus + Grafana)
- Centralized logging (Loki + Grafana or ELK Stack)
- Basic alerting (critical errors, service downtime)
- Production deployment automation (CI/CD)
- Final bug fixes (all critical and high-priority bugs)
- Operational runbooks (common procedures, troubleshooting)
- Launch checklist (pre-launch verification)
- Basic disaster recovery (backup strategy, recovery procedures)

**What's Deferred:**
- Advanced distributed tracing (Jaeger/Zipkin) - can be added post-launch
- Advanced APM (Application Performance Monitoring) - can be added post-launch
- Multi-region deployment - can be added post-launch
- Advanced auto-scaling - can be added post-launch
- Load testing at scale - can be done post-launch with real traffic

## Technical References

### Architecture Documents (Technical Implementation Details)
This epic references Deployment Architecture for technical specifications.

- **Monitoring:** See [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Section 6.1, 6.2
- **Logging:** See [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Section 6.3
- **Disaster Recovery:** See [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Section 7

### Architecture References

**Architecture Documents:**
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Production deployment, monitoring, logging
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service architecture
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Security best practices

## Stories (Player Experience)

### VS-7-1: Application is fully monitored in production

**User Story:** As an operator, I want comprehensive monitoring and alerting so that I can detect and respond to issues before they affect players.

**Related Diagrams & Documents:**
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Monitoring infrastructure (section 6.1, 6.2)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service architecture

**Acceptance Criteria:**
- [ ] Prometheus deployed and configured
- [ ] Grafana deployed and configured
- [ ] Application metrics exposed (Spring Boot Actuator, Node.js metrics)
- [ ] Infrastructure metrics collected (CPU, memory, disk, network)
- [ ] Custom business metrics defined (match count, active players, queue length)
- [ ] Dashboards created for all services
- [ ] Alerting rules configured (service down, high error rate, high latency)
- [ ] AlertManager configured (notification channels: email, Slack, PagerDuty)
- [ ] Service-level indicators (SLIs) defined
- [ ] Service-level objectives (SLOs) defined
- [ ] End-to-end test: Metrics collected → Dashboards show data → Alerts trigger on issues

**Technical Details:**

**Monitoring Infrastructure - Prometheus Configuration:**
**File:** `deployments/monitoring/prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'battle-arena'
    environment: 'production'

rule_files:
  - "alerts/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Auth Service
  - job_name: 'auth-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['auth-service:8081']
        labels:
          service: 'auth-service'
          tier: 'backend'

  # Profile Service
  - job_name: 'profile-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['profile-service:8082']
        labels:
          service: 'profile-service'
          tier: 'backend'

  # Leaderboard Service
  - job_name: 'leaderboard-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['leaderboard-service:8083']
        labels:
          service: 'leaderboard-service'
          tier: 'backend'

  # Matchmaking Service
  - job_name: 'matchmaking-service'
    static_configs:
      - targets: ['matchmaking-service:3002']
        labels:
          service: 'matchmaking-service'
          tier: 'backend'

  # Game Engine Service
  - job_name: 'game-engine'
    static_configs:
      - targets: ['game-engine:5002']
        labels:
          service: 'game-engine'
          tier: 'backend'

  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

**Alerting Rules:**
**File:** `deployments/monitoring/prometheus/alerts/service-down.yml`

```yaml
groups:
  - name: service_availability
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up{job=~"auth-service|profile-service|leaderboard-service|matchmaking-service|game-engine"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "Service {{ $labels.job }} has been down for more than 1 minute."

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate in {{ $labels.service }}"
          description: "Error rate is above 5% for {{ $labels.service }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency in {{ $labels.service }}"
          description: "95th percentile latency is above 1s for {{ $labels.service }}"
```

**Spring Boot - Metrics Configuration:**
**File:** `backend-services/{service}/src/main/resources/application.properties`

```properties
# Prometheus metrics
management.endpoints.web.exposure.include=health,info,prometheus,metrics
management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true
management.metrics.tags.application=${spring.application.name}
management.metrics.tags.environment=${spring.profiles.active}
```

**Node.js - Metrics Configuration:**
**File:** `backend-services/{service}/src/config/metrics.config.ts`

```typescript
import promClient from "prom-client";

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Create custom metrics
export const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  register,
});

export const httpRequestTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  register,
});

export const activeConnections = new promClient.Gauge({
  name: "active_connections",
  help: "Number of active connections",
  register,
});

// Metrics endpoint
export const metricsEndpoint = async (req: any, res: any) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

export { register };
```

---

### VS-7-2: Application has centralized logging

**User Story:** As an operator, I want centralized logging so that I can search, filter, and analyze logs from all services in one place.

**Related Diagrams & Documents:**
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Logging infrastructure (section 6.3)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) - Service architecture

**Acceptance Criteria:**
- [ ] Logging infrastructure deployed (Loki + Grafana or ELK Stack)
- [ ] All services configured for structured logging (JSON format)
- [ ] Log collection configured (Filebeat, Fluentd, or Promtail)
- [ ] Log aggregation working (logs from all services in central system)
- [ ] Log search and filtering working
- [ ] Log dashboards created (error logs, access logs, service logs)
- [ ] Log retention policies configured
- [ ] Log alerting configured (error patterns, critical errors)
- [ ] End-to-end test: Logs generated → Collected → Searchable → Dashboards show data

**Technical Details:**

**Logging Infrastructure - Loki Configuration:**
**File:** `deployments/logging/loki/loki-config.yml`

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2024-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 16
  ingestion_burst_size_mb: 32

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 168h
```

**Promtail Configuration (Log Collection):**
**File:** `deployments/logging/promtail/promtail-config.yml`

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # Auth Service logs
  - job_name: auth-service
    static_configs:
      - targets:
          - localhost
        labels:
          job: auth-service
          service: auth-service
          __path__: /var/log/auth-service/*.log

  # Profile Service logs
  - job_name: profile-service
    static_configs:
      - targets:
          - localhost
        labels:
          job: profile-service
          service: profile-service
          __path__: /var/log/profile-service/*.log

  # Leaderboard Service logs
  - job_name: leaderboard-service
    static_configs:
      - targets:
          - localhost
        labels:
          job: leaderboard-service
          service: leaderboard-service
          __path__: /var/log/leaderboard-service/*.log

  # Matchmaking Service logs
  - job_name: matchmaking-service
    static_configs:
      - targets:
          - localhost
        labels:
          job: matchmaking-service
          service: matchmaking-service
          __path__: /var/log/matchmaking-service/*.log

  # Game Engine Service logs
  - job_name: game-engine
    static_configs:
      - targets:
          - localhost
        labels:
          job: game-engine
          service: game-engine
          __path__: /var/log/game-engine/*.log
```

**Spring Boot - Structured Logging Configuration:**
**File:** `backend-services/{service}/src/main/resources/logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp/>
                <version/>
                <logLevel/>
                <message/>
                <mdc/>
                <stackTrace/>
                <pattern>
                    <pattern>
                        {
                            "service": "${spring.application.name}",
                            "environment": "${spring.profiles.active}",
                            "thread": "%thread",
                            "logger": "%logger{36}"
                        }
                    </pattern>
                </pattern>
            </providers>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>/var/log/${spring.application.name}/application.log</file>
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp/>
                <version/>
                <logLevel/>
                <message/>
                <mdc/>
                <stackTrace/>
                <pattern>
                    <pattern>
                        {
                            "service": "${spring.application.name}",
                            "environment": "${spring.profiles.active}",
                            "thread": "%thread",
                            "logger": "%logger{36}"
                        }
                    </pattern>
                </pattern>
            </providers>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>/var/log/${spring.application.name}/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

**Node.js - Structured Logging Configuration:**
**File:** `backend-services/{service}/src/config/logger.config.ts`

```typescript
import winston from "winston";
import path from "path";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || "unknown-service",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join("/var/log", `${process.env.SERVICE_NAME || "service"}/error.log`),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join("/var/log", `${process.env.SERVICE_NAME || "service"}/combined.log`),
    }),
  ],
});
```

---

### VS-7-3: Application is production-ready and launch-ready

**User Story:** As a developer, I want the application to be production-ready with all critical bugs fixed, tests passing, and launch procedures documented so that we can launch confidently.

**Related Diagrams & Documents:**
- [Deployment Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/09-DEPLOYMENT.md) - Production deployment, disaster recovery (section 7)
- [Security Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/07-SECURITY_ARCHITECTURE.md) - Security best practices

**Acceptance Criteria:**
- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] All tests passing (unit, integration, E2E)
- [ ] Test coverage maintained (80%+)
- [ ] Production deployment automated (CI/CD pipeline)
- [ ] Disaster recovery plan documented
- [ ] Backup strategy implemented and tested
- [ ] Operational runbooks created
- [ ] Launch checklist complete
- [ ] Go-live procedures documented
- [ ] Security audit completed
- [ ] Performance benchmarks met in production
- [ ] End-to-end test: All checks pass → Launch checklist complete → Ready for launch

**Technical Details:**

**Production CI/CD Pipeline:**
**File:** `.github/workflows/deploy-production.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          # Run all tests
          # Check coverage thresholds
          # Verify no critical bugs

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t battle-arena-auth-service:${{ github.sha }} ./backend-services/auth-service
          # Build all other services

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy to production environment
          # Run health checks
          # Run smoke tests
```

**Disaster Recovery Plan:**
**File:** `docs/operations/DISASTER_RECOVERY.md`

```markdown
# Disaster Recovery Plan

## Backup Strategy

### Database Backups
- **MongoDB**: Daily automated backups at 2 AM UTC
- **Backup Retention**: 30 days
- **Backup Storage**: S3 (encrypted)
- **Backup Testing**: Weekly restore tests

### Application Backups
- **Configuration**: Version controlled in Git
- **Secrets**: Stored in secure vault (HashiCorp Vault)

## Recovery Procedures

### Database Recovery
1. Identify last known good backup
2. Restore database from backup
3. Verify data integrity
4. Restart services
5. Run health checks

### Service Recovery
1. Identify failed service
2. Check service logs
3. Restart service
4. Verify service health
5. Check dependent services

## Recovery Time Objectives (RTO)
- **Critical Services**: 15 minutes
- **Non-Critical Services**: 1 hour

## Recovery Point Objectives (RPO)
- **Database**: 24 hours (daily backups)
- **Application**: Real-time (no data loss)
```

**Operational Runbook:**
**File:** `docs/operations/RUNBOOK.md`

```markdown
# Operational Runbook

## Common Procedures

### Service Restart
1. Identify service to restart
2. Check service health: `curl http://service:port/health`
3. Restart service: `docker-compose restart service-name`
4. Verify service health
5. Check logs: `docker-compose logs -f service-name`

### Database Backup
1. Connect to MongoDB
2. Run backup: `mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)`
3. Verify backup integrity
4. Upload to S3: `aws s3 cp /backup/... s3://backups/...`

### Log Investigation
1. Access Grafana: `http://grafana:3000`
2. Navigate to Explore → Loki
3. Select service and time range
4. Search for error patterns
5. Analyze logs and identify root cause

## Troubleshooting

### High Error Rate
1. Check service health
2. Review error logs
3. Check database connectivity
4. Verify Redis connectivity
5. Check service dependencies

### High Latency
1. Check service metrics
2. Review slow query logs
3. Check database performance
4. Verify network connectivity
5. Check resource utilization (CPU, memory)
```

**Launch Checklist:**
**File:** `docs/operations/LAUNCH_CHECKLIST.md`

```markdown
# Launch Checklist

## Pre-Launch

### Infrastructure
- [ ] All services deployed and healthy
- [ ] Monitoring infrastructure operational
- [ ] Logging infrastructure operational
- [ ] Database backups configured
- [ ] Disaster recovery plan tested

### Application
- [ ] All critical bugs fixed
- [ ] All tests passing
- [ ] Test coverage maintained (80%+)
- [ ] Performance benchmarks met
- [ ] Security audit completed

### Documentation
- [ ] Operational runbooks complete
- [ ] Disaster recovery plan documented
- [ ] Deployment procedures documented
- [ ] API documentation complete

### Monitoring
- [ ] Dashboards configured
- [ ] Alerting rules configured
- [ ] Notification channels tested
- [ ] SLIs and SLOs defined

## Launch Day

### Pre-Launch (1 hour before)
- [ ] Final health checks
- [ ] Verify all services running
- [ ] Check monitoring dashboards
- [ ] Verify backup systems

### Launch
- [ ] Enable public access
- [ ] Monitor error rates
- [ ] Monitor latency
- [ ] Monitor resource utilization
- [ ] Watch for alerts

### Post-Launch (First 24 hours)
- [ ] Monitor all metrics
- [ ] Review error logs
- [ ] Check user feedback
- [ ] Verify all systems operational
```

---

## Related Epics

- **EPIC-VS-1:** Foundation & Infrastructure Setup (prerequisite)
- **EPIC-VS-2:** Authentication (prerequisite)
- **EPIC-VS-3:** First Playable Match (prerequisite)
- **EPIC-VS-4:** Profile & Progression (prerequisite)
- **EPIC-VS-5:** Full Game Features (prerequisite)
- **EPIC-VS-6:** Content Complete (prerequisite)

## Dependencies

- VS-1 through VS-6: All previous vertical slices must be complete
- All services must be implemented and functional
- All features must be working end-to-end
- Content Complete milestone achieved

## Labels

epic:gold-master, vertical-slice:7, milestone:gold-master, priority:critical

## Milestone

Gold Master: Production Ready, Launch Ready

````

---

**Note:** This epic consolidates all technical details from Deployment Architecture (monitoring, logging, production deployment). All code snippets, folder structures, class names, and method signatures match the Deployment Architecture document exactly for consistency.
