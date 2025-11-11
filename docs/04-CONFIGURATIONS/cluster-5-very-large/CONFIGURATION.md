# 🚀 Cluster 5: Very Large Scale - Configuration Guide
## Battle Arena - Very Large Scale Configuration for Production Applications

**Traffic:** 1,000,000+ users/day  
**Cost:** $3,200+/month  
**Target:** Enterprise applications, global applications  
**Status:** ✅ Ready for Implementation

---

## ⚙️ Configuration Overview

### **Configuration Strategy:**
- **Environment Variables** - Use Kubernetes ConfigMaps and Secrets
- **Kubernetes ConfigMaps** - Configuration data (non-sensitive)
- **Kubernetes Secrets** - Sensitive data (passwords, API keys, certificates)
- **Managed Services** - Use MongoDB Atlas and Redis Cloud (paid tiers, advanced sharding, multi-region replication)
- **Self-Hosted Services** - Kafka, Prometheus, Grafana, ELK Stack, Jaeger
- **Service Mesh** - Service Mesh configuration (required)
- **Advanced Sharding** - Database, cache, and message queue sharding
- **Multi-Region Deployment** - Multi-region deployment configuration (required)
- **Global Load Balancing** - Global load balancing configuration (required)
- **Data Replication** - Data replication across regions configuration (required)

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

---

### **3-6. Other Services Configuration**
(Same pattern as Cluster 3, but with higher resource requirements)

---

## 🗄️ Database Configurations

### **1. MongoDB Configuration (Advanced Sharding)**

#### **MongoDB Atlas Connection:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena?retryWrites=true&w=majority
```

#### **MongoDB Atlas Settings:**
- **Storage:** 100GB+ (paid tier)
- **Replication:** Replica set (3+ nodes per region)
- **Sharding:** Advanced sharding (required)
- **Shard Key:** User ID, Region, Hero ID
- **Multi-Region Replication:** Multi-region replication (required)
- **Global Data Distribution:** Global data distribution across regions
- **Backup:** Automated backups (daily)
- **Monitoring:** MongoDB Atlas monitoring
- **Security:** Network isolation, encryption at rest

---

### **2. Redis Configuration (Advanced Sharding)**

#### **Redis Cloud Connection:**
```bash
REDIS_HOST=your-redis-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

#### **Redis Cloud Settings:**
- **Memory:** 2GB+ (paid tier)
- **Replication:** Replica set (3+ nodes per region)
- **Sharding:** Advanced sharding (required)
- **Shard Key:** User ID, Region, Hero ID
- **Multi-Region Replication:** Multi-region replication (required)
- **Global Data Distribution:** Global data distribution across regions
- **Persistence:** AOF (Append Only File)
- **Monitoring:** Redis Cloud monitoring
- **Security:** Network isolation, encryption at rest

---

## 🔄 Message Queue Configurations

### **Apache Kafka Configuration (Advanced Sharding)**

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
  KAFKA_NUM_PARTITIONS: "100"
  KAFKA_REPLICATION_FACTOR: "3"
  KAFKA_MULTI_REGION_REPLICATION: "true"
  KAFKA_LOG_RETENTION_HOURS: "168"
  KAFKA_LOG_SEGMENT_BYTES: "1073741824"
  KAFKA_LOG_RETENTION_CHECK_INTERVAL_MS: "300000"
```

---

## 🔐 Security Configuration

### **1. JWT Configuration**
(Same as Cluster 3)

### **2. SSL/TLS Configuration**
(Same as Cluster 3)

### **3. Network Policies**
(Same as Cluster 3)

---

## 🛡️ Service Mesh Configuration (Required)

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
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
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
      maxEjectionPercent: 50
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    tls:
      mode: ISTIO_MUTUAL
```

#### **Istio PeerAuthentication (mTLS):**
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: battle-arena
spec:
  mtls:
    mode: STRICT
```

---

## 📊 Monitoring Configuration
(Same as Cluster 3, but with higher resource requirements)

---

## 📝 Logging Configuration
(Same as Cluster 3, but with higher resource requirements)

---

## 🔍 Tracing Configuration (Required)

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
- [ ] MongoDB Atlas configured (advanced sharding)
- [ ] Redis Cloud configured (advanced sharding)
- [ ] Connection strings configured
- [ ] Secrets created
- [ ] Sharding configured

### **Message Queue Configurations:**
- [ ] Kafka cluster configured (advanced sharding)
- [ ] Kafka topics created (50+ partitions)
- [ ] Kafka producers configured
- [ ] Kafka consumers configured

### **Security Configurations:**
- [ ] JWT secrets configured
- [ ] SSL/TLS certificates configured
- [ ] Network policies configured
- [ ] Service Mesh configured (required)
- [ ] mTLS configured (required)

### **Monitoring Configurations:**
- [ ] Prometheus configured
- [ ] Grafana configured
- [ ] Alerting configured

### **Logging Configurations:**
- [ ] ELK Stack configured OR Loki + Grafana configured
- [ ] Log aggregation configured
- [ ] Log retention configured

### **Tracing Configurations:**
- [ ] Jaeger configured (required)
- [ ] Tracing enabled in services (required)

---

## 📚 Related Documentation

- **[Cluster 5: Very Large Scale README](./README.md)** - Cluster overview
- **[Cluster 5: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 5: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 5: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 5: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 5
- **[Cluster 5: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 5 Configuration Documentation Ready

**Last Updated:** 2024
