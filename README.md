# Spring Boot 4 · Java 25 · Spring Framework 7

[![npm version](https://img.shields.io/npm/v/spring-boot4-skill.svg)](https://www.npmjs.com/package/spring-boot4-skill)

> **2026-standard** project scaffolder + Claude Code AI skill for Java / Spring development.
> By [AyrtonAldayr](https://github.com/AyrtonAldayr) · **v1.4.0**

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

**Example output** (Gradle, default options):

```
my-service/
├── build.gradle.kts
├── settings.gradle.kts
├── src/
│   ├── main/
│   │   ├── java/<package-path>/
│   │   │   └── Application.java
│   │   └── resources/
│   │       └── application.yaml
│   └── test/
│       └── java/<package-path>/
│           └── ApplicationTests.java
└── compose.yaml          # if Docker Compose was selected
```

The generator prints the full path of the created project (e.g. `Project created at /path/to/my-service`).

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

There are **two common ways** to install it, depending on which tool you use:

### Option 1 — npx (Skills CLI, multi-agent)

Uses the open [Skills CLI](https://github.com/vercel-labs/skills) (`npx skills`). Works with Claude Code, Cursor, Codex, and other agents that follow the same skill layout.

```bash
# Install the skill (prompts for which agent(s) to install to)
npx skills add AyrtonAldayr/agent-skill-java-spring-framework --skill java-spring-framework

# Install only for Claude Code
npx skills add AyrtonAldayr/agent-skill-java-spring-framework --skill java-spring-framework -a claude-code

# Install for Cursor
npx skills add AyrtonAldayr/agent-skill-java-spring-framework --skill java-spring-framework -a cursor
```

### Option 2 — Claude Code official CLI

If you use the `claude` CLI (Anthropic’s Claude Code), you can install directly from GitHub:

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
| `skills/java-spring-framework/references/spring-framework-7.md` | All Spring 7 APIs, Bean Validation, @Valid |
| `skills/java-spring-framework/references/spring-boot-4.md` | Boot 4: native, virtual threads, testing, reactive stack, rate limiting, connection pools, caching, performance, OpenAPI, scheduling |
| `skills/java-spring-framework/references/spring-security-7.md` | OAuth2 Resource Server, JWT, method security, CORS |
| `skills/java-spring-framework/references/spring-redis.md` | Redis, cache distribuido, session store |
| `skills/java-spring-framework/references/spring-data-mongodb.md` | MongoDB, document DB, Spring Data MongoDB |
| `skills/java-spring-framework/references/spring-messaging.md` | Kafka, event-driven, @KafkaListener, producer/consumer |
| `skills/java-spring-framework/references/spring-graphql.md` | GraphQL API, Spring for GraphQL |
| `skills/java-spring-framework/references/spring-modulith.md` | Module structure, events, integration testing, common pitfalls, DDD & Modulith |
| `skills/java-spring-framework/references/architecture-patterns.md` | DDD, hexagonal, Vertical Slice, CQRS, ports & adapters |
| `skills/java-spring-framework/references/microservices-architecture.md` | Microservices: boundaries, communication, API Gateway, distributed observability |
| `skills/java-spring-framework/references/build-templates.md` | Complete Gradle KTS + Maven POM templates |
| `skills/java-spring-framework/references/troubleshooting-migration.md` | Common errors (javax/jakarta, RestTemplate), Boot 3→4 checklist |

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

We use [Semantic Versioning](https://semver.org/): **MAJOR.MINOR.PATCH**. Small changes (docs, config, bugfixes) = **patch** (e.g. `1.6.0` → `1.6.1`). New features = **minor** (`1.6.0` → `1.7.0`). Breaking changes = **major** (`1.6.0` → `2.0.0`).

When releasing a new version:

1. **Bump version** in `package.json` (e.g. `1.6.0` → `1.6.1` for patch, or `1.7.0` for minor).
2. **Update CHANGELOG.md** — add an entry under the new version (Added / Changed / Fixed).
3. **Commit, tag and push:**
   ```bash
   git add .
   git commit -m "chore: release v1.x.0"
   git tag v1.x.0
   git push origin main
   git push origin v1.x.0
   ```
   (Or push all tags at once: `git push origin main && git push --tags`.)
4. **Publish to npm** (requires npm login and 2FA if enabled):
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

PRs welcome.

1. **Clone and install:** `git clone <repo> && cd agent-skill-java-spring-framework && npm install`
2. **Run CLI locally:** `node bin/create-spring-app.js [project-name]` or `node bin/create-spring-app.js my-test --no-interactive`
3. **Tests:** `npm test` (unit tests); `npm run smoke` (CLI smoke test).
4. **Skill changes:** Keep the structure under `skills/java-spring-framework/` (SKILL.md plus `references/*.md`). Load criteria in the Reference Files table should stay accurate.
5. **Generated code** must align with:
   - [Spring Boot 4.x docs](https://docs.spring.io/spring-boot/)
   - [Spring Framework 7.x docs](https://docs.spring.io/spring-framework/reference/)
   - [Spring Modulith docs](https://docs.spring.io/spring-modulith/reference/)
   - [JSpecify](https://jspecify.dev/)

---

## License

MIT
