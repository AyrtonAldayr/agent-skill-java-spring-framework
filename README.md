# Spring Boot 4 · Java 25 · Spring Framework 7

> **2026-standard** project scaffolder + Claude Code AI skill for Java / Spring development.
> By [AyrtonAldayr](https://github.com/AyrtonAldayr)

This repository provides two tools in one:

| Tool | What it does |
|---|---|
| **`npx spring-boot4-skill`** | Interactive CLI that generates a production-ready Spring Boot 4 project |
| **Claude Code skill** | AI assistant trained on Spring Boot 4 / Framework 7 / Java 25 standards |

---

## Quick Start — Project Scaffolder

```bash
npx spring-boot4-skill
```

Or providing the project name directly:

```bash
npx spring-boot4-skill my-service
```

Non-interactive (use all defaults):

```bash
npx spring-boot4-skill my-service --no-interactive

# Maven instead of Gradle
npx spring-boot4-skill my-service --maven
```

### What it generates

After answering a few prompts, you get a complete project with:

- **`build.gradle.kts`** (Gradle Kotlin DSL) or **`pom.xml`** (Maven) — with 2026 BOM versions
- **`Application.java`** — `@NullMarked`, `proxyBeanMethods = false`, Jakarta EE 11
- **`application.yaml`** — virtual threads enabled, OTEL endpoints, structured config
- **`ApplicationTests.java`** — Spring Boot test slice, `WebEnvironment.RANDOM_PORT`
- **`compose.yaml`** *(optional)* — Docker Compose for PostgreSQL 17, MongoDB 7, OTEL Collector
- **Spring Modulith module skeleton** *(optional)*

### Wizard options

```
? Project name:           my-service
? Base package:           com.acme
? Build tool:             Gradle Kotlin DSL  ◀ recommended
? Java version:           25
? Spring Boot version:    4.0.3
? Database:               PostgreSQL 17
? Features:
  ◉ Actuator + OTEL Observability
  ◉ Spring Security 7 (OAuth2 Resource Server)
  ◉ Bean Validation 3.1
  ◯ Spring Modulith
  ◯ GraalVM Native Image
  ◯ Spring WebFlux
  ◯ Docker Compose support
? Enable preview features (Structured Concurrency, Scoped Values)?  Yes
```

---

## Claude Code AI Skill

Install the skill to get AI assistance aligned with Spring Boot 4 / Framework 7 standards.

### Install from GitHub

```bash
claude skills install github:AyrtonAldayr/agent-skill-java-spring-framework
```

### What the skill does

Once installed, Claude Code acts as a **Senior Spring Boot 4 architect**:

- Always uses `RestClient`, `JdbcClient`, `HttpServiceProxyFactory` — never `RestTemplate`
- Uses JSpecify `@NonNull` / `@Nullable` instead of JSR-305
- Generates `jakarta.*` namespaces (never `javax.*`)
- Applies Spring Modulith domain-driven patterns
- Uses Structured Concurrency (`StructuredTaskScope`) and Scoped Values on Java 25
- Knows native API versioning (`@RequestMapping(version = "...")`)
- Knows built-in Resilience annotations (`@Retryable`, `@ConcurrencyLimit`)

### Skill reference files

| File | Contents |
|---|---|
| `skills/java-spring-framework/references/spring-framework-7.md` | All Spring 7 APIs with code examples |
| `skills/java-spring-framework/references/spring-boot-4.md` | Boot 4 features: native, virtual threads, Security 7, testing |
| `skills/java-spring-framework/references/spring-modulith.md` | Module structure, events, integration testing |
| `skills/java-spring-framework/references/build-templates.md` | Complete Gradle KTS + Maven POM templates |

---

## Platform Requirements

| Component | Version |
|---|---|
| Java | 25 (recommended) · 21 · 17 (minimum) |
| Spring Boot | 4.0.3 |
| Spring Framework | 7.0.5 |
| Spring Modulith | 2.0.3 |
| Jakarta EE | 11 |
| GraalVM (optional) | 24+ |
| Node.js (CLI only) | ≥ 20 |

---

## Publishing to npm

```bash
npm login
npm publish --access public
```

After publishing, developers can use:

```bash
npx spring-boot4-skill
```

---

## Contributing

PRs welcome. Please keep all generated code aligned with:

- [Spring Boot 4.x docs](https://docs.spring.io/spring-boot/)
- [Spring Framework 7.x docs](https://docs.spring.io/spring-framework/reference/)
- [Spring Modulith docs](https://docs.spring.io/spring-modulith/reference/)
- [JSpecify](https://jspecify.dev/)

---

## License

MIT
