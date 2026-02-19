---
layout: post.njk
title: "Spring Boot 3.x 심화편: GraalVM Native Image & Micrometer Observability 실전 가이드"
description: "Spring Boot 3.x로 업그레이드한 후, GraalVM Native Image로 서버리스 최적화하는 방법과 Micrometer Observation API로 통합 관찰 가능성 구축하는 실전 가이드를 제공합니다."
slug: spring-boot3-advanced
lang: ko
date: 2026-02-19T02:00:00+09:00
category: Backend
tags:
  - java
  - spring-boot
thumbnail: https://images.unsplash.com/photo-1678697892687-b81b68612eeb?q=80&w=2764&auto=format&fit=crop
draft: false
relatedPosts:
  - java17-spring-boot3-upgrade
---

> 이 글은 **[이전 포스팅: 구 시스템을 Spring Boot 3.x + Java 17로 업그레이드하기]** 의 심화편입니다. 업그레이드를 완료했다면, 이제 Spring Boot 3.x만이 제공하는 두 가지 강력한 무기를 제대로 활용해봅시다.

***

## 🧠 Part 1. GraalVM Native Image

### Native Image란 무엇인가?

기존 Java 애플리케이션은 JVM 위에서 **JIT(Just-In-Time) 컴파일** 방식으로 실행됩니다. 반면 GraalVM Native Image는 **AOT(Ahead-Of-Time) 컴파일**을 통해 JVM 없이 실행 가능한 **네이티브 바이너리**를 생성합니다.

```text
[기존 JVM 방식]
Java 소스 → .class (바이트코드) → JVM 로드 → JIT 컴파일 → 실행
⏱ 기동 시간: 수 초 ~ 수십 초

[GraalVM Native Image]
Java 소스 → AOT 정적 분석 → 네이티브 바이너리 → 즉시 실행
⚡ 기동 시간: 수십 ms
```

Spring Boot 3.x는 AOT 처리 과정을 공식 지원하면서 GraalVM 연동이 훨씬 간편해졌습니다. [docs.spring](https://docs.spring.io/spring-boot/reference/packaging/native-image/introducing-graalvm-native-images.html)

***

### Native Image 빌드 설정

**Maven (`pom.xml`)**

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

**Gradle (`build.gradle`)**

```groovy
plugins {
    id 'org.springframework.boot' version '3.3.0'
    id 'org.graalvm.buildtools.native' version '0.9.27' // AOT + Native 지원
}
```

#### **빌드 명령어**

```bash
# Maven
./mvnw -Pnative native:compile

# Gradle
./gradlew nativeCompile

# Docker Buildpack 방식 (GraalVM 미설치 환경에서도 가능)
./mvnw -Pnative spring-boot:build-image
```

***

### 성능 비교: JVM vs Native Image

| 항목 | JVM 방식 | Native Image |
| --- | --- | --- |
| 기동 시간 | 2~5초 | **50~100ms** |
| 메모리 사용량 | 높음 (JVM 오버헤드) | **최대 10배 절감** |
| 최고 처리량(Throughput) | **JIT 최적화로 우수** | JVM 대비 다소 낮음 |
| 빌드 시간 | 빠름 (수 초) | 느림 (수 분) |
| 리플렉션 지원 | 완전 지원 | **별도 힌트 필요** |

 [docs.spring](https://docs.spring.io/spring-boot/reference/packaging/native-image/introducing-graalvm-native-images.html)

{% alert "success", "어디에 써야 할까?" %}

- **적합**: AWS Lambda, Google Cloud Run 등 서버리스/컨테이너 환경, 빠른 스케일아웃이 필요한 마이크로서비스
- **비적합**: 장시간 실행되는 모놀리식 서비스 (JIT 최적화의 이점이 Native Image를 앞서는 경우)

{% endalert %}

***

### ⚠️ Native Image 적용 시 주의사항: Reflection 힌트

Native Image의 가장 큰 함정은 **리플렉션(Reflection)** 입니다. 빌드 시점에 정적 분석으로 처리되기 때문에, 런타임에 동적으로 클래스를 로드하는 코드는 별도로 힌트를 등록해야 합니다. [docs.spring](https://docs.spring.io/spring-boot/reference/packaging/native-image/index.html)

```java
// @RegisterReflectionForBinding 어노테이션으로 힌트 등록
@RegisterReflectionForBinding(UserResponse.class)
@Service
public class UserService {
    // ...
}
```

또는 `reflect-config.json` 파일로 직접 명시:

```json
[
  {
    "name": "com.example.dto.UserResponse",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true
  }
]
```

Spring Boot 3.x의 `RuntimeHintsRegistrar` 인터페이스를 구현하면 프로그래밍 방식으로 힌트를 등록할 수도 있습니다. [notavoid.tistory](https://notavoid.tistory.com/215)

```java
@Component
public class MyRuntimeHints implements RuntimeHintsRegistrar {
    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        hints.reflection().registerType(UserResponse.class,
            MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
            MemberCategory.INVOKE_DECLARED_METHODS);
    }
}
```

***

## 📡 Part 2. Micrometer Observability

### Spring Boot 3.x의 관찰 가능성 혁신

Spring Boot 2.x에서는 **메트릭(Micrometer)** 과 **분산 추적(Spring Cloud Sleuth)** 이 완전히 별개였습니다. Spring Boot 3.x에서는 이 둘이 **Micrometer Observation API**로 통합되었습니다. [baeldung](https://www.baeldung.com/spring-boot-3-observability)

```text
[Spring Boot 2.x]
메트릭 → Micrometer
분산 추적 → Spring Cloud Sleuth (별도 라이브러리)

[Spring Boot 3.x]
메트릭 + 분산 추적 + 로그 → Micrometer Observation API (통합)
```

{% alert "info", "정보" %}
Micrometer는 `관찰 가능성의 SLF4J`라고 이해하면 됩니다 — 구체적인 모니터링 벤더(Prometheus, Zipkin, Datadog 등)와 무관하게 동일한 API로 계측합니다. [micrometer](https://micrometer.io)
{% endalert %}

***

### 의존성 추가

```xml
<!-- Spring Boot Actuator (메트릭 노출) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer Prometheus (메트릭 수집기) -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

<!-- Micrometer Tracing + OpenZipkin Brave (분산 추적) -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

***

### `application.yml` 기본 설정

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus, metrics
  tracing:
    sampling:
      probability: 1.0  # 개발환경: 100% 샘플링 (운영환경은 0.1~0.3 권장)
  metrics:
    tags:
      application: ${spring.application.name}  # 모든 메트릭에 앱 이름 태깅

spring:
  application:
    name: my-service
```

***

### Observation API 실전 활용

Spring Boot 3.x의 핵심은 `@Observed` 단 하나의 어노테이션으로 **메트릭 + 트레이싱 + 로그**를 동시에 계측할 수 있다는 점입니다. [softwaremill](https://softwaremill.com/new-micrometer-observation-api-with-spring-boot-3/)

**방법 1: `@Observed` 어노테이션 (가장 간단)**

```java
@Configuration
public class ObservationConfig {
    @Bean
    ObservedAspect observedAspect(ObservationRegistry registry) {
        return new ObservedAspect(registry); // AOP 기반 자동 계측
    }
}

@Service
public class OrderService {

    // 이 메서드 실행 시 자동으로 메트릭 + 트레이스 생성
    @Observed(name = "order.create", contextualName = "주문 생성")
    public Order createOrder(OrderRequest request) {
        // ...
    }
}
```

**방법 2: `ObservationRegistry` 직접 사용 (세밀한 제어)**

```java
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ObservationRegistry registry;

    public PaymentResult processPayment(PaymentRequest request) {
        return Observation.createNotStarted("payment.process", registry)
            .lowCardinalityKeyValue("method", request.getMethod())   // 메트릭 태그
            .highCardinalityKeyValue("orderId", request.getOrderId()) // 트레이스 전용 태그
            .observe(() -> {
                // 실제 결제 처리 로직
                return doPayment(request);
            });
    }
}
```

{% alert "success", "lowCardinality VS highCardinality" %}

- `lowCardinality`: 값의 종류가 적은 태그 (예: `method=CARD`, `status=SUCCESS`) → **메트릭과 트레이스 모두에 추가**

- `highCardinality`: 값이 무한히 다양한 태그 (예: `orderId=12345`) → **트레이스에만 추가** (메트릭에 추가 시 카디널리티 폭발 위험)

- 참고: [spring](https://spring.academy/guides/microservices-observability-reactive-spring-boot-3)

{% endalert %}

***

### 전체 관찰 가능성 스택 구성

Spring Boot 3.x + Micrometer를 운영 수준으로 활용하려면 아래 스택이 사실상 표준입니다: [spring](https://spring.academy/guides/microservices-observability-reactive-spring-boot-3)

```text
[내 Spring Boot 앱]
  │
  ├── /actuator/prometheus ──→ [Prometheus] ──→ [Grafana] (메트릭 시각화)
  │
  └── Zipkin Reporter ────────→ [Zipkin / Tempo] (분산 트레이스)
                                      │
                               [Grafana에서 통합 대시보드]
```

**Docker Compose로 로컬 모니터링 환경 구성:**

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  zipkin:
    image: openzipkin/zipkin
    ports:
      - "9411:9411"
```

`prometheus.yml` 스크레이프 설정:

```yaml
scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']
```

***

## 🗺️ 전체 아키텍처 조감도

```text
[Spring Boot 3.x 앱]
  ├── GraalVM AOT
  │     └── 컨테이너 기동: ~80ms, 메모리 절감
  │
  └── Micrometer Observation
        ├── @Observed / ObservationRegistry
        │     ├── 메트릭 → Prometheus → Grafana
        │     └── 트레이스 → Zipkin/Tempo → Grafana
        └── MDC 자동 연동 → 로그에 traceId/spanId 자동 삽입
```

{% alert "info", "정보" %}
MDC 자동 연동 덕분에 Grafana에서 `메트릭 이상 감지 → 해당 트레이스 조회 → 연관 로그 검색`까지 하나의 흐름으로 연결됩니다. [baeldung](https://www.baeldung.com/spring-boot-3-observability)
{% endalert %}

***

## ✅ 실전 적용 우선순위

| 단계 | 항목 | 난이도 | 효과 |
| --- | --- | --- | --- |
| 1 | Actuator + Prometheus 메트릭 노출 | ⭐ | 즉시 모니터링 가능 |
| 2 | `@Observed`로 핵심 비즈니스 메서드 계측 | ⭐⭐ | 서비스 병목 추적 |
| 3 | Zipkin 분산 트레이스 연동 | ⭐⭐ | MSA 장애 원인 추적 |
| 4 | Grafana 대시보드 구성 | ⭐⭐⭐ | 통합 관찰 환경 완성 |
| 5 | GraalVM Native Image 전환 | ⭐⭐⭐⭐ | 서버리스/컨테이너 최적화 |
