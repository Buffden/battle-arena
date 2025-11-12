# 🚀 Cluster 4: Large Scale - Deployment Guide
## Battle Arena - Large Scale Deployment for Production Applications

**Traffic:** 100,000-1,000,000 users/day  
**Cost:** $545-3,200/month  
**Target:** Production applications, enterprise applications  
**Status:** ✅ Ready for Implementation

---

## 🚀 Deployment Overview

### **Deployment Strategy:**
- **Kubernetes Orchestration** - Kubernetes for container orchestration (required)
- **Kubernetes Cluster** - Kubernetes cluster (5-10 nodes, 4-8 CPU, 8-16GB RAM per node)
- **Service Mesh** - Service Mesh for service-to-service communication (required)
- **Managed Services** - MongoDB Atlas, Redis Cloud (paid tiers)
- **Self-Hosted Services** - Kafka, Prometheus, Grafana, ELK Stack, Jaeger
- **Advanced Sharding** - Database, cache, and message queue sharding
- **Auto-Scaling** - Auto-scaling with Kubernetes HPA/VPA
- **Updates** - Rolling updates (zero-downtime deployments)
- **Multi-Region** - Optional multi-region deployment

### **Deployment Options:**
1. **Self-Hosted + Kubernetes** - Self-hosted services with Kubernetes ($545-1,800/month)
2. **Managed Services + Kubernetes** - Managed services with Kubernetes ($1,800-3,200/month)

---

## 📋 Prerequisites

### **1. Kubernetes Cluster:**
- Kubernetes cluster (5-10 nodes, 4-8 CPU, 8-16GB RAM per node)
- kubectl installed
- Helm installed (recommended)
- Git installed
- Domain name (for SSL certificates)

### **2. Managed Services:**
- MongoDB Atlas account (paid tier: 10GB-100GB storage)
- Redis Cloud account (paid tier: 500MB-2GB memory)
- GitHub account (for CI/CD)

### **3. Self-Hosted Services:**
- Kafka cluster (5+ brokers, self-hosted on Kubernetes)
- Service Mesh (Istio/Linkerd, self-hosted on Kubernetes)
- Prometheus (metrics collection, self-hosted on Kubernetes)
- Grafana (metrics visualization, self-hosted on Kubernetes)
- ELK Stack or Loki + Grafana (logging, self-hosted on Kubernetes)
- Jaeger (tracing, required, self-hosted on Kubernetes)

---

## 🏗️ Deployment Architecture

### **Kubernetes Cluster Deployment:**
```
Kubernetes Cluster (5-10 nodes, 4-8 CPU, 8-16GB RAM per node)
    ├── Frontend Pods (Angular, 3-5 replicas)
    ├── API Gateway Pods (Kong/Nginx, 3-5 replicas)
    ├── Service Mesh (Istio/Linkerd, Required)
    ├── Auth Service Pods (Spring Boot, 3-5 replicas)
    ├── Profile Service Pods (Spring Boot, 3-5 replicas)
    ├── Leaderboard Service Pods (Spring Boot, 3-5 replicas)
    ├── Matchmaking Service Pods (Node.js, 5-10 replicas)
    ├── Game Engine Service Pods (Node.js, 5-10 replicas)
    ├── Configuration Service Pods (Spring Boot, 3 replicas)
    ├── Kafka Pods (5+ brokers)
    ├── Prometheus (Metrics)
    ├── Grafana (Dashboards)
    ├── ELK Stack or Loki + Grafana (Logging)
    └── Jaeger (Tracing, Required)
```

---

## ☸️ Kubernetes Configuration

### **Namespace:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: battle-arena
```

### **Deployment (Auth Service):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: battle-arena
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        version: v1
    spec:
      containers:
      - name: auth-service
        image: your-registry/auth-service:latest
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8081
          initialDelaySeconds: 10
          periodSeconds: 5
```

### **Service:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: battle-arena
spec:
  selector:
    app: auth-service
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
```

### **Horizontal Pod Autoscaler (HPA):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: battle-arena
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **Ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: battle-arena
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: api-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 8081
      - path: /api/profile
        pathType: Prefix
        backend:
          service:
            name: profile-service
            port:
              number: 8082
      - path: /api/leaderboard
        pathType: Prefix
        backend:
          service:
            name: leaderboard-service
            port:
              number: 8083
      - path: /api/matchmaking
        pathType: Prefix
        backend:
          service:
            name: matchmaking-service
            port:
              number: 3002
      - path: /api/game
        pathType: Prefix
        backend:
          service:
            name: game-engine-service
            port:
              number: 3003
      - path: /api/config
        pathType: Prefix
        backend:
          service:
            name: configuration-service
            port:
              number: 8084
```

---

## 🛡️ Service Mesh Deployment (Required)

### **Istio Installation:**
```bash
# Install Istio
istioctl install --set values.defaultRevision=default

# Enable Istio sidecar injection for namespace
kubectl label namespace battle-arena istio-injection=enabled
```

### **Istio VirtualService:**
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

### **Istio DestinationRule:**
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

---

## 🔄 Kafka Deployment

### **Kafka StatefulSet:**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka
  namespace: battle-arena
spec:
  serviceName: kafka
  replicas: 5
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
      - name: kafka
        image: confluentinc/cp-kafka:latest
        ports:
        - containerPort: 9092
        env:
        - name: KAFKA_BROKER_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: KAFKA_ZOOKEEPER_CONNECT
          value: zookeeper:2181
        - name: KAFKA_ADVERTISED_LISTENERS
          value: PLAINTEXT://kafka:9092
        - name: KAFKA_NUM_PARTITIONS
          value: "50"
        - name: KAFKA_REPLICATION_FACTOR
          value: "3"
        resources:
          requests:
            cpu: 1000m
            memory: 2Gi
          limits:
            cpu: 4000m
            memory: 8Gi
        volumeMounts:
        - name: kafka-data
          mountPath: /var/lib/kafka/data
  volumeClaimTemplates:
  - metadata:
      name: kafka-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 50Gi
```

---

## 📊 Monitoring Deployment

### **Prometheus Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: battle-arena
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 4Gi
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
```

### **Grafana Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: battle-arena
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: grafana-secret
              key: admin-password
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
```

---

## 📝 Logging Deployment

### **ELK Stack Deployment:**
```yaml
# Elasticsearch
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: battle-arena
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
        ports:
        - containerPort: 9200
        resources:
          requests:
            cpu: 1000m
            memory: 4Gi
          limits:
            cpu: 4000m
            memory: 8Gi
```

### **Loki + Grafana Deployment:**
```yaml
# Loki
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loki
  namespace: battle-arena
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loki
  template:
    metadata:
      labels:
        app: loki
    spec:
      containers:
      - name: loki
        image: grafana/loki:latest
        ports:
        - containerPort: 3100
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 4Gi
```

---

## 🔍 Tracing Deployment (Required)

### **Jaeger Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: battle-arena
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
        - containerPort: 14268
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
```

---

## 🚀 Deployment Steps

### **Step 1: Create Kubernetes Cluster**

1. **Create Kubernetes Cluster:**
   ```bash
   # GKE
   gcloud container clusters create battle-arena-cluster \
     --num-nodes=5 \
     --machine-type=n1-standard-4 \
     --zone=us-central1-a \
     --enable-autoscaling \
     --min-nodes=3 \
     --max-nodes=10
   
   # EKS
   eksctl create cluster \
     --name battle-arena-cluster \
     --nodegroup-name standard-workers \
     --node-type t3.large \
     --nodes 5 \
     --nodes-min 3 \
     --nodes-max 10
   
   # AKS
   az aks create \
     --resource-group battle-arena-rg \
     --name battle-arena-cluster \
     --node-count 5 \
     --node-vm-size Standard_B4ms \
     --enable-cluster-autoscaler \
     --min-count 3 \
     --max-count 10
   ```

2. **Configure kubectl:**
   ```bash
   # GKE
   gcloud container clusters get-credentials battle-arena-cluster --zone us-central1-a
   
   # EKS
   aws eks update-kubeconfig --name battle-arena-cluster
   
   # AKS
   az aks get-credentials --resource-group battle-arena-rg --name battle-arena-cluster
   ```

### **Step 2: Deploy Service Mesh**

1. **Install Istio:**
   ```bash
   # Install Istio
   istioctl install --set values.defaultRevision=default
   
   # Enable Istio sidecar injection for namespace
   kubectl label namespace battle-arena istio-injection=enabled
   ```

2. **Verify Service Mesh:**
   ```bash
   # Check Istio installation
   istioctl verify-install
   
   # Check Istio pods
   kubectl get pods -n istio-system
   ```

### **Step 3: Deploy Services**

1. **Create Namespace:**
   ```bash
   kubectl create namespace battle-arena
   ```

2. **Create Secrets:**
   ```bash
   kubectl create secret generic mongodb-secret \
     --from-literal=uri=mongodb+srv://username:password@cluster.mongodb.net/battlearena \
     --namespace=battle-arena
   
   kubectl create secret generic redis-secret \
     --from-literal=host=your-redis-host.redis.cloud \
     --from-literal=port=12345 \
     --from-literal=password=your-redis-password \
     --namespace=battle-arena
   
   kubectl create secret generic jwt-secret \
     --from-literal=secret=your-jwt-secret-key \
     --namespace=battle-arena
   ```

3. **Deploy Services:**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/deployments/
   kubectl apply -f k8s/services/
   kubectl apply -f k8s/ingress/
   kubectl apply -f k8s/hpa/
   kubectl apply -f k8s/service-mesh/
   ```

4. **Deploy Kafka:**
   ```bash
   kubectl apply -f k8s/kafka/
   ```

5. **Deploy Monitoring:**
   ```bash
   kubectl apply -f k8s/monitoring/
   ```

6. **Deploy Logging:**
   ```bash
   kubectl apply -f k8s/logging/
   ```

7. **Deploy Tracing:**
   ```bash
   kubectl apply -f k8s/tracing/
   ```

### **Step 4: Verify Deployment**

1. **Check Pods:**
   ```bash
   kubectl get pods -n battle-arena
   ```

2. **Check Services:**
   ```bash
   kubectl get services -n battle-arena
   ```

3. **Check Ingress:**
   ```bash
   kubectl get ingress -n battle-arena
   ```

4. **Check HPA:**
   ```bash
   kubectl get hpa -n battle-arena
   ```

5. **Check Service Mesh:**
   ```bash
   kubectl get virtualservices -n battle-arena
   kubectl get destinationrules -n battle-arena
   ```

---

## 🔐 Security Configuration

### **1. SSL/TLS Certificates:**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml

# SSL certificates will be automatically issued via Let's Encrypt
```

### **2. Network Policies:**
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

### **3. Service Mesh mTLS:**
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

## 📊 Monitoring & Logging

### **Monitoring (Prometheus + Grafana):**
1. **Deploy Prometheus:**
   ```bash
   kubectl apply -f k8s/monitoring/prometheus/
   ```

2. **Deploy Grafana:**
   ```bash
   kubectl apply -f k8s/monitoring/grafana/
   ```

3. **Access Grafana:**
   ```bash
   kubectl port-forward -n battle-arena svc/grafana 3000:3000
   # Access at http://localhost:3000
   ```

### **Logging (ELK Stack or Loki + Grafana):**
1. **Deploy ELK Stack:**
   ```bash
   kubectl apply -f k8s/logging/elk/
   ```

2. **Or Deploy Loki + Grafana:**
   ```bash
   kubectl apply -f k8s/logging/loki/
   ```

3. **Access Kibana or Grafana:**
   ```bash
   kubectl port-forward -n battle-arena svc/kibana 5601:5601
   # Access at http://localhost:5601
   ```

### **Tracing (Jaeger, Required):**
1. **Deploy Jaeger:**
   ```bash
   kubectl apply -f k8s/tracing/jaeger/
   ```

2. **Access Jaeger:**
   ```bash
   kubectl port-forward -n battle-arena svc/jaeger 16686:16686
   # Access at http://localhost:16686
   ```

---

## 🔄 Deployment Updates

### **Rolling Updates:**
```bash
# Update deployment
kubectl set image deployment/auth-service auth-service=your-registry/auth-service:v2.0.0 -n battle-arena

# Check rollout status
kubectl rollout status deployment/auth-service -n battle-arena

# Rollback if needed
kubectl rollout undo deployment/auth-service -n battle-arena
```

### **Automated Updates (CI/CD):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cluster 4

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/auth-service auth-service=your-registry/auth-service:${{ github.sha }} -n battle-arena
          kubectl rollout status deployment/auth-service -n battle-arena
```

---

## ✅ Deployment Checklist

### **Pre-Deployment:**
- [ ] Kubernetes cluster created (5-10 nodes)
- [ ] kubectl configured
- [ ] Helm installed (recommended)
- [ ] Secrets created
- [ ] ConfigMaps created
- [ ] MongoDB Atlas/Redis Cloud configured
- [ ] SSL certificates configured
- [ ] Network policies configured
- [ ] Service Mesh configured (required)
- [ ] GitHub Actions configured (optional)

### **Deployment:**
- [ ] Namespace created
- [ ] Service Mesh deployed (required)
- [ ] Services deployed
- [ ] Deployments created
- [ ] Services created
- [ ] Ingress created
- [ ] HPA created
- [ ] Kafka deployed
- [ ] Prometheus deployed
- [ ] Grafana deployed
- [ ] ELK Stack or Loki deployed
- [ ] Jaeger deployed (required)
- [ ] Service Mesh VirtualServices created
- [ ] Service Mesh DestinationRules created

### **Post-Deployment:**
- [ ] Pods running (kubectl get pods)
- [ ] Services accessible (kubectl get services)
- [ ] Ingress working (kubectl get ingress)
- [ ] HPA working (kubectl get hpa)
- [ ] Service Mesh working (kubectl get virtualservices, destinationrules)
- [ ] Health checks passing
- [ ] SSL certificates working
- [ ] API Gateway routing correctly
- [ ] Frontend accessible
- [ ] Monitoring working
- [ ] Logging working
- [ ] Tracing working (required)

---

## 📚 Related Documentation

- **[Cluster 4: Large Scale README](./README.md)** - Cluster overview
- **[Cluster 4: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 4: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 4: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 4: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 5
- **[Cluster 4: Quick Start](./QUICK_START.md)** - Quick start guide

---

**Status:** ✅ Cluster 4 Deployment Documentation Ready

**Last Updated:** 2024

