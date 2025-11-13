# 📊 Cluster 3: Medium Scale - Quick Start Guide
## Battle Arena - Medium Scale Quick Start for Growing Applications

**Traffic:** 10,000-100,000 users/day  
**Cost:** $110-545/month  
**Target:** Growing applications, production applications  
**Status:** ✅ Ready for Implementation

---

## 🚀 Quick Start Overview

### **Prerequisites:**
- Kubernetes cluster (3-5 nodes, 2-4 CPU, 4-8GB RAM per node)
- kubectl installed
- Helm installed (optional, for package management)
- GitHub account (for CI/CD)
- Cloud account (for deployment)
- MongoDB Atlas account (paid tier: 2GB-10GB storage)
- Redis Cloud account (paid tier: 100MB-500MB memory)
- Domain name (for SSL certificates)

### **Time to Deploy:**
- **Kubernetes Setup:** 30-45 minutes
- **Service Deployment:** 20-30 minutes
- **Managed Services Setup:** 15-20 minutes
- **Monitoring Setup:** 15-20 minutes
- **Logging Setup:** 15-20 minutes
- **Total:** 95-135 minutes

---

## 📦 Step 1: Create Kubernetes Cluster

### **Option 1: Google Kubernetes Engine (GKE)**
```bash
# Create GKE cluster
gcloud container clusters create battle-arena-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --zone=us-central1-a \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=5

# Configure kubectl
gcloud container clusters get-credentials battle-arena-cluster --zone us-central1-a
```

### **Option 2: Amazon EKS**
```bash
# Create EKS cluster
eksctl create cluster \
  --name battle-arena-cluster \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5 \
  --region us-east-1

# Configure kubectl
aws eks update-kubeconfig --name battle-arena-cluster --region us-east-1
```

### **Option 3: Azure Kubernetes Service (AKS)**
```bash
# Create AKS cluster
az aks create \
  --resource-group battle-arena-rg \
  --name battle-arena-cluster \
  --node-count 3 \
  --node-vm-size Standard_B2s \
  --enable-cluster-autoscaler \
  --min-count 2 \
  --max-count 5

# Configure kubectl
az aks get-credentials --resource-group battle-arena-rg --name battle-arena-cluster
```

### **Verify Cluster:**
```bash
# Check cluster nodes
kubectl get nodes

# Check cluster info
kubectl cluster-info
```

---

## ⚙️ Step 2: Configure Managed Services

### **1. MongoDB Atlas Setup:**
1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create account and cluster
   - Choose paid tier (M10, M20, or M30)
   - Configure network access (allow Kubernetes cluster IPs)
   - Create database user
   - Get connection string

2. **Connection String:**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/battlearena?retryWrites=true&w=majority
   ```

### **2. Redis Cloud Setup:**
1. **Create Redis Cloud Account:**
   - Go to https://redis.com/cloud
   - Create account and database
   - Choose paid tier (100MB-500MB memory)
   - Configure network access (allow Kubernetes cluster IPs)
   - Create database password
   - Get connection details

2. **Connection Details:**
   ```bash
   REDIS_HOST=your-redis-host.redis.cloud
   REDIS_PORT=12345
   REDIS_PASSWORD=your-redis-password
   ```

---

## 🔧 Step 3: Clone Repository

```bash
# Clone repository
git clone <repository-url>
cd battle-arena

# Check kubectl
kubectl version --client

# Check Helm (optional)
helm version
```

---

## 🔐 Step 4: Create Kubernetes Secrets

### **Create Namespace:**
```bash
kubectl create namespace battle-arena
```

### **Create Secrets:**
```bash
# MongoDB Secret
kubectl create secret generic mongodb-secret \
  --from-literal=uri=mongodb+srv://username:password@cluster.mongodb.net/battlearena \
  --namespace=battle-arena

# Redis Secret
kubectl create secret generic redis-secret \
  --from-literal=host=your-redis-host.redis.cloud \
  --from-literal=port=12345 \
  --from-literal=password=your-redis-password \
  --namespace=battle-arena

# JWT Secret
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-jwt-secret-key-change-in-production \
  --namespace=battle-arena

# Google OAuth Secret (Optional - for Story-2.7)
kubectl create secret generic google-oauth-secret \
  --from-literal=client-id=your-google-client-id \
  --from-literal=client-secret=your-google-client-secret \
  --from-literal=redirect-uri=https://your-domain.com/auth/google/callback \
  --namespace=battle-arena

# Grafana Secret (for monitoring)
kubectl create secret generic grafana-secret \
  --from-literal=admin-password=your-grafana-admin-password \
  --namespace=battle-arena
```

---

## 🚀 Step 5: Deploy Kafka

### **Deploy Zookeeper:**
```bash
# Deploy Zookeeper
kubectl apply -f k8s/kafka/zookeeper.yaml -n battle-arena

# Wait for Zookeeper to be ready
kubectl wait --for=condition=ready pod -l app=zookeeper -n battle-arena --timeout=300s
```

### **Deploy Kafka:**
```bash
# Deploy Kafka
kubectl apply -f k8s/kafka/kafka.yaml -n battle-arena

# Wait for Kafka to be ready
kubectl wait --for=condition=ready pod -l app=kafka -n battle-arena --timeout=300s
```

### **Create Kafka Topics:**
```bash
# Create Kafka topics
kubectl exec -it kafka-0 -n battle-arena -- kafka-topics.sh \
  --create --topic matchmaking.events \
  --bootstrap-server localhost:9092 \
  --partitions 10 \
  --replication-factor 3

kubectl exec -it kafka-0 -n battle-arena -- kafka-topics.sh \
  --create --topic game.events \
  --bootstrap-server localhost:9092 \
  --partitions 10 \
  --replication-factor 3

kubectl exec -it kafka-0 -n battle-arena -- kafka-topics.sh \
  --create --topic profile.updates \
  --bootstrap-server localhost:9092 \
  --partitions 10 \
  --replication-factor 3

kubectl exec -it kafka-0 -n battle-arena -- kafka-topics.sh \
  --create --topic leaderboard.updates \
  --bootstrap-server localhost:9092 \
  --partitions 10 \
  --replication-factor 3
```

---

## 🚀 Step 6: Deploy Services

### **Deploy ConfigMaps:**
```bash
# Deploy ConfigMaps
kubectl apply -f k8s/configmaps/ -n battle-arena
```

### **Deploy Services:**
```bash
# Deploy Auth Service
kubectl apply -f k8s/services/auth-service/ -n battle-arena

# Deploy Profile Service
kubectl apply -f k8s/services/profile-service/ -n battle-arena

# Deploy Leaderboard Service
kubectl apply -f k8s/services/leaderboard-service/ -n battle-arena

# Deploy Matchmaking Service
kubectl apply -f k8s/services/matchmaking-service/ -n battle-arena

# Deploy Game Engine Service
kubectl apply -f k8s/services/game-engine-service/ -n battle-arena

# Deploy Configuration Service
kubectl apply -f k8s/services/configuration-service/ -n battle-arena

# Deploy Frontend
kubectl apply -f k8s/services/frontend/ -n battle-arena
```

### **Deploy API Gateway (Nginx):**
```bash
# Deploy Nginx
kubectl apply -f k8s/nginx/ -n battle-arena
```

### **Wait for Services to be Ready:**
```bash
# Wait for all pods to be ready
kubectl wait --for=condition=ready pod -l app=auth-service -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=profile-service -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=leaderboard-service -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=matchmaking-service -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=game-engine-service -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=configuration-service -n battle-arena --timeout=300s
```

---

## 📊 Step 7: Deploy Monitoring (Prometheus + Grafana)

### **Deploy Prometheus:**
```bash
# Deploy Prometheus
kubectl apply -f k8s/monitoring/prometheus/ -n battle-arena

# Wait for Prometheus to be ready
kubectl wait --for=condition=ready pod -l app=prometheus -n battle-arena --timeout=300s
```

### **Deploy Grafana:**
```bash
# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana/ -n battle-arena

# Wait for Grafana to be ready
kubectl wait --for=condition=ready pod -l app=grafana -n battle-arena --timeout=300s
```

### **Access Grafana:**
```bash
# Port-forward Grafana
kubectl port-forward -n battle-arena svc/grafana 3000:3000

# Access Grafana at http://localhost:3000
# Default username: admin
# Default password: (from grafana-secret)
```

---

## 📝 Step 8: Deploy Logging (ELK Stack or Loki + Grafana)

### **Option 1: ELK Stack**
```bash
# Deploy Elasticsearch
kubectl apply -f k8s/logging/elasticsearch/ -n battle-arena

# Deploy Logstash
kubectl apply -f k8s/logging/logstash/ -n battle-arena

# Deploy Kibana
kubectl apply -f k8s/logging/kibana/ -n battle-arena

# Wait for ELK Stack to be ready
kubectl wait --for=condition=ready pod -l app=elasticsearch -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=logstash -n battle-arena --timeout=300s
kubectl wait --for=condition=ready pod -l app=kibana -n battle-arena --timeout=300s
```

### **Option 2: Loki + Grafana**
```bash
# Deploy Loki
kubectl apply -f k8s/logging/loki/ -n battle-arena

# Wait for Loki to be ready
kubectl wait --for=condition=ready pod -l app=loki -n battle-arena --timeout=300s

# Configure Grafana to use Loki (already deployed in Step 7)
```

---

## 🔍 Step 9: Deploy Tracing (Jaeger, Optional)

```bash
# Deploy Jaeger
kubectl apply -f k8s/tracing/jaeger/ -n battle-arena

# Wait for Jaeger to be ready
kubectl wait --for=condition=ready pod -l app=jaeger -n battle-arena --timeout=300s

# Access Jaeger
kubectl port-forward -n battle-arena svc/jaeger 16686:16686

# Access Jaeger at http://localhost:16686
```

---

## 🔐 Step 10: Configure SSL/TLS Certificates

### **Install cert-manager:**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
kubectl wait --for=condition=ready pod -l app=cert-manager -n cert-manager --timeout=300s
```

### **Create ClusterIssuer:**
```bash
# Create ClusterIssuer
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml
```

### **Deploy Ingress with TLS:**
```bash
# Deploy Ingress
kubectl apply -f k8s/ingress/ -n battle-arena

# Wait for SSL certificate to be issued
kubectl get certificate -n battle-arena
```

---

## ✅ Step 11: Verify Deployment

### **Check Pods:**
```bash
# Check all pods
kubectl get pods -n battle-arena

# Check pod status
kubectl get pods -n battle-arena -o wide
```

### **Check Services:**
```bash
# Check all services
kubectl get services -n battle-arena

# Check service endpoints
kubectl get endpoints -n battle-arena
```

### **Check Ingress:**
```bash
# Check ingress
kubectl get ingress -n battle-arena

# Check ingress status
kubectl describe ingress api-ingress -n battle-arena
```

### **Check HPA:**
```bash
# Check HPA
kubectl get hpa -n battle-arena

# Check HPA status
kubectl describe hpa auth-service-hpa -n battle-arena
```

### **Test Services:**
```bash
# Test Auth Service
curl https://your-domain.com/api/auth/health

# Test Profile Service
curl https://your-domain.com/api/profile/health

# Test Leaderboard Service
curl https://your-domain.com/api/leaderboard/health

# Test Matchmaking Service
curl https://your-domain.com/api/matchmaking/health

# Test Game Engine Service
curl https://your-domain.com/api/game/health

# Test Configuration Service
curl https://your-domain.com/api/config/health
```

---

## 🌐 Step 12: Access Application

### **Frontend:**
```bash
# Access frontend
https://your-domain.com
```

### **API Gateway:**
```bash
# Access API Gateway
https://your-domain.com/api
```

### **Monitoring:**
```bash
# Access Prometheus
kubectl port-forward -n battle-arena svc/prometheus 9090:9090
# Access at http://localhost:9090

# Access Grafana
kubectl port-forward -n battle-arena svc/grafana 3000:3000
# Access at http://localhost:3000
```

### **Logging:**
```bash
# Access Kibana (if using ELK Stack)
kubectl port-forward -n battle-arena svc/kibana 5601:5601
# Access at http://localhost:5601

# Access Grafana (if using Loki + Grafana)
kubectl port-forward -n battle-arena svc/grafana 3000:3000
# Access at http://localhost:3000
```

### **Tracing:**
```bash
# Access Jaeger
kubectl port-forward -n battle-arena svc/jaeger 16686:16686
# Access at http://localhost:16686
```

---

## 🔄 Step 13: Configure Auto-Scaling

### **Deploy HPA:**
```bash
# Deploy HPA for all services
kubectl apply -f k8s/hpa/ -n battle-arena

# Check HPA status
kubectl get hpa -n battle-arena
```

### **Configure VPA (Optional):**
```bash
# Install VPA
kubectl apply -f k8s/vpa/ -n battle-arena

# Check VPA status
kubectl get vpa -n battle-arena
```

---

## 📊 Step 14: Configure Monitoring Dashboards

### **Import Grafana Dashboards:**
1. **Access Grafana:**
   ```bash
   kubectl port-forward -n battle-arena svc/grafana 3000:3000
   ```

2. **Import Dashboards:**
   - Go to Grafana → Dashboards → Import
   - Import pre-built dashboards for services
   - Configure data sources (Prometheus)

---

## 🔧 Troubleshooting

### **Pod Not Starting:**
```bash
# Check pod logs
kubectl logs <pod-name> -n battle-arena

# Check pod events
kubectl describe pod <pod-name> -n battle-arena
```

### **Service Not Accessible:**
```bash
# Check service endpoints
kubectl get endpoints <service-name> -n battle-arena

# Check service events
kubectl describe service <service-name> -n battle-arena
```

### **Ingress Not Working:**
```bash
# Check ingress status
kubectl describe ingress api-ingress -n battle-arena

# Check ingress controller logs
kubectl logs -l app=nginx-ingress-controller -n ingress-nginx
```

### **SSL Certificate Not Issued:**
```bash
# Check certificate status
kubectl get certificate -n battle-arena

# Check certificate events
kubectl describe certificate api-tls -n battle-arena
```

---

## 📚 Next Steps

### **1. Configure CI/CD:**
- Set up GitHub Actions for automated deployments
- Configure automated testing
- Configure automated monitoring

### **2. Configure Service Mesh (Optional):**
- Deploy Istio or Linkerd
- Configure service-to-service communication
- Configure circuit breakers and retries

### **3. Configure Advanced Monitoring:**
- Set up alerting rules
- Configure custom dashboards
- Configure log aggregation

### **4. Optimize Performance:**
- Optimize database queries
- Optimize message queue
- Optimize service performance

### **5. Scale to Cluster 4:**
- Review scaling indicators
- Plan scaling strategy
- Execute scaling to Cluster 4

---

## ✅ Quick Start Checklist

### **Pre-Deployment:**
- [ ] Kubernetes cluster created (3-5 nodes)
- [ ] kubectl configured
- [ ] MongoDB Atlas configured (paid tier)
- [ ] Redis Cloud configured (paid tier)
- [ ] Domain name configured
- [ ] SSL certificates configured

### **Deployment:**
- [ ] Namespace created
- [ ] Secrets created
- [ ] ConfigMaps created
- [ ] Kafka deployed
- [ ] Services deployed
- [ ] API Gateway deployed
- [ ] Monitoring deployed
- [ ] Logging deployed
- [ ] Tracing deployed (optional)
- [ ] Ingress configured
- [ ] SSL certificates issued

### **Post-Deployment:**
- [ ] Pods running
- [ ] Services accessible
- [ ] Ingress working
- [ ] SSL certificates working
- [ ] Monitoring working
- [ ] Logging working
- [ ] Tracing working (optional)
- [ ] Auto-scaling configured
- [ ] Dashboards configured

---

## 📚 Related Documentation

- **[Cluster 3: Medium Scale README](./README.md)** - Cluster overview
- **[Cluster 3: Architecture Guide](./ARCHITECTURE.md)** - Architecture guide
- **[Cluster 3: Deployment Guide](./DEPLOYMENT.md)** - Deployment guide
- **[Cluster 3: Configuration Guide](./CONFIGURATION.md)** - Configuration guide
- **[Cluster 3: Cost Breakdown](./COST_BREAKDOWN.md)** - Cost breakdown
- **[Cluster 3: Scaling Guide](./SCALING_GUIDE.md)** - When to scale to Cluster 4

---

**Status:** ✅ Cluster 3 Quick Start Documentation Ready

**Last Updated:** 2024

