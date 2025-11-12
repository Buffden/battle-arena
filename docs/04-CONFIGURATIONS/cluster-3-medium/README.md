# 📊 Cluster 3: Medium Scale Configuration
## Battle Arena - Medium Scale Configuration for Growing Applications

**Traffic:** 10,000-100,000 users/day  
**Cost:** $110-545/month  
**Target:** Growing applications, production applications  
**Status:** ✅ Documentation Complete

---

## 📊 Cluster Overview

### **Characteristics:**
- **Traffic:** 10,000-100,000 users/day (~300K-3M users/month)
- **Cost:** $110-545/month
- **Target Audience:** Growing applications, production applications
- **Configuration:** Auto-scaling, caching, CDN, optimization
- **Complexity:** Medium to High

### **Key Features:**
- ✅ Kubernetes orchestration (required)
- ✅ Kafka message queue (required)
- ✅ Self-hosted monitoring (Prometheus, Grafana)
- ✅ Self-hosted logging (ELK Stack or Loki + Grafana)
- ✅ Distributed tracing (optional, Jaeger)
- ✅ Service Mesh (optional, Istio/Linkerd)
- ✅ Auto-scaling (Kubernetes HPA/VPA)
- ✅ Advanced load balancing
- ✅ CDN (Cloudflare free tier or paid tier)

---

## 🏗️ Architecture

### **Component Choices:**
- **Orchestration:** Kubernetes (required)
- **Message Queue:** Kafka (required)
- **Service Mesh:** Optional (Istio/Linkerd)
- **Monitoring:** Self-hosted (Prometheus, Grafana)
- **Logging:** Self-hosted (ELK Stack or Loki + Grafana)
- **Tracing:** Optional (Jaeger)
- **CDN:** Cloudflare free tier or paid tier

### **Infrastructure:**
- **Compute:** Kubernetes cluster (3-5 nodes, 2-4 CPU, 4-8GB RAM per node)
- **Database:** MongoDB Atlas paid tier (2GB-10GB) OR self-hosted with replication
- **Cache:** Redis Cloud paid tier (100MB-500MB) OR self-hosted with replication
- **Message Queue:** Kafka cluster (3+ brokers) OR Confluent Cloud paid tier
- **API Gateway:** Nginx or Kong (multiple instances)
- **CI/CD:** GitHub Actions (free tier or paid tier)

---

## 💰 Cost Breakdown

### **Option 1: Self-Hosted + Kubernetes - $110-300/month**
```
✅ Kubernetes cluster: $50-150/month (managed Kubernetes, 3-5 nodes)
✅ MongoDB Atlas paid tier: $9-50/month (2GB-10GB storage)
✅ Redis Cloud paid tier: $10-50/month (100MB-500MB memory)
✅ Kafka (self-hosted): $0/month (included in Kubernetes cluster)
✅ Monitoring (self-hosted): $0/month (Prometheus, Grafana)
✅ Logging (self-hosted): $0/month (ELK Stack or Loki + Grafana)
✅ Tracing (self-hosted): $0/month (Jaeger, optional)
✅ GitHub Actions free tier: $0/month (2,000 minutes/month)
✅ Cloudflare free tier: $0/month (unlimited bandwidth)
💰 Total Cost: $110-300/month
```

### **Option 2: Managed Services + Kubernetes - $300-545/month**
```
✅ Kubernetes cluster: $50-150/month (managed Kubernetes, 3-5 nodes)
✅ MongoDB Atlas paid tier: $25-100/month (10GB storage)
✅ Redis Cloud paid tier: $20-100/month (500MB memory)
✅ Kafka (Confluent Cloud paid tier): $30-100/month (managed Kafka)
✅ Monitoring (self-hosted): $0/month (Prometheus, Grafana)
✅ Logging (self-hosted): $0/month (ELK Stack or Loki + Grafana)
✅ Tracing (self-hosted): $0/month (Jaeger, optional)
✅ GitHub Actions free tier: $0/month (2,000 minutes/month)
✅ Cloudflare free tier: $0/month (unlimited bandwidth)
💰 Total Cost: $300-545/month
```

---

## 🚀 Quick Start

### **Prerequisites:**
- Kubernetes cluster (3-5 nodes)
- kubectl installed
- GitHub account (for CI/CD)
- Cloud account (for deployment)
- MongoDB Atlas account (paid tier)
- Redis Cloud account (paid tier)
- Kafka cluster (self-hosted or Confluent Cloud)

### **Quick Setup:**
1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

2. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Verify Services:**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

4. **Access Application:**
   - Frontend: https://your-domain.com
   - API Gateway: https://your-domain.com/api
   - MongoDB: MongoDB Atlas connection string
   - Redis: Redis Cloud connection string
   - Kafka: Kafka cluster connection string

### **Detailed Setup:**
See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

---

## 📋 Documentation

### **Cluster 3 Documentation:**
- **[README.md](./README.md)** - Cluster overview (this file) ✅
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Cluster architecture details ✅
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide ✅
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuration guide ✅
- **[COST_BREAKDOWN.md](./COST_BREAKDOWN.md)** - Cost breakdown ✅
- **[SCALING_GUIDE.md](./SCALING_GUIDE.md)** - When to scale to Cluster 4 ✅
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide ✅

### **Cluster 3 Diagrams:**
- **[Cluster 3 Architecture Diagram](../../03-DIAGRAMS/architecture/cluster-3-medium-architecture.puml)** - Architecture diagram ✅
- **[Cluster 3 Deployment Diagram](../../03-DIAGRAMS/architecture/cluster-3-medium-deployment.puml)** - Deployment diagram ✅

---

## 🔄 Scaling to Cluster 4

### **When to Scale:**
- Traffic exceeds 100,000 users/day
- Need service mesh (required)
- Need advanced sharding
- Need distributed tracing
- Budget allows ($545-3,200/month)

### **Scaling Steps:**
1. Review [SCALING_GUIDE.md](./SCALING_GUIDE.md)
2. Follow [Migration Guide](../../05-MIGRATION_GUIDES/cluster-3-to-4.md)
3. Update configurations
4. Test and verify
5. Deploy to Cluster 4

---

## ✅ Key Takeaways

### **For Medium Scale Applications:**
1. **Use Kubernetes** - Required for auto-scaling
2. **Use Kafka** - Required for message persistence
3. **Use Self-Hosted Monitoring** - Prometheus, Grafana
4. **Use Self-Hosted Logging** - ELK Stack or Loki + Grafana
5. **Use Service Mesh** - Optional (Istio/Linkerd)
6. **Use Distributed Tracing** - Optional (Jaeger)
7. **Target Cost:** $110-545/month

### **Essential Components:**
- Kubernetes (orchestration, required)
- Kafka (message queue, required)
- MongoDB Atlas (paid tier)
- Redis Cloud (paid tier)
- Prometheus + Grafana (monitoring, self-hosted)
- ELK Stack or Loki + Grafana (logging, self-hosted)
- Nginx or Kong (API Gateway)
- GitHub Actions (CI/CD, free tier or paid tier)
- Jaeger (tracing, optional)
- Service Mesh (Istio/Linkerd, optional)

### **Optional Components:**
- Service Mesh (Istio/Linkerd, optional)
- Distributed Tracing (Jaeger, optional)
- CDN (Cloudflare free tier or paid tier)

---

## 📚 Related Documentation

### **Core Architecture:**
- **[High-Level Design (HLD)](../../02-ARCHITECTURE/HIGH_LEVEL_DESIGN/README.md)** - System architecture reference
- **[Low-Level Design (LLD)](../../02-ARCHITECTURE/LOW_LEVEL_DESIGN/README.md)** - Component design reference
- **[UML Diagrams](../../03-DIAGRAMS/README.md)** - Architecture diagrams

### **Cost & Scaling:**
- **[Cost Scaling & Traffic Management](../../COST_SCALING_AND_TRAFFIC_MANAGEMENT.md)** - Detailed cost scaling guide
- **[Student-Friendly Industrial-Grade Guide](../../STUDENT_FRIENDLY_INDUSTRIAL_GRADE.md)** - Free/low-cost components

### **Other Clusters:**
- **[Cluster 1: Student/Minimal](../cluster-1-student/README.md)** - Student configuration
- **[Cluster 2: Small Scale](../cluster-2-small/README.md)** - Small scale configuration
- **[Cluster 4: Large Scale](../cluster-4-large/README.md)** - Next cluster
- **[Cluster 5: Very Large Scale](../cluster-5-very-large/README.md)** - Very large scale

---

## ✅ Documentation Status

### **Cluster 3 Documentation:**
- ✅ README.md - Cluster overview
- ✅ ARCHITECTURE.md - Architecture guide
- ✅ DEPLOYMENT.md - Deployment guide
- ✅ CONFIGURATION.md - Configuration guide
- ✅ COST_BREAKDOWN.md - Cost breakdown
- ✅ SCALING_GUIDE.md - Scaling guide
- ✅ QUICK_START.md - Quick start guide

### **Cluster 3 Diagrams:**
- ✅ Cluster 3 Architecture Diagram - Architecture diagram
- ✅ Cluster 3 Deployment Diagram - Deployment diagram

**Status:** ✅ Cluster 3 Documentation Complete

**Last Updated:** 2024

