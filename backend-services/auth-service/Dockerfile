# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and checkstyle.xml (needed for Maven build)
COPY pom.xml .
COPY checkstyle.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Install wget for health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r spring && useradd -r -g spring spring

# Copy JAR from build stage (as root, then change ownership)
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring:spring

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Expose port (internal container port - not exposed to host)
EXPOSE 8081

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

