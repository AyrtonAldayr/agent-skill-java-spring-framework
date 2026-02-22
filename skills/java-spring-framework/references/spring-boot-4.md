# Spring Boot 4.0.x — Feature Reference

**Version**: 4.0.3 (Stable) | **Framework**: Spring 7.0.x | **Java baseline**: 17 (25 recommended)

---

## Table of Contents
1. [Platform Requirements](#1-platform-requirements)
2. [Auto-Configuration Changes](#2-auto-configuration-changes)
3. [Testing — @SpringBootTest & Slices](#3-testing--springboottest--slices)
4. [Actuator & Observability](#4-actuator--observability)
5. [GraalVM Native Image](#5-graalvm-native-image)
6. [Virtual Threads (Project Loom)](#6-virtual-threads-project-loom)
7. [Structured Concurrency (Java 25)](#7-structured-concurrency-java-25)
8. [Scoped Values (Java 25)](#8-scoped-values-java-25)
9. [Docker Compose Support](#9-docker-compose-support)
10. [Spring Security 7 Basics](#10-spring-security-7-basics)
11. [Reactive Stack (R2DBC + WebFlux)](#11-reactive-stack-r2dbc--webflux)

---

## 1. Platform Requirements

| Component | Version |
|---|---|
| Java (minimum) | 17 |
| Java (recommended) | 25 |
| GraalVM | 24+ |
| Spring Framework | 7.0.x |
| Jakarta EE | 11 |
| Servlet | 6.1 |
| JPA (Hibernate ORM) | 3.2 / 7.0 |
| Bean Validation | 3.1 |
| Jackson | 3.x |
| Kotlin | 2.2 |

---

## 2. Auto-Configuration Changes

### Functional Bean Registration (Native-Friendly)

Avoid `@ComponentScan` when targeting GraalVM. Use functional registration in `ApplicationContext` initialization:

```java
@SpringBootApplication(proxyBeanMethods = false)
public class Application {

    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class)
            .initializers(ctx -> {
                ctx.registerBean(UserService.class, UserServiceImpl::new);
                ctx.registerBean(UserRepository.class, UserRepositoryImpl::new);
            })
            .run(args);
    }
}
```

### Condition-Based Auto-Configuration

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(JdbcClient.class)
public class JdbcClientAutoConfiguration {

    @Bean
    JdbcClient jdbcClient(DataSource dataSource) {
        return JdbcClient.create(dataSource);
    }
}
```

---

## 3. Testing — @SpringBootTest & Slices

### Full Context Test

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ApplicationIntegrationTest {

    @Autowired RestTestClient client;

    @Test
    void healthEndpointIsUp() {
        client.get().uri("/actuator/health")
              .exchange().expectStatus().isOk();
    }
}
```

### Web Layer Slice

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean ProductService productService;

    @Test
    void shouldReturn200() throws Exception {
        given(productService.findAll()).willReturn(List.of(new Product(1L, "Widget")));
        mvc.perform(get("/api/products"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].name").value("Widget"));
    }
}
```

### Data Layer Slice

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired UserRepository repository;

    @Test
    void shouldPersistUser() {
        User saved = repository.save(new User("Alice", "alice@example.com"));
        assertThat(saved.id()).isNotNull();
    }
}
```

### Testcontainers (integration tests)

For full integration tests against a real database, use **Testcontainers**. Prefer this when testing repository logic, transactions, or schema; use `@MockBean` for unit/slice tests where the focus is the controller or service in isolation.

```kotlin
// build.gradle.kts
testImplementation("org.springframework.boot:spring-boot-testcontainers")
testImplementation("org.testcontainers:postgresql")
testImplementation("org.testcontainers:junit-jupiter")
```

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class OrderRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17")
        .withDatabaseName("testdb").withUsername("test").withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired OrderRepository repository;

    @Test
    void shouldFindOrdersByUserId() {
        // real DB; no mocks
        List<Order> orders = repository.findByUserId("user-1");
        assertThat(orders).isNotEmpty();
    }
}
```

**When to use @MockBean vs Testcontainers:** Use `@MockBean` in `@WebMvcTest` or `@DataJpaTest` when you want fast, isolated tests. Use Testcontainers when you need real DB/network behavior (transactions, constraints, SQL).

---

## 4. Actuator & Observability

Spring Boot 4 ships first-class **Micrometer Tracing + OpenTelemetry** support.

### Endpoint exposure (secure by default)

Expose only what you need. In production, prefer `health` and `info` for public checks; restrict `metrics`, `prometheus`, and `traces` to an internal network or secure endpoint (e.g. via Spring Security).

```yaml
# application.yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,traces   # restrict in prod
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized   # or "never" in prod
  tracing:
    sampling:
      probability: 1.0
  otlp:
    metrics:
      export:
        url: http://otel-collector:4318/v1/metrics
    tracing:
      endpoint: http://otel-collector:4318/v1/traces
```

Protect actuator in Security 7: allow `health`/`info` for load balancers, require authentication for `metrics`/`prometheus`/`traces`. See `references/spring-security-7.md`.

### Dependencies (Micrometer + OTEL)

```kotlin
// build.gradle.kts
implementation("io.micrometer:micrometer-tracing-bridge-otel")
implementation("io.opentelemetry:opentelemetry-exporter-otlp")
```

### Custom span (Tracer)

```java
@Service
public class OrderService {

    private final Tracer tracer;

    @Observed(name = "order.process", contextualName = "Processing order")
    public Order process(OrderRequest request) {
        Span span = tracer.nextSpan().name("validate").start();
        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {
            validate(request);
        } finally {
            span.end();
        }
        return persist(request);
    }
}
```

---

## 5. GraalVM Native Image

```kotlin
// build.gradle.kts
plugins {
    id("org.graalvm.buildtools.native") version "0.10.4"
}

graalvmNative {
    binaries {
        named("main") {
            imageName.set("app")
            buildArgs.add("--enable-preview")
        }
    }
}
```

Build native image:

```bash
./gradlew nativeCompile
./build/native/nativeCompile/app
```

**AOT hints** when reflection is unavoidable:

```java
@RegisterReflectionForBinding(MyDto.class)
@Configuration(proxyBeanMethods = false)
public class NativeHintsConfig {}
```

---

## 6. Virtual Threads (Project Loom)

Enable via single property — no code changes needed for existing Spring MVC apps:

```yaml
# application.yaml
spring:
  threads:
    virtual:
      enabled: true
```

Programmatic usage:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> callExternalService());
}
```

---

## 7. Structured Concurrency (Java 25)

Use `StructuredTaskScope` for fan-out patterns with lifecycle guarantees.

```java
import java.util.concurrent.StructuredTaskScope;

@Service
public class DashboardService {

    public Dashboard loadDashboard(String userId) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

            var orders   = scope.fork(() -> orderService.findByUser(userId));
            var profile  = scope.fork(() -> profileService.find(userId));
            var payments = scope.fork(() -> paymentService.findByUser(userId));

            scope.join().throwIfFailed();

            return new Dashboard(profile.get(), orders.get(), payments.get());
        }
    }
}
```

---

## 8. Scoped Values (Java 25)

`ScopedValue` replaces `ThreadLocal` for context propagation in virtual threads.

```java
public final class RequestContext {
    public static final ScopedValue<String> TENANT_ID = ScopedValue.newInstance();
    public static final ScopedValue<User>   CURRENT_USER = ScopedValue.newInstance();
}

// Set in a filter
ScopedValue.where(RequestContext.TENANT_ID, tenantId)
           .where(RequestContext.CURRENT_USER, user)
           .run(() -> filterChain.doFilter(request, response));

// Read anywhere in the call stack
String tenant = RequestContext.TENANT_ID.get();
```

---

## 9. Docker Compose Support

Spring Boot 4 auto-detects `compose.yaml` and starts services before the application.

```yaml
# compose.yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
  redis:
    image: redis:8
    ports: ["6379:6379"]
```

```yaml
# application.yaml
spring:
  docker:
    compose:
      enabled: true
      lifecycle-management: start-and-stop
```

No manual connection properties needed — Boot auto-configures `DataSource` and `RedisTemplate`.

---

## 10. Spring Security 7 Basics

Spring Security 7 uses **lambda DSL** only for `SecurityFilterChain` and related config. Minimal example:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri("https://auth.example.com/.well-known/jwks.json").build();
    }
}
```

For **OAuth2 Resource Server (JWT)**, **method security (`@PreAuthorize`)**, and **CORS**, load `references/spring-security-7.md`.

---

## 11. Reactive Stack (R2DBC + WebFlux)

Choose the reactive stack when you need non-blocking I/O end-to-end (high concurrency, streaming, or integration with reactive drivers). For typical CRUD APIs with blocking JDBC/JPA, prefer **Spring MVC + virtual threads** (section 6).

### Dependencies

```kotlin
// build.gradle.kts — replace or add to starters
implementation("org.springframework.boot:spring-boot-starter-webflux")
implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
runtimeOnly("org.postgresql:r2dbc-postgresql")
```

### Main application

Use `Netty` as the default server (Boot chooses it when `spring-boot-starter-webflux` is on the classpath and `spring-boot-starter-web` is not).

### R2DBC repositories and WebFlux controllers

Define reactive repositories (`ReactiveCrudRepository`) and inject them into `@RestController` or handler functions. Use `ServerWebExchange`, `Mono`, and `Flux` for reactive types. For **RestClient** in a reactive app, use the reactive variant and streaming; see `references/spring-framework-7.md` (Streaming Support) for alignment with Spring 7 APIs.
