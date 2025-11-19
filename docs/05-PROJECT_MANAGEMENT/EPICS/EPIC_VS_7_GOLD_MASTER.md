# EPIC-VS-7: Gold Master

**Copy and paste this template directly into GitHub Issues.**

**Note:** All technical implementation details from Deployment Architecture (monitoring, logging, production deployment) have been consolidated into this file. You no longer need to reference multiple documents when creating GitHub issues.

---

## EPIC-VS-7: Gold Master

### Issue Template:

```
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

### VS-7-1: Deploy production monitoring with Prometheus and Grafana

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

**Prometheus Configuration Implementation Requirements:**
- Create prometheus.yml configuration file
- Configure global settings:
  - Set scrape_interval to 15 seconds (how often to scrape metrics)
  - Set evaluation_interval to 15 seconds (how often to evaluate alerting rules)
  - Set external_labels: cluster='battle-arena', environment='production'
- Configure rule_files:
  - Reference alerting rules directory: "alerts/*.yml"
- Configure alerting section:
  - Set alertmanagers target: alertmanager:9093
- Configure scrape_configs for all services:
  - **auth-service:**
    - Job name: 'auth-service'
    - Metrics path: '/actuator/prometheus' (Spring Boot Actuator endpoint)
    - Target: auth-service:8081
    - Labels: service='auth-service', tier='backend'
  - **profile-service:**
    - Job name: 'profile-service'
    - Metrics path: '/actuator/prometheus'
    - Target: profile-service:8082
    - Labels: service='profile-service', tier='backend'
  - **leaderboard-service:**
    - Job name: 'leaderboard-service'
    - Metrics path: '/actuator/prometheus'
    - Target: leaderboard-service:8083
    - Labels: service='leaderboard-service', tier='backend'
  - **matchmaking-service:**
    - Job name: 'matchmaking-service'
    - Target: matchmaking-service:3002
    - Labels: service='matchmaking-service', tier='backend'
  - **game-engine:**
    - Job name: 'game-engine'
    - Target: game-engine:5002
    - Labels: service='game-engine', tier='backend'
  - **prometheus:**
    - Job name: 'prometheus'
    - Target: localhost:9090 (self-monitoring)

**Alerting Rules:**
**File:** `deployments/monitoring/prometheus/alerts/service-down.yml`

**Prometheus Alerting Rules Implementation Requirements:**
- Create alerting rules YAML file in alerts directory
- Configure alert group:
  - Group name: service_availability
  - Evaluation interval: 30 seconds
- Define alert rules:
  - **Alert: ServiceDown**
    - Expression: Check if up metric equals 0 for any backend service (auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine)
    - Duration: Alert fires if condition persists for 1 minute
    - Labels: severity=critical
    - Annotations: Summary and description with service name from labels
  - **Alert: HighErrorRate**
    - Expression: Calculate rate of HTTP requests with 5xx status codes over 5 minutes, alert if > 5%
    - Duration: Alert fires if condition persists for 5 minutes
    - Labels: severity=warning
    - Annotations: Summary and description with service name from labels
  - **Alert: HighLatency**
    - Expression: Calculate 95th percentile latency from HTTP request duration histogram over 5 minutes, alert if > 1 second
    - Duration: Alert fires if condition persists for 5 minutes
    - Labels: severity=warning
    - Annotations: Summary and description with service name from labels
- Create additional alert rules for other critical metrics (high CPU, high memory, disk space, etc.)

**Spring Boot - Metrics Configuration:**
**File:** `backend-services/{service}/src/main/resources/application.yaml`

**Spring Boot Metrics Configuration Implementation Requirements:**
- Configure Spring Boot Actuator in application.yaml:
  - Enable Prometheus endpoint: management.endpoint.prometheus.enabled=true
  - Enable Prometheus metrics export: management.metrics.export.prometheus.enabled=true
  - Expose endpoints: management.endpoints.web.exposure.include=health,info,prometheus,metrics
  - Add application tags: management.metrics.tags.application=${spring.application.name}
  - Add environment tags: management.metrics.tags.environment=${spring.profiles.active}
- Ensure all Spring Boot services (auth-service, profile-service, leaderboard-service) have metrics enabled
- Verify /actuator/prometheus endpoint is accessible and returns metrics in Prometheus format

**Node.js - Metrics Configuration:**
**File:** `backend-services/{service}/src/config/metrics.config.ts`

**Node.js Metrics Configuration Implementation Requirements:**
- Create metrics configuration file in config directory
- Import prom-client package
- Create Prometheus Registry:
  - Instantiate new Registry from prom-client
  - Collect default metrics (CPU, memory, event loop, etc.) using collectDefaultMetrics()
- Create custom metrics:
  - **httpRequestDuration (Histogram):**
    - Name: "http_request_duration_seconds"
    - Help text: "Duration of HTTP requests in seconds"
    - Label names: method, route, status_code
    - Buckets: [0.1, 0.5, 1, 2, 5] seconds
    - Register with metrics registry
  - **httpRequestTotal (Counter):**
    - Name: "http_requests_total"
    - Help text: "Total number of HTTP requests"
    - Label names: method, route, status_code
    - Register with metrics registry
  - **activeConnections (Gauge):**
    - Name: "active_connections"
    - Help text: "Number of active connections"
    - Register with metrics registry
- Create metrics endpoint handler:
  - Export async function that sets Content-Type header
  - Return metrics from registry in Prometheus format
- Export registry for use in middleware and route handlers
- Ensure all Node.js services (matchmaking-service, game-engine) have metrics configured

---

### VS-7-2: Implement centralized logging with Loki and Grafana

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

**Loki Configuration Implementation Requirements:**
- Create loki-config.yml configuration file
- Configure authentication:
  - Set auth_enabled to false (for development, enable in production)
- Configure server settings:
  - HTTP listen port: 3100
  - gRPC listen port: 9096
- Configure common settings:
  - Set path_prefix to /loki
  - Configure storage:
    - Filesystem storage for chunks and rules directories
    - Set replication_factor to 1 (single instance)
  - Configure ring:
    - Instance address: 127.0.0.1
    - Key-value store: inmemory
- Configure schema_config:
  - Set schema version: v11
  - Set store type: boltdb-shipper
  - Set object store: filesystem
  - Set index prefix: index_
  - Set index period: 24h
- Configure storage_config:
  - BoltDB shipper: active index directory, cache location, shared store (filesystem)
  - Filesystem: chunks directory location
- Configure limits_config:
  - Set enforce_metric_name to false
  - Enable reject_old_samples: true
  - Set max age for old samples: 168h (7 days)
  - Set ingestion rate: 16 MB/s
  - Set ingestion burst size: 32 MB
- Configure chunk_store_config:
  - Set max_look_back_period to 0s
- Configure table_manager:
  - Enable retention deletes: true
  - Set retention period: 168h (7 days)

**Promtail Configuration (Log Collection):**
**File:** `deployments/logging/promtail/promtail-config.yml`

**Promtail Configuration Implementation Requirements:**
- Create promtail-config.yml configuration file
- Configure server settings:
  - HTTP listen port: 9080
  - gRPC listen port: 0 (disabled)
- Configure positions file:
  - Filename: /tmp/positions.yaml (tracks log file positions)
- Configure clients:
  - Loki push URL: http://loki:3100/loki/api/v1/push
- Configure scrape_configs for all services:
  - **auth-service:**
    - Job name: auth-service
    - Target: localhost
    - Labels: job=auth-service, service=auth-service
    - Log path: /var/log/auth-service/*.log
  - **profile-service:**
    - Job name: profile-service
    - Target: localhost
    - Labels: job=profile-service, service=profile-service
    - Log path: /var/log/profile-service/*.log
  - **leaderboard-service:**
    - Job name: leaderboard-service
    - Target: localhost
    - Labels: job=leaderboard-service, service=leaderboard-service
    - Log path: /var/log/leaderboard-service/*.log
  - **matchmaking-service:**
    - Job name: matchmaking-service
    - Target: localhost
    - Labels: job=matchmaking-service, service=matchmaking-service
    - Log path: /var/log/matchmaking-service/*.log
  - **game-engine:**
    - Job name: game-engine
    - Target: localhost
    - Labels: job=game-engine, service=game-engine
    - Log path: /var/log/game-engine/*.log
- Ensure log file paths match actual log file locations in containers

**Spring Boot - Structured Logging Configuration:**
**File:** `backend-services/{service}/src/main/resources/logback-spring.xml`

**Spring Boot Structured Logging Implementation Requirements:**
- Create logback-spring.xml configuration file in resources directory
- Include Spring Boot default logback configuration
- Configure CONSOLE appender:
  - Use ConsoleAppender class
  - Use LoggingEventCompositeJsonEncoder for JSON format
  - Configure providers:
    - Timestamp provider
    - Version provider
    - Log level provider
    - Message provider
    - MDC (Mapped Diagnostic Context) provider
    - Stack trace provider
    - Custom pattern provider with service name, environment, thread, and logger name
- Configure FILE appender:
  - Use RollingFileAppender class
  - Set log file path: /var/log/{service-name}/application.log
  - Use LoggingEventCompositeJsonEncoder for JSON format
  - Configure same providers as CONSOLE appender
  - Configure rolling policy:
    - Use TimeBasedRollingPolicy
    - Set file name pattern: application.{date}.log (daily rotation)
    - Set max history: 30 days
- Configure root logger:
  - Set log level: INFO
  - Reference both CONSOLE and FILE appenders
- Ensure all Spring Boot services use structured JSON logging
- Add logstash-logback-encoder dependency to pom.xml

**Node.js - Structured Logging Configuration:**
**File:** `backend-services/{service}/src/config/logger.config.ts`

**Node.js Structured Logging Implementation Requirements:**
- Create logger configuration file in config directory
- Import winston logging library and path module
- Configure log format:
  - Combine multiple Winston formatters:
    - Timestamp formatter
    - Error stack trace formatter
    - JSON formatter (for structured logging)
    - Metadata formatter
- Create Winston logger instance:
  - Set log level from LOG_LEVEL environment variable (default: "info")
  - Use combined log format
  - Set default metadata:
    - service: SERVICE_NAME environment variable (default: "unknown-service")
    - environment: NODE_ENV environment variable (default: "development")
- Configure transports (output destinations):
  - **Console transport:**
    - Format: Combine colorize and simple formatters for readable console output
  - **Error file transport:**
    - Filename: /var/log/{SERVICE_NAME}/error.log
    - Level: error (only error logs)
  - **Combined file transport:**
    - Filename: /var/log/{SERVICE_NAME}/combined.log
    - Level: default (all logs)
- Export logger instance for use throughout application
- Ensure all Node.js services use Winston structured logging

---

### VS-7-3: Complete production readiness with bug fixes and launch procedures

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

**Production CI/CD Workflow Implementation Requirements:**
- Create GitHub Actions workflow file for production deployment
- Configure workflow name: "Deploy to Production"
- Configure trigger events:
  - Push to main branch
  - Push tags matching 'v*' pattern (version tags)
- Configure test job:
  - Run on ubuntu-latest
  - Checkout code using actions/checkout@v3
  - Run all tests (unit, integration, E2E)
  - Check code coverage thresholds (80%+)
  - Verify no critical bugs exist
- Configure build job:
  - Depends on test job (needs: test)
  - Run on ubuntu-latest
  - Checkout code
  - Build Docker images for all services:
    - Tag images with GitHub SHA: battle-arena-{service}:{sha}
    - Build auth-service, profile-service, leaderboard-service, matchmaking-service, game-engine, frontend-service
- Configure deploy job:
  - Depends on build job (needs: build)
  - Run only on main branch (if: github.ref == 'refs/heads/main')
  - Deploy to production environment
  - Run health checks on all services
  - Run smoke tests to verify deployment
  - Handle deployment failures gracefully

**Disaster Recovery Plan:**
**File:** `docs/operations/DISASTER_RECOVERY.md`

**Disaster Recovery Plan Documentation Requirements:**
- Create comprehensive disaster recovery plan document
- Document backup strategy:
  - **Database Backups:**
    - MongoDB: Daily automated backups at 2 AM UTC
    - Backup retention: 30 days
    - Backup storage: S3 (encrypted)
    - Backup testing: Weekly restore tests to verify integrity
  - **Application Backups:**
    - Configuration: Version controlled in Git
    - Secrets: Stored in secure vault (HashiCorp Vault or similar)
- Document recovery procedures:
  - **Database Recovery:**
    - Step 1: Identify last known good backup
    - Step 2: Restore database from backup
    - Step 3: Verify data integrity
    - Step 4: Restart services
    - Step 5: Run health checks
  - **Service Recovery:**
    - Step 1: Identify failed service
    - Step 2: Check service logs
    - Step 3: Restart service
    - Step 4: Verify service health
    - Step 5: Check dependent services
- Document Recovery Time Objectives (RTO):
  - Critical Services: 15 minutes maximum downtime
  - Non-Critical Services: 1 hour maximum downtime
- Document Recovery Point Objectives (RPO):
  - Database: 24 hours (daily backups acceptable data loss)
  - Application: Real-time (no data loss acceptable)

**Operational Runbook:**
**File:** `docs/operations/RUNBOOK.md`

**Operational Runbook Documentation Requirements:**
- Create comprehensive operational runbook document
- Document common procedures:
  - **Service Restart:**
    - Step 1: Identify service to restart
    - Step 2: Check service health using curl command to /health endpoint
    - Step 3: Restart service using docker-compose restart command
    - Step 4: Verify service health after restart
    - Step 5: Check logs using docker-compose logs command
  - **Database Backup:**
    - Step 1: Connect to MongoDB
    - Step 2: Run mongodump command with URI and output directory (date-stamped)
    - Step 3: Verify backup integrity
    - Step 4: Upload backup to S3 using AWS CLI
  - **Log Investigation:**
    - Step 1: Access Grafana at configured URL
    - Step 2: Navigate to Explore section and select Loki data source
    - Step 3: Select service and time range for investigation
    - Step 4: Search for error patterns using LogQL queries
    - Step 5: Analyze logs and identify root cause
- Document troubleshooting procedures:
  - **High Error Rate:**
    - Check service health status
    - Review error logs in centralized logging system
    - Check database connectivity
    - Verify Redis connectivity
    - Check service dependencies and upstream services
  - **High Latency:**
    - Check service metrics in Prometheus/Grafana
    - Review slow query logs in database
    - Check database performance metrics
    - Verify network connectivity between services
    - Check resource utilization (CPU, memory, disk, network)
- Include step-by-step procedures for all common operational tasks

**Launch Checklist:**
**File:** `docs/operations/LAUNCH_CHECKLIST.md`

**Launch Checklist Documentation Requirements:**
- Create comprehensive launch checklist document
- Document Pre-Launch checklist items:
  - **Infrastructure:**
    - All services deployed and healthy
    - Monitoring infrastructure operational (Prometheus, Grafana)
    - Logging infrastructure operational (Loki, Grafana)
    - Database backups configured and tested
    - Disaster recovery plan tested and validated
  - **Application:**
    - All critical bugs fixed
    - All tests passing (unit, integration, E2E)
    - Test coverage maintained (80%+)
    - Performance benchmarks met in staging/production
    - Security audit completed and issues resolved
  - **Documentation:**
    - Operational runbooks complete
    - Disaster recovery plan documented
    - Deployment procedures documented
    - API documentation complete (Swagger/OpenAPI)
  - **Monitoring:**
    - Dashboards configured for all services
    - Alerting rules configured and tested
    - Notification channels tested (email, Slack, PagerDuty)
    - SLIs (Service Level Indicators) and SLOs (Service Level Objectives) defined
- Document Launch Day checklist items:
  - **Pre-Launch (1 hour before):**
    - Final health checks on all services
    - Verify all services running and healthy
    - Check monitoring dashboards for any anomalies
    - Verify backup systems are operational
  - **Launch:**
    - Enable public access to application
    - Monitor error rates in real-time
    - Monitor latency metrics
    - Monitor resource utilization (CPU, memory, network)
    - Watch for alerts and respond immediately
  - **Post-Launch (First 24 hours):**
    - Monitor all metrics continuously
    - Review error logs regularly
    - Check user feedback channels
    - Verify all systems operational and performing as expected
- Use checkbox format for easy tracking and verification

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

```

---

**Note:** This epic consolidates all technical details from Deployment Architecture (monitoring, logging, production deployment). All code snippets, folder structures, class names, and method signatures match the Deployment Architecture document exactly for consistency.
