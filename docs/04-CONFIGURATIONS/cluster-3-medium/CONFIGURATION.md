# 📊 Cluster 3: Medium Scale - Configuration Guide
## Battle Arena - Medium Scale Configuration for Growing Applications

**Traffic:** 10,000-100,000 users/day  
**Cost:** $110-545/month  
**Target:** Growing applications, production applications  
**Status:** ✅ Ready for Implementation

---

## ⚙️ Configuration Overview

### **Configuration Strategy:**
- **Environment Variables** - Use Kubernetes ConfigMaps and Secrets
- **Kubernetes ConfigMaps** - Configuration data (non-sensitive)
- **Kubernetes Secrets** - Sensitive data (passwords, API keys, certificates)
- **Managed Services** - Use MongoDB Atlas and Redis Cloud (paid tiers)
- **Self-Hosted Services** - Kafka, Prometheus, Grafana, ELK Stack, Jaeger
- **Service Mesh** - Service Mesh configuration (optional)

---

## 🔧 Service Configurations

### **1. Frontend Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: battle-arena
data:
  NODE_ENV: "production"
  API_URL: "https://your-domain.com/api"
  WS_URL: "wss://your-domain.com/ws"
  ENABLE_ANALYTICS: "true"
  LOG_LEVEL: "info"
```

#### **Environment Variables:**
```bash
NODE_ENV=production
API_URL=https://your-domain.com/api
WS_URL=wss://your-domain.com/ws
ENABLE_ANALYTICS=true
LOG_LEVEL=info
```

---

### **2. Auth Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: auth-service-config
  namespace: battle-arena
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SERVER_PORT: "8081"
  LOGGING_LEVEL_ROOT: "INFO"
  LOGGING_LEVEL_COM_BATTLEARENA: "DEBUG"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: auth-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
  JWT_SECRET: "your-jwt-secret-key"
  JWT_EXPIRATION: "86400000"
```

#### **Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_BATTLEARENA=DEBUG
```

---

### **3. Profile Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: profile-service-config
  namespace: battle-arena
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SERVER_PORT: "8082"
  LOGGING_LEVEL_ROOT: "INFO"
  LOGGING_LEVEL_COM_BATTLEARENA: "DEBUG"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: profile-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
  REDIS_HOST: "your-redis-host.redis.cloud"
  REDIS_PORT: "12345"
  REDIS_PASSWORD: "your-redis-password"
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
```

#### **Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8082
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_BATTLEARENA=DEBUG
```

---

### **4. Leaderboard Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: leaderboard-service-config
  namespace: battle-arena
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SERVER_PORT: "8083"
  LOGGING_LEVEL_ROOT: "INFO"
  LOGGING_LEVEL_COM_BATTLEARENA: "DEBUG"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: leaderboard-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
  REDIS_HOST: "your-redis-host.redis.cloud"
  REDIS_PORT: "12345"
  REDIS_PASSWORD: "your-redis-password"
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
```

#### **Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8083
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_BATTLEARENA=DEBUG
```

---

### **5. Matchmaking Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: matchmaking-service-config
  namespace: battle-arena
data:
  NODE_ENV: "production"
  PORT: "3002"
  LOG_LEVEL: "info"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: matchmaking-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  REDIS_HOST: "your-redis-host.redis.cloud"
  REDIS_PORT: "12345"
  REDIS_PASSWORD: "your-redis-password"
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
```

#### **Environment Variables:**
```bash
NODE_ENV=production
PORT=3002
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
LOG_LEVEL=info
```

---

### **6. Game Engine Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-engine-service-config
  namespace: battle-arena
data:
  NODE_ENV: "production"
  PORT: "3003"
  LOG_LEVEL: "info"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: game-engine-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  REDIS_HOST: "your-redis-host.redis.cloud"
  REDIS_PORT: "12345"
  REDIS_PASSWORD: "your-redis-password"
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
```

#### **Environment Variables:**
```bash
NODE_ENV=production
PORT=3003
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
LOG_LEVEL=info
```

---

### **7. Configuration Service Configuration**

#### **Kubernetes ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configuration-service-config
  namespace: battle-arena
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SERVER_PORT: "8084"
  LOGGING_LEVEL_ROOT: "INFO"
  LOGGING_LEVEL_COM_BATTLEARENA: "DEBUG"
```

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: configuration-service-secret
  namespace: battle-arena
type: Opaque
stringData:
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
  REDIS_HOST: "your-redis-host.redis.cloud"
  REDIS_PORT: "12345"
  REDIS_PASSWORD: "your-redis-password"
```

#### **Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8084
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_BATTLEARENA=DEBUG
```

---

## 🗄️ Database Configurations

### **1. MongoDB Configuration**

#### **MongoDB Atlas Connection:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena?retryWrites=true&w=majority
```

#### **MongoDB Atlas Settings:**
- **Storage:** 2GB-10GB (paid tier)
- **Replication:** Replica set (3+ nodes)
- **Backup:** Automated backups (daily)
- **Monitoring:** MongoDB Atlas monitoring
- **Security:** Network isolation, encryption at rest

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: battle-arena
type: Opaque
stringData:
  uri: "mongodb+srv://username:password@cluster.mongodb.net/battlearena"
```

---

### **2. Redis Configuration**

#### **Redis Cloud Connection:**
```bash
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

#### **Redis Cloud Settings:**
- **Memory:** 100MB-500MB (paid tier)
- **Replication:** Replica set (3+ nodes)
- **Persistence:** AOF (Append Only File)
- **Monitoring:** Redis Cloud monitoring
- **Security:** Network isolation, encryption at rest

#### **Kubernetes Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: redis-secret
  namespace: battle-arena
type: Opaque
stringData:
  host: "your-redis-host.redis.cloud"
  port: "12345"
  password: "your-redis-password"
```

---

## 🔄 Message Queue Configurations

### **Apache Kafka Configuration**

#### **Kafka Bootstrap Servers:**
```bash
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

#### **Kafka Topics:**
```bash
# Matchmaking events
KAFKA_TOPIC_MATCHMAKING=matchmaking.events

# Game events
KAFKA_TOPIC_GAME=game.events

# Profile updates
KAFKA_TOPIC_PROFILE=profile.updates

# Leaderboard updates
KAFKA_TOPIC_LEADERBOARD=leaderboard.updates
```

#### **Kafka Producer Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kafka-producer-config
  namespace: battle-arena
data:
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
  KAFKA_ACKS: "all"
  KAFKA_RETRIES: "3"
  KAFKA_BATCH_SIZE: "16384"
  KAFKA_LINGER_MS: "10"
  KAFKA_BUFFER_MEMORY: "33554432"
```

#### **Kafka Consumer Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kafka-consumer-config
  namespace: battle-arena
data:
  KAFKA_BOOTSTRAP_SERVERS: "kafka:9092"
  KAFKA_GROUP_ID: "battle-arena-consumer-group"
  KAFKA_AUTO_OFFSET_RESET: "earliest"
  KAFKA_ENABLE_AUTO_COMMIT: "true"
  KAFKA_AUTO_COMMIT_INTERVAL_MS: "1000"
  KAFKA_MAX_POLL_RECORDS: "500"
```

#### **Kafka Cluster Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kafka-config
  namespace: battle-arena
data:
  KAFKA_BROKER_ID: "1"
  KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
  KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092"
  KAFKA_LISTENERS: "PLAINTEXT://0.0.0.0:9092"
  KAFKA_NUM_PARTITIONS: "10"
  KAFKA_REPLICATION_FACTOR: "3"
  KAFKA_LOG_RETENTION_HOURS: "168"
  KAFKA_LOG_SEGMENT_BYTES: "1073741824"
  KAFKA_LOG_RETENTION_CHECK_INTERVAL_MS: "300000"
```

---

## 🔐 Security Configuration

### **1. JWT Configuration**

#### **JWT Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: jwt-secret
  namespace: battle-arena
type: Opaque
stringData:
  secret: "your-jwt-secret-key"
  expiration: "86400000"
```

#### **JWT Environment Variables:**
```bash
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
```

---

### **2. SSL/TLS Configuration**

#### **Let's Encrypt Certificate:**
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

#### **Ingress TLS Configuration:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: battle-arena
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: api-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 4200
```

---

### **3. Network Policies**

#### **Network Policy (Auth Service):**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: auth-service-network-policy
  namespace: battle-arena
spec:
  podSelector:
    matchLabels:
      app: auth-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx
    ports:
    - protocol: TCP
      port: 8081
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: mongodb
    ports:
    - protocol: TCP
      port: 27017
```

---

## 📊 Monitoring Configuration

### **1. Prometheus Configuration**

#### **Prometheus ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: battle-arena
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    scrape_configs:
      - job_name: 'auth-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: auth-service
      - job_name: 'profile-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: profile-service
      - job_name: 'leaderboard-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: leaderboard-service
      - job_name: 'matchmaking-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: matchmaking-service
      - job_name: 'game-engine-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: game-engine-service
      - job_name: 'configuration-service'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: configuration-service
```

---

### **2. Grafana Configuration**

#### **Grafana ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-config
  namespace: battle-arena
data:
  grafana.ini: |
    [server]
    root_url = https://grafana.your-domain.com
    [auth.anonymous]
    enabled = true
    [datasources]
    [datasources.prometheus]
    type = prometheus
    url = http://prometheus:9090
    access = proxy
```

#### **Grafana Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: grafana-secret
  namespace: battle-arena
type: Opaque
stringData:
  admin-password: "your-grafana-admin-password"
```

---

## 📝 Logging Configuration

### **1. ELK Stack Configuration**

#### **Elasticsearch Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: elasticsearch-config
  namespace: battle-arena
data:
  elasticsearch.yml: |
    cluster.name: battle-arena
    node.name: ${HOSTNAME}
    network.host: 0.0.0.0
    discovery.type: single-node
    xpack.security.enabled: false
```

#### **Logstash Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: logstash-config
  namespace: battle-arena
data:
  logstash.conf: |
    input {
      beats {
        port => 5044
      }
    }
    filter {
      if [fields][service] {
        mutate {
          add_field => { "service" => "%{[fields][service]}" }
        }
      }
    }
    output {
      elasticsearch {
        hosts => ["elasticsearch:9200"]
        index => "battle-arena-%{+YYYY.MM.dd}"
      }
    }
```

---

### **2. Loki Configuration**

#### **Loki ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: loki-config
  namespace: battle-arena
data:
  loki.yml: |
    auth_enabled: false
    server:
      http_listen_port: 3100
    ingester:
      lifecycler:
        address: 127.0.0.1
        ring:
          kvstore:
            store: inmemory
          replication_factor: 1
        final_sleep: 0s
      chunk_idle_period: 5m
      chunk_retain_period: 30s
    schema_config:
      configs:
        - from: 2020-10-24
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
```

---

## 🔍 Tracing Configuration (Optional)

### **Jaeger Configuration**

#### **Jaeger ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jaeger-config
  namespace: battle-arena
data:
  JAEGER_SAMPLER_TYPE: "const"
  JAEGER_SAMPLER_PARAM: "1"
  JAEGER_REPORTER_LOG_SPANS: "true"
  JAEGER_AGENT_HOST: "jaeger-agent"
  JAEGER_AGENT_PORT: "6831"
```

---

## 🛡️ Service Mesh Configuration (Optional)

### **Istio Configuration**

#### **Istio VirtualService:**
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: auth-service-vs
  namespace: battle-arena
spec:
  hosts:
  - auth-service
  http:
  - match:
    - uri:
        prefix: "/"
    route:
    - destination:
        host: auth-service
        subset: v1
      weight: 100
```

#### **Istio DestinationRule:**
```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: auth-service-dr
  namespace: battle-arena
spec:
  host: auth-service
  subsets:
  - name: v1
    labels:
      version: v1
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
```

---

## ✅ Configuration Checklist

### **Service Configurations:**
- [ ] Frontend service configured
- [ ] Auth service configured
- [ ] Profile service configured
- [ ] Leaderboard service configured
- [ ] Matchmaking service configured
- [ ] Game Engine service configured
- [ ] Configuration service configured

### **Database Configurations:**
- [ ] MongoDB Atlas configured
- [ ] Redis Cloud configured
- [ ] Connection strings configured
- [ ] Secrets created

### **Message Queue Configurations:**
- [ ] Kafka cluster configured
- [ ] Kafka topics created
- [ ] Kafka producers configured
- [ ] Kafka consumers configured

### **Security Configurations:**
- [ ] JWT secrets configured
- [ ] SSL/TLS certificates configured
- [ ] Network policies configured
- [ ] Service Mesh configured (optional)

### **Monitoring Configurations:**
- [ ] Prometheus configured
- [ ] Grafana configured
- [ ] Alerting configured

### **Logging Configurations:**
- [ ] ELK Stack configured OR Loki + Grafana configured
- [ ] Log aggregation configured
- [ ] Log retention configured

### **Tracing Configurations:**
- [ ] Jaeger configured (optional)
- [ ] Tracing enabled in services

---

## 📚 Related Documentation

- **[Cluster 3: Medium Scale README](./README.md)** - Cluster overview
- **[Cluster 3: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 3: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 3: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 3: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 4
- **[Cluster 3: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 3 Configuration Documentation Ready

**Last Updated:** 2024

