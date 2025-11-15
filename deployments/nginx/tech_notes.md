# Nginx Upstream Services - Technical Notes & Industrial Best Practices

This document provides theoretical insights and industrial best practices for configuring upstream services in Nginx for the Battle Arena microservices architecture.

## Table of Contents

1. [Understanding Upstream Services](#understanding-upstream-services)
2. [Load Balancing Algorithms](#load-balancing-algorithms)
3. [Scaling Strategies](#scaling-strategies)
4. [Production Best Practices](#production-best-practices)
5. [Service Discovery Integration](#service-discovery-integration)
6. [Failover and Reliability](#failover-and-reliability)
7. [Performance Optimization](#performance-optimization)
8. [Service-Specific Configurations](#service-specific-configurations)
9. [Advanced Deployment Patterns](#advanced-deployment-patterns)
10. [Monitoring and Observability](#monitoring-and-observability)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Understanding Upstream Services

Upstream blocks in Nginx define a pool of backend servers that requests can be proxied to. Instead of hardcoding server IPs and ports directly in location blocks, upstream groups provide an abstraction layer that enables load balancing, high availability, and centralized configuration management.

### Important Clarification: Load Balancing vs. Service Routing

A common misconception is that upstream load balancing routes traffic between different microservices. This is not correct. **Upstream load balancing distributes traffic across multiple instances of the same microservice**, not between different services.

Consider this scenario: You have three instances of the auth-service running:
- `auth-service-1:8081`
- `auth-service-2:8081`
- `auth-service-3:8081`

All three instances run the **same code**, handle the **same tasks** (authentication), and can process **any authentication request**. Upstream load balancing distributes incoming authentication requests across these three instances.

**Request Flow Example:**

1. User makes login request → `/api/auth/login`
2. Nginx routes to `auth-service` upstream block
3. Nginx selects one of the three auth-service instances (e.g., `auth-service-2`)
4. `auth-service-2` processes the authentication request
5. Next login request might go to `auth-service-1` or `auth-service-3`

**This is NOT:**
- Routing an auth request to profile-service (different service, different functionality)
- Routing a profile request to leaderboard-service (different service, different data)

**This IS:**
- Routing auth request #1 to auth-service instance 1
- Routing auth request #2 to auth-service instance 2
- Routing auth request #3 to auth-service instance 3

**Why This Matters:**

Each microservice has its own upstream block because they are separate services:
```nginx
upstream auth-service {
    server auth-service-1:8081;  # Instance 1 of auth-service
    server auth-service-2:8081;  # Instance 2 of auth-service
    server auth-service-3:8081;  # Instance 3 of auth-service
}

upstream profile-service {
    server profile-service-1:8082;  # Instance 1 of profile-service
    server profile-service-2:8082;  # Instance 2 of profile-service
}
```

- Requests to `/api/auth/*` can go to any auth-service instance (they're all identical)
- Requests to `/api/profile/*` can go to any profile-service instance (they're all identical)
- But auth requests **cannot** go to profile-service instances (different service, different code, different data)

**Benefits of Multiple Instances per Service:**

1. **Increased Capacity**: 3 instances can handle 3x more requests than 1 instance
2. **High Availability**: If 1 instance crashes, other 2 continue serving requests
3. **Zero-Downtime Deployments**: Deploy to instance 1, then 2, then 3 while others serve traffic
4. **Geographic Distribution**: Place instances in different data centers for lower latency
5. **Resource Optimization**: Distribute CPU/memory load across multiple servers

**Example Scenario:**

Without load balancing (single instance):
- 1000 auth requests/second → 1 server → Overloads, crashes, downtime

With load balancing (3 instances):
- 1000 auth requests/second → 3 servers → ~333 requests/server → All healthy, no downtime

This approach offers several advantages over hardcoding server addresses. When we hardcode servers in location blocks, we face limitations in scalability, failover, and maintenance. Each service instance must be manually configured in every location block that uses it, making horizontal scaling difficult and error-prone.

Upstream blocks solve these problems by centralizing server configuration. When you need to add or remove instances, you modify the upstream block once, and all location blocks automatically benefit from the change. This centralized approach makes load balancing configuration consistent across all routes.

The upstream abstraction also enables service discovery integration. Instead of managing IP addresses, we work with service names that resolve through Docker DNS, Kubernetes services, or other service discovery mechanisms. This decoupling allows services to be scaled, moved, or replaced without touching individual location configurations.

---

## Load Balancing Algorithms

Nginx supports multiple load balancing algorithms, each suited to different use cases and requirements. The choice of algorithm significantly impacts performance, resource utilization, and user experience.

### Round-Robin (Default)

Round-robin is the default load balancing method in Nginx. Requests are distributed sequentially across servers in the order they appear in the upstream block. After reaching the last server, Nginx starts over from the first one, creating a cyclical distribution pattern.

```nginx
upstream auth-service {
    server auth-service:8081;
    server auth-service-2:8081;
    # Round-robin is the default
}
```

This algorithm works well for stateless services where each request is independent and can be handled by any server. It's simple, predictable, and requires no state tracking, making it efficient for high-throughput scenarios. However, round-robin doesn't consider server load, connection count, or request processing times, which can lead to uneven load distribution if servers have different capacities or handle requests at varying speeds.

Round-robin is ideal for REST APIs that don't maintain session state, microservices with equal capacity, and scenarios where simplicity is preferred over fine-grained optimization.

### Least Connections

The least connections algorithm routes requests to the server with the fewest active connections at the moment the request arrives. This method is more intelligent than round-robin because it considers the actual load on each server.

```nginx
upstream profile-service {
    least_conn;  # Use least connections algorithm
    server profile-service:8082;
    server profile-service-2:8082;
}
```

Least connections is particularly effective for services that maintain connection pools, such as database connections. When servers have limited connection capacity, this algorithm ensures more even distribution and prevents individual servers from exhausting their connection pools. It's also beneficial when request processing times vary significantly, as servers handling faster requests will naturally have fewer active connections and receive more new requests.

The algorithm requires Nginx to track connection counts for each server, adding slight overhead compared to round-robin. However, the improved load distribution typically outweighs this minimal cost, especially for services that benefit from better connection pool management.

### IP Hash

IP hash uses a hash function of the client's IP address to consistently route the same client to the same server. This ensures session affinity, which is critical for stateful services that maintain server-side state.

```nginx
upstream matchmaking-service {
    ip_hash;  # Sticky sessions
    server matchmaking-service:3002;
    server matchmaking-service-2:3002;
}
```

IP hash is essential for WebSocket connections, where clients maintain long-lived connections with server-side state. If a client reconnects to a different server, they lose their queue position, game state, or session data. IP hash prevents this by ensuring the same client IP always connects to the same server instance.

The primary trade-off with IP hash is load imbalance. Since distribution depends on client IPs, some servers may receive significantly more traffic if certain IPs generate more requests. Additionally, IP hash doesn't handle cases where client IPs change, such as mobile networks or corporate proxies that rotate IPs.

Despite these limitations, IP hash is the standard solution for maintaining session affinity in Nginx without external session storage systems.

### Weighted Round-Robin

Weighted round-robin allows you to assign different weights to servers, enabling proportional traffic distribution based on server capacity or deployment strategy.

```nginx
upstream auth-service {
    server auth-service:8081 weight=3;      # Gets 60% of traffic
    server auth-service-2:8081 weight=2;    # Gets 40% of traffic
}
```

This algorithm is valuable when servers have different capacities, during gradual deployments where you want to test new versions with a small percentage of traffic, or for A/B testing scenarios. Weighted distribution provides fine-grained control over traffic allocation, but requires capacity planning and monitoring to optimize weights based on actual performance.

### Random Selection

Random selection randomly chooses a server from the pool for each request. While simple to implement, this method offers no optimization and provides unpredictable distribution. Random selection is rarely recommended for production environments due to its lack of optimization and difficulty in predicting behavior.

---

## Scaling Strategies

Effective scaling is crucial for handling growth and maintaining performance. Nginx upstream blocks support multiple scaling strategies, each with different trade-offs and use cases.

### Horizontal Scaling

Horizontal scaling involves adding more server instances to handle increased load. This is the preferred scaling approach for cloud-native applications because it provides better fault tolerance, linear scalability, and cost efficiency.

```nginx
upstream auth-service {
    server auth-service:8081;
    server auth-service-2:8081;      # Add second instance
    server auth-service-3:8081;      # Add third instance
}
```

Each additional server improves fault tolerance, as the failure of one server doesn't eliminate the entire service. Load is automatically distributed across available servers, and you can add capacity incrementally as needed. Horizontal scaling does require shared state management through databases, caches, or message queues, and the load balancer configuration must be updated as instances are added or removed.

### Vertical Scaling

Vertical scaling increases resources (CPU, memory) on existing servers. While simpler in some respects, vertical scaling has significant limitations. Hardware has physical constraints, upgrades typically require downtime, and costs increase exponentially as you reach higher capacity limits.

Vertical scaling is most appropriate for single-instance deployments, services that don't scale horizontally well, or temporary capacity increases. For most production scenarios, horizontal scaling is preferred.

### Auto-Scaling

Auto-scaling automatically adds or removes instances based on metrics like CPU utilization, memory usage, request rate, or response time. This enables dynamic capacity management that responds to actual demand patterns.

Modern platforms provide various auto-scaling implementations. Kubernetes offers Horizontal Pod Autoscaler (HPA) that scales based on CPU, memory, or custom metrics. Cloud providers like AWS provide Auto Scaling Groups that integrate with load balancers. Docker Swarm supports replicated services that can be scaled up or down. Service discovery tools like Consul or etcd enable dynamic upstream configuration updates as instances are added or removed.

Auto-scaling requires careful metric selection, appropriate thresholds, and coordination with application lifecycle management to ensure smooth scaling operations.

---

## Production Best Practices

Production deployments require careful consideration of high availability, health checks, monitoring, and operational concerns. Following established best practices ensures reliable and maintainable systems.

### High Availability Configuration

Always deploy at least two instances per service to achieve high availability. Multiple instances provide automatic failover capabilities, enable zero-downtime deployments, and distribute load across servers.

```nginx
upstream auth-service {
    server auth-service:8081;
    server auth-service-2:8081;  # Minimum 2 for HA
}
```

With multiple instances, if one server fails or is taken down for maintenance, traffic automatically routes to the remaining healthy servers. This redundancy is essential for production systems where downtime has business impact.

### Health Checks and Failure Detection

Configure automatic health checks using `max_fails` and `fail_timeout` parameters to detect and handle server failures without manual intervention.

```nginx
upstream auth-service {
    server auth-service:8081 max_fails=3 fail_timeout=30s;
    server auth-service-2:8081 max_fails=3 fail_timeout=30s;
}
```

The `max_fails` parameter defines how many consecutive failed requests trigger Nginx to mark a server as down. The `fail_timeout` parameter sets how long to wait before retrying a failed server. These values should be tuned based on your application's characteristics, balancing between fast failure detection and avoiding false positives from transient issues.

For services that require backup capacity, designate backup servers that are only used when primary servers fail:

```nginx
upstream auth-service {
    server auth-service:8081 max_fails=3 fail_timeout=30s;
    server auth-service-2:8081 max_fails=3 fail_timeout=30s;
    server auth-service-backup:8081 backup;  # Only used if primaries fail
}
```

### Algorithm Selection Guidelines

Choose load balancing algorithms based on service characteristics. Stateless REST APIs should use round-robin or least connections, depending on whether connection pooling is a concern. Stateful services like WebSocket applications require IP hash to maintain session affinity.

For services with connection pools, least connections provides better distribution and prevents connection pool exhaustion. For WebSocket services, IP hash is mandatory to ensure clients maintain their connection to the same server where their session state resides.

### Monitoring and Metrics

Comprehensive monitoring is essential for production systems. Track response times (p50, p95, p99 percentiles), error rates (4xx, 5xx), active connections, request rates, and server availability. These metrics help identify performance issues, capacity constraints, and failure patterns.

Tools like Nginx Plus provide built-in metrics dashboards, while Prometheus with Nginx Exporter enables custom metric collection and alerting. Grafana dashboards visualize these metrics over time, and APM tools like Datadog or New Relic provide application-level insights.

### Timeout Configuration

Configure appropriate timeouts for different request types. REST API requests typically need shorter timeouts (60 seconds), while WebSocket connections require much longer timeouts (days) to maintain persistent connections.

```nginx
location /api/auth {
    proxy_pass http://auth-service;
    proxy_connect_timeout 60s;    # Connection timeout
    proxy_send_timeout 60s;       # Send timeout
    proxy_read_timeout 60s;       # Read timeout
}

location /ws/matchmaking {
    proxy_pass http://matchmaking-service;
    proxy_connect_timeout 7d;     # Long-lived connections
    proxy_send_timeout 7d;
    proxy_read_timeout 7d;
}
```

Timeout values should balance between responsiveness and reliability, accounting for network conditions, server processing times, and user experience requirements.

---

## Service Discovery Integration

Service discovery enables dynamic configuration of upstream servers without manual IP address management. Different deployment environments provide various service discovery mechanisms.

### Docker Compose

In Docker Compose environments, service names resolve automatically through Docker's internal DNS. Services on the same Docker network can reference each other by name:

```nginx
upstream auth-service {
    server auth-service:8081;  # Resolves via Docker DNS
}
```

This works seamlessly within Docker Compose networks, with DNS resolution handled automatically by Docker's embedded DNS server. All services must be on the same Docker network for this to function.

#### Docker DNS and Multiple Service Instances

When you have multiple instances of the same service with different names (e.g., `auth-service-1`, `auth-service-2`, `auth-service-3`), Docker's internal DNS creates a separate DNS entry for each container/service name. Each service name resolves to the IP address of its corresponding container.

**How Docker DNS Works:**

1. **Each service name gets its own DNS entry:**
   - `auth-service-1` resolves to Container 1's IP (e.g., 172.20.0.2)
   - `auth-service-2` resolves to Container 2's IP (e.g., 172.20.0.3)
   - `auth-service-3` resolves to Container 3's IP (e.g., 172.20.0.4)

2. **Docker maintains a DNS table** mapping service names to IP addresses within the network

3. **All containers on the same network** can resolve any service name via Docker's embedded DNS server (127.0.0.11)

**Configuration in Nginx Upstream:**

When services have different names with suffixes, you must explicitly list each instance in the upstream block:

```nginx
upstream auth-service {
    server auth-service-1:8081;  # Resolves to auth-service-1 container IP
    server auth-service-2:8081;  # Resolves to auth-service-2 container IP
    server auth-service-3:8081;  # Resolves to auth-service-3 container IP
}
```

**How Docker Compose Service Names Work:**

In `docker-compose.yml`, if you define services like:

```yaml
services:
  auth-service-1:
    image: auth-service:latest
    networks:
      - battle-arena-network

  auth-service-2:
    image: auth-service:latest
    networks:
      - battle-arena-network

  auth-service-3:
    image: auth-service:latest
    networks:
      - battle-arena-network
```

Docker Compose creates:
- Three separate containers
- Three separate DNS entries (one per service name)
- All on the same network, so they can resolve each other's names

**Inter-Service Communication:**

Services can communicate with each other using their service names:

```java
// From any service, you can call:
http://auth-service-1:8081/api/health
http://auth-service-2:8081/api/health
http://auth-service-3:8081/api/health
```

Docker DNS automatically resolves these names to the correct container IPs.

**Example: Complete Flow**

1. Request arrives at Nginx: `/api/auth/login`
2. Nginx checks upstream block for `auth-service`
3. Nginx selects one instance (e.g., `auth-service-2`)
4. Nginx resolves `auth-service-2:8081` via Docker DNS
5. Docker DNS returns: `172.20.0.3:8081`
6. Nginx proxies request to that IP
7. Container processes request

**Docker Network DNS Resolution:**

You can verify DNS resolution from within a container:

```bash
# From inside any container on the network
docker exec -it battle-arena-nginx nslookup auth-service-1

# Output shows:
# Server:     127.0.0.11
# Address:    127.0.0.11:53
# Name:       auth-service-1
# Address:    172.20.0.2  # Container's IP
```

**Limitations with Multiple Named Instances:**

- **Manual configuration required**: Each instance must be explicitly listed in upstream blocks
- **Static configuration**: Adding/removing instances requires Nginx config changes
- **No automatic discovery**: Docker Compose doesn't automatically detect new instances

**Alternative: Using Replicas (Better Approach)**

For better automation, use Docker Compose replicas or Kubernetes replicas instead of manually named instances:

```yaml
services:
  auth-service:
    image: auth-service:latest
    deploy:
      replicas: 3  # Creates 3 instances
    networks:
      - battle-arena-network
```

However, this creates containers with generated names (e.g., `auth-service-1`, `auth-service-2`, etc.), so you still need to list them explicitly or use service discovery tools.

**Best Practice for Production:**

For production environments with dynamic scaling:
1. Use Kubernetes with Service endpoints (automatic DNS)
2. Use service discovery tools (Consul, etcd) with dynamic upstream updates
3. Use Nginx Plus with service discovery integrations
4. Or use load balancers that integrate with container orchestrators

**Current Development Setup:**

For local development with Docker Compose, manually listing instances is acceptable:

```nginx
upstream auth-service {
    server auth-service-1:8081;
    server auth-service-2:8081;
    server auth-service-3:8081;
}
```

Docker DNS handles the name-to-IP resolution automatically, so Nginx can route requests to any of these instances.

### Kubernetes

Kubernetes provides more sophisticated service discovery through Service resources and endpoints. You can reference services using their DNS names:

```nginx
upstream auth-service {
    server auth-service.default.svc.cluster.local:8081;
}
```

Kubernetes services provide load balancing, DNS resolution, and endpoint management automatically. For more dynamic scenarios, the Kubernetes API provides endpoint information that can be used to populate upstream configurations programmatically.

### Service Discovery Tools

Tools like Consul or etcd provide distributed service discovery with health checking and dynamic configuration. These typically require Nginx Plus or custom modules to enable dynamic upstream updates, but provide powerful capabilities for large-scale deployments with frequent service changes.

DNS-based service discovery uses SRV records to resolve service names to multiple backend IPs. The Nginx resolver directive enables dynamic DNS resolution:

```nginx
resolver 127.0.0.11 valid=30s;  # Docker DNS

upstream auth-service {
    server auth-service:8081;  # Resolves dynamically
}
```

---

## Failover and Reliability

Robust failover mechanisms ensure service continuity when servers experience problems. Nginx provides built-in features for automatic failover and recovery.

### Automatic Failure Detection

The combination of `max_fails` and `fail_timeout` creates an automatic failure detection and recovery system. When a server accumulates the specified number of failed requests within the timeout period, Nginx marks it as unavailable and stops routing traffic to it. After the fail timeout expires, Nginx attempts to reconnect and resume traffic if the server has recovered.

This mechanism provides resilience against transient failures while preventing cascading failures from repeatedly hitting unhealthy servers. Tuning these parameters requires understanding your application's failure patterns and recovery characteristics.

### Backup Server Configuration

Backup servers provide an additional layer of redundancy. They remain inactive during normal operation and only receive traffic when all primary servers are unavailable. This configuration is useful for disaster recovery scenarios, maintenance windows, or cost optimization where backup servers can be smaller or less expensive.

```nginx
upstream auth-service {
    server auth-service:8081 max_fails=3 fail_timeout=30s;
    server auth-service-2:8081 max_fails=3 fail_timeout=30s;
    server auth-service-backup:8081 backup;  # Only used if primaries fail
}
```

### Maintenance Mode

The `down` parameter allows manual marking of servers as unavailable, which is useful for planned maintenance, gradual deployments, or troubleshooting:

```nginx
upstream auth-service {
    server auth-service:8081;
    server auth-service-2:8081 down;  # Temporarily disabled
}
```

This enables zero-downtime deployments where you can drain traffic from one server, perform updates, and then switch traffic back while updating the other server.

---

## Performance Optimization

Performance optimization focuses on reducing latency, maximizing throughput, and efficient resource utilization. Several techniques can improve upstream performance.

### Keep-Alive Connections

Reusing connections to upstream servers reduces overhead from connection establishment and teardown. Nginx supports connection pooling to upstream servers:

```nginx
upstream auth-service {
    server auth-service:8081;
    keepalive 32;  # Maintain 32 keep-alive connections
}
```

This maintains a pool of idle connections ready to handle requests, eliminating the TCP handshake overhead for most requests. The connection pool size should be tuned based on concurrent request patterns and server capacity.

### Connection Pool Distribution

For services that manage connection pools, such as database connections, the least connections algorithm ensures more even distribution:

```nginx
upstream profile-service {
    least_conn;  # Better for connection pooling
    server profile-service:8082;
}
```

This prevents individual servers from exhausting their connection pools while others remain underutilized, improving overall system efficiency and preventing connection-related errors.

### Buffer Tuning

Tuning proxy buffers can improve performance for services that handle large requests or responses:

```nginx
location /api/profile {
    proxy_pass http://profile-service;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
}
```

Larger buffers accommodate larger responses without spooling to disk, while smaller buffers conserve memory. The optimal configuration depends on typical request and response sizes, available memory, and traffic patterns.

---

## Service-Specific Configurations

Each service in the Battle Arena architecture has unique characteristics that influence optimal load balancing configuration.

### Auth Service

The auth service is a stateless REST API handling authentication requests. It experiences high throughput as every request requires authentication, making horizontal scaling critical. Round-robin load balancing is appropriate since no session affinity is required. Health checks are essential given the critical nature of authentication, and multiple instances provide redundancy for this critical service.

The service benefits from low latency configuration, appropriate timeouts for authentication requests, and monitoring to detect performance degradation that could impact user experience.

### Profile Service

The profile service combines stateless REST API with external caching via Redis. It experiences medium-high load with frequent read and update operations. Least connections algorithm is recommended to better manage database connection pools, ensuring even distribution of database connections across service instances.

The shared Redis cache eliminates cache invalidation concerns across instances, and aggressive caching strategies can reduce database load. Configuration should account for read-heavy patterns while maintaining update consistency.

### Leaderboard Service

The leaderboard service is read-heavy, with most operations being queries rather than updates. It can benefit significantly from aggressive caching strategies using Redis or CDN. Horizontal scaling with multiple read replicas is effective since reads can be distributed independently of writes.

Round-robin load balancing works well for this stateless read-heavy service. High cache hit rates are expected, reducing actual database queries. The service can scale independently for reads versus writes, allowing optimization of each operation type.

### Matchmaking Service

The matchmaking service is stateful, using WebSocket connections to maintain queue state, hero selections, and lobby management. This makes session affinity critical - clients must stay connected to the same server instance throughout the matchmaking process.

IP hash load balancing is required to ensure the same client always connects to the same server. If a client reconnects to a different server, they lose their queue position, hero selections, and match state. The load distribution may be uneven due to IP-based routing, but this is necessary to maintain session consistency.

The service experiences variable load depending on concurrent players in the queue. Scaling requires careful consideration of session affinity and state management. Consider consistent hashing for better distribution if using Nginx Plus or custom modules.

### Game Engine Service

The game engine service is critically stateful, maintaining game state (HP, positions, turns, scores) server-side for the entire match duration. This makes it the most complex service from a load balancing perspective.

IP hash is absolutely required for game state consistency. If a player reconnects to a different server during an active game, they lose connection to their game and cannot rejoin. The entire match state resides on the original server, making server affinity essential for the 4-5 minute match duration.

Production considerations include match state persistence for recovery scenarios, graceful server shutdown to finish active matches, match migration capabilities for server failures, and heartbeat monitoring to detect disconnections. Advanced resilience patterns may include match state replication through Redis pub/sub or database storage, enabling recovery from server crashes mid-match.

---

## Advanced Deployment Patterns

Modern deployment practices leverage load balancing for sophisticated deployment strategies that minimize risk and downtime.

### Consistent Hashing

Consistent hashing provides better load distribution than IP hash while maintaining session affinity. It handles server additions and removals more gracefully, redistributing only affected sessions rather than all sessions. This requires Nginx Plus or custom modules but offers significant advantages for large-scale WebSocket deployments with dynamic scaling.

### Canary Deployments

Canary deployments gradually introduce new versions by routing a small percentage of traffic to the new version while monitoring for issues:

```nginx
upstream auth-service {
    server auth-service-v1:8081 weight=90;  # 90% traffic to stable version
    server auth-service-v2:8081 weight=10;  # 10% traffic to canary version
}
```

This enables testing new versions in production with limited risk. If issues are detected, traffic can be routed away from the canary immediately. If successful, the weight can be gradually increased until all traffic uses the new version.

### Blue-Green Deployments

Blue-green deployments maintain two identical environments and switch traffic between them:

```nginx
# Blue environment (current)
upstream auth-service {
    server auth-service-blue:8081;
}

# After deployment, switch to green:
upstream auth-service {
    server auth-service-green:8081;
}
```

This provides instant rollback capability - if issues are discovered after switching, traffic can immediately route back to the blue environment. Zero-downtime deployments are achieved by deploying to the inactive environment, verifying functionality, then switching traffic.

### Circuit Breaker Pattern

Circuit breaker patterns prevent cascading failures by monitoring upstream server health and automatically routing traffic away from failing services. When failure rates exceed thresholds, the circuit opens, routing to backup servers or returning errors rather than repeatedly hitting failing servers. After a recovery period, the circuit closes and normal routing resumes.

---

## Monitoring and Observability

Effective monitoring provides visibility into system behavior, enabling proactive issue detection and performance optimization. Key metrics include response times at various percentiles (p50, p95, p99), error rates by status code category, active connections per server, request rates, and server availability percentages.

Monitoring tools range from Nginx Plus with built-in dashboards to Prometheus with Nginx Exporter for custom metric collection. Grafana provides visualization capabilities, while APM tools like Datadog or New Relic offer application-level insights across the stack.

---

## Troubleshooting Guide

Common issues with upstream services have systematic approaches for diagnosis and resolution.

### Servers Marked as Down

When servers are automatically marked as down, investigate server logs for errors, verify network connectivity between Nginx and upstream servers, check application health endpoints, review resource utilization (CPU, memory), and verify `max_fails` and `fail_timeout` settings aren't too aggressive.

### Uneven Load Distribution

Uneven load can result from IP hash with uneven client distribution, weighted configuration issues, or server capacity differences. Solutions include switching to least connections for better distribution, adjusting weights based on actual capacity, or equalizing server capacities.

### WebSocket Connection Issues

For WebSocket problems, verify IP hash is enabled for sticky sessions, confirm upgrade headers are configured correctly, ensure timeouts are set appropriately for long-lived connections, verify servers can handle WebSocket connections, and check network stability.

### High Response Times

Investigate server-side performance bottlenecks, measure network latency between Nginx and upstream servers, check for connection pool exhaustion, verify upstream servers aren't overloaded, and review buffer sizes for optimization opportunities.

---

## References

- [Nginx Upstream Module Documentation](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Nginx Load Balancing Guide](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [WebSocket Load Balancing](https://www.nginx.com/blog/websocket-nginx/)
- [High Availability Patterns](https://docs.nginx.com/nginx/admin-guide/high-availability/ha-keepalived/)
- [Nginx Plus Features](https://www.nginx.com/products/nginx/)

---

**Last Updated:** 2025-11-15  
**Version:** 1.0  
**Author:** Battle Arena Development Team
