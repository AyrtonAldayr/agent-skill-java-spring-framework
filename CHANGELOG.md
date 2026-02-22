# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-02-21

### Added

- **Publish:** `.npmignore` for explicit control of published files (no gitignore fallback warning).

[1.6.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.5.0...v1.6.0

## [1.5.0] - 2026-02-21

### Added

- **Skill:** New references `architecture-patterns.md` (hexagonal, Vertical Slice, DDD mapping to Modulith, CQRS) and `microservices-architecture.md` (microservices vs Modulith, service boundaries, inter-service communication, API Gateway, distributed observability).
- **Skill:** spring-modulith.md new section 10 "DDD & Modulith" (aggregate, domain repository, domain vs application events).
- **Skill:** SKILL.md and README: reference table and Quick decision mermaid updated for architecture and microservices.

[1.5.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.4.0...v1.5.0

## [1.4.0] - 2026-02-21

### Added

- **Skill:** New references: `spring-redis.md` (Redis, RedisTemplate, cache backend, session store, pub/sub), `spring-data-mongodb.md` (MongoDB, MongoTemplate, MongoRepository, documents, transactions, indexes), `spring-graphql.md` (Spring for GraphQL, schema, @QueryMapping/@MutationMapping, Records).
- **Skill:** spring-boot-4.md: new section 14 (API documentation — OpenAPI/springdoc) and section 15 (Scheduling — @Scheduled, cron, virtual threads).
- **Skill:** spring-framework-7.md: new section 14 (Bean Validation 3.1 — @Valid, @NotNull, @Size, @Email, Records).
- **Skill:** SKILL.md Reference Files table: Redis, MongoDB, GraphQL rows; extended Load when for spring-boot-4 (OpenAPI/springdoc, scheduling) and spring-framework-7 (Bean Validation, @Valid); Quick decision mermaid nodes for Redis, MongoDB, GraphQL.
- **README:** Skill reference table: spring-redis.md, spring-data-mongodb.md, spring-graphql.md; extended descriptions for spring-boot-4 and spring-framework-7.

[1.4.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.3.0...v1.4.0

## [1.3.0] - 2026-02-21

### Added

- **Skill:** spring-boot-4.md: new section 12 (Rate limiting — Bucket4j, time-window vs @ConcurrencyLimit) and section 13 (Resources & performance — HikariCP/R2DBC pools, Actuator pool metrics, Caffeine cache, performance tuning summary).
- **Skill:** SKILL.md Reference Files "Load when" extended for rate limiting, connection pools, resource metrics, caching, performance tuning; Quick decision mermaid node for "Rate limit / resources / performance?".
- **Skill:** spring-framework-7.md Resilience section: note linking to spring-boot-4.md for time-window rate limiting.
- **README:** Skill reference table: spring-boot-4.md description now includes rate limiting, connection pools, caching, performance.

[1.3.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.2.0...v1.3.0

## [1.2.0] - 2026-02-21

### Added

- **Docs:** CHANGELOG.md (Keep a Changelog); README "What you get" example tree, expanded Contributing, npm version badge.
- **CLI:** Project `description` in wizard and in generated Application.java, build.gradle.kts, pom.xml; friendly error messages (EEXIST, EACCES); "Minimal (API only)" option in wizard.
- **Skill:** New reference `spring-messaging.md` (Kafka, @KafkaListener, producer/consumer); SKILL.md Quick decision node for Messaging/Kafka; Health groups (readiness/liveness) in spring-boot-4.md; BOM sync note in build-templates.md.
- **Quality:** Jest config and unit tests for templates and buildContext; `scripts/smoke-cli.sh` and `npm run smoke`; `buildContext` exported for tests.

### Changed

- **CLI:** Generator context includes `description` default; success message already showed absolute path.

[1.2.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.1.0...v1.2.0

## [1.1.0] - 2026-02-21

### Added

- **Skill:** New reference `spring-security-7.md` — OAuth2 Resource Server, JWT, method security (`@PreAuthorize`), CORS.
- **Skill:** New reference `troubleshooting-migration.md` — common errors (javax/jakarta, RestTemplate, JSpecify, native), Boot 3→4 migration checklist.
- **Skill:** "When NOT to use this skill" section and Quick decision (mermaid) in SKILL.md.
- **Skill:** Spring Boot 4 reference: Testcontainers subsection, secure Actuator exposure, Reactive stack (R2DBC + WebFlux), redirect to spring-security-7.md for OAuth2/JWT.
- **Skill:** Spring Modulith reference: "Common pitfalls" subsection.
- **Skill:** Spring Framework 7: note for reactive apps (WebFlux + R2DBC) with link to spring-boot-4.md.
- **README:** Install options for skill via `npx skills add` and `claude skills install`; skill reference table updated.

### Changed

- **Skill:** Reference table in SKILL.md now includes Spring Security 7 and Troubleshooting & migration; triggers listed in body.

## [1.0.0] - 2026-02-21

### Added

- **CLI:** Interactive wizard for project name, package, build tool (Gradle KTS / Maven), Java version (25/21/17), Spring Boot version, database (PostgreSQL, MySQL, MongoDB, H2, None), features (Actuator, Security, Validation, Modulith, Native, WebFlux, Docker Compose), and Java preview features.
- **CLI:** Non-interactive mode (`--no-interactive`) and Maven option (`--maven`).
- **Templates:** Gradle Kotlin DSL and Maven POM with Spring Boot 4.0.3 BOM; Application.java with JSpecify `@NullMarked`, application.yaml with virtual threads and OTEL, ApplicationTests, optional compose.yaml and Modulith skeleton.
- **Skill:** Core SKILL.md with mandatory workflow (Analyze → Implement → Optimize → Document), Core Principles table, and reference files (spring-framework-7, spring-boot-4, spring-modulith, build-templates).
- **npm:** Package `spring-boot4-skill` publishable with `npx spring-boot4-skill`.

[1.1.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework/releases/tag/v1.0.0
