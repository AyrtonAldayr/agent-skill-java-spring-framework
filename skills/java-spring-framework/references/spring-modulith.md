# Spring Modulith 2.0.x — Reference

**Version**: 2.0.3 | **Spring Boot**: 4.0.x | **Purpose**: Domain-driven modular monolith

---

## Table of Contents
1. [Module Package Structure](#1-module-package-structure)
2. [Gradle Dependency](#2-gradle-dependency)
3. [Module Verification Test](#3-module-verification-test)
4. [@ApplicationModule Annotation](#4-applicationmodule-annotation)
5. [Event-Driven Inter-Module Communication](#5-event-driven-inter-module-communication)
6. [Transactional Event Listeners](#6-transactional-event-listeners)
7. [Module Integration Testing](#7-module-integration-testing)
8. [Generating Documentation](#8-generating-documentation)

---

## 1. Module Package Structure

Each direct sub-package of the application's root package is a **module**.
Internal types live in sub-packages; only the top-level package is public API.

```
com.example.shop/
├── ShopApplication.java          ← root
├── orders/                       ← "orders" module
│   ├── OrderService.java         ← public API
│   ├── OrderController.java      ← public API
│   └── internal/
│       ├── OrderRepository.java  ← internal
│       └── OrderMapper.java      ← internal
├── inventory/                    ← "inventory" module
│   ├── InventoryService.java     ← public API
│   └── internal/
│       └── StockRepository.java  ← internal
└── shared/                       ← shared utilities (no module boundary)
    └── Money.java
```

Modules **cannot** directly import each other's `internal` sub-packages.
Cross-module communication happens through **events** or **public service interfaces**.

---

## 2. Gradle Dependency

```kotlin
// build.gradle.kts
dependencyManagement {
    imports {
        mavenBom("org.springframework.modulith:spring-modulith-bom:2.0.3")
    }
}

dependencies {
    implementation("org.springframework.modulith:spring-modulith-starter-core")
    implementation("org.springframework.modulith:spring-modulith-starter-jpa")      // if using JPA
    testImplementation("org.springframework.modulith:spring-modulith-starter-test")
}
```

---

## 3. Module Verification Test

Run once per CI pipeline — validates that no module violates boundaries.

```java
@Test
void applicationModulesShouldBeCompliant() {
    ApplicationModules.of(ShopApplication.class).verify();
}
```

`verify()` throws if:
- A module imports another module's `internal` package.
- Circular module dependencies exist.

---

## 4. @ApplicationModule Annotation

Fine-tune module visibility and allowed dependencies:

```java
// orders/package-info.java
@ApplicationModule(
    displayName = "Orders",
    allowedDependencies = {"inventory", "shared"}   // only these modules may be imported
)
package com.example.shop.orders;

import org.springframework.modulith.ApplicationModule;
```

Named interfaces (explicit public API within a module):

```java
@NamedInterface("api")
package com.example.shop.orders.api;
```

---

## 5. Event-Driven Inter-Module Communication

Modules communicate via Spring's `ApplicationEventPublisher`. No direct service calls between modules.

**Publisher** (orders module):

```java
record OrderPlacedEvent(Long orderId, String productSku, int quantity) {}

@Service
public class OrderService {

    private final ApplicationEventPublisher events;
    private final JdbcClient jdbc;

    public Order placeOrder(OrderRequest req) {
        Order order = persistOrder(req);
        events.publishEvent(new OrderPlacedEvent(order.id(), req.sku(), req.quantity()));
        return order;
    }
}
```

**Listener** (inventory module):

```java
@Service
public class InventoryService {

    @ApplicationModuleListener   // replaces @EventListener for cross-module events
    public void on(OrderPlacedEvent event) {
        reserveStock(event.productSku(), event.quantity());
    }
}
```

`@ApplicationModuleListener` is async and transactional by default in Modulith.

---

## 6. Transactional Event Listeners

For guaranteed "at-least-once" delivery with persistent event logs:

```kotlin
// build.gradle.kts
implementation("org.springframework.modulith:spring-modulith-events-api")
implementation("org.springframework.modulith:spring-modulith-events-jpa")  // or jdbc, mongodb
```

```java
@Service
public class OrderService {

    @Transactional
    public Order placeOrder(OrderRequest req) {
        Order order = persistOrder(req);
        // Event is stored in the event publication log within the same transaction.
        // Published to listeners after commit — even survives a crash.
        events.publishEvent(new OrderPlacedEvent(order.id(), req.sku(), req.quantity()));
        return order;
    }
}
```

Incomplete publications are retried automatically on next application start.

---

## 7. Module Integration Testing

Test a single module in isolation with only its direct dependencies.

```java
@ApplicationModuleTest          // boots only the "orders" module + stubs
class OrderServiceTest {

    @Autowired OrderService orderService;
    @MockitoBean InventoryService inventoryService;  // stub cross-module dependency

    @Test
    void shouldPlaceOrderAndPublishEvent() {
        var result = orderService.placeOrder(new OrderRequest("SKU-001", 2));
        assertThat(result.id()).isNotNull();
    }
}
```

Bootstrap modes:
- `STANDALONE` — only the annotated module (default)
- `DIRECT_DEPENDENCIES` — module + direct dependencies
- `ALL_DEPENDENCIES` — full transitive graph

```java
@ApplicationModuleTest(mode = BootstrapMode.DIRECT_DEPENDENCIES)
class OrderServiceTest { ... }
```

---

## 8. Generating Documentation

Produces AsciiDoc / PlantUML diagrams of module dependencies:

```java
@Test
void generateModuleDocumentation() throws Exception {
    var modules = ApplicationModules.of(ShopApplication.class);
    new Documenter(modules)
        .writeDocumentation()
        .writeIndividualModulesAsPlantUml();
}
```

Output lands in `target/spring-modulith-docs/` (Maven) or `build/spring-modulith-docs/` (Gradle).
