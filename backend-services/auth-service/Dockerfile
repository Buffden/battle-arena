# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY checkstyle.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r spring && useradd -r -g spring spring

COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar
USER spring:spring

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

