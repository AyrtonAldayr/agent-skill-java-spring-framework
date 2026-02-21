/**
 * Project generator — renders templates and writes files to disk
 */

import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { renderTemplate } from './templates.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../templates');

export async function generateProject(config) {
  const spinner = ora('Generating project…').start();
  const projectDir = resolve(process.cwd(), config.projectName);

  try {
    // Derive additional config values
    const ctx = buildContext(config);

    // Create root project directory
    mkdirSync(projectDir, { recursive: true });

    // Choose template set
    const templateSet = config.buildTool === 'maven' ? 'maven' : 'gradle-kotlin';

    // Generate files
    generateBuildFile(projectDir, templateSet, ctx);
    generateApplicationClass(projectDir, ctx);
    generateApplicationYaml(projectDir, ctx, templateSet);
    generateApplicationTests(projectDir, ctx);

    if (ctx.features.includes('docker-compose')) {
      generateDockerCompose(projectDir, ctx);
    }

    if (ctx.features.includes('modulith')) {
      generateModulithStructure(projectDir, ctx);
    }

    spinner.succeed(chalk.green(`Project created at ${chalk.bold(projectDir)}`));
    printNextSteps(config, projectDir);

  } catch (err) {
    spinner.fail('Generation failed');
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Context builder
// ---------------------------------------------------------------------------

function buildContext(config) {
  const appName = toPascalCase(config.projectName);
  const packagePath = config.packageName.replace(/\./g, '/');
  const features = config.features || [];

  const dbDependency = {
    postgresql: "runtimeOnly(\"org.postgresql:postgresql\")",
    mysql:      "runtimeOnly(\"com.mysql:mysql-connector-j\")",
    mongodb:    "implementation(\"org.springframework.boot:spring-boot-starter-data-mongodb\")",
    h2:         "runtimeOnly(\"com.h2database:h2\")",
    none:       '',
  }[config.database] || '';

  const dbMavenDep = {
    postgresql: '<groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope>',
    mysql:      '<groupId>com.mysql</groupId><artifactId>mysql-connector-j</artifactId><scope>runtime</scope>',
    mongodb:    '<groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-mongodb</artifactId>',
    h2:         '<groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope>',
    none:       '',
  }[config.database] || '';

  return {
    ...config,
    appName,
    packagePath,
    features,
    dbDependency,
    dbMavenDep,
    hasJpa: ['postgresql', 'mysql', 'h2'].includes(config.database),
    hasMongo: config.database === 'mongodb',
    hasActuator: features.includes('actuator'),
    hasSecurity: features.includes('security'),
    hasValidation: features.includes('validation'),
    hasModulith: features.includes('modulith'),
    hasNative: features.includes('native'),
    hasWebFlux: features.includes('webflux'),
    hasDockerCompose: features.includes('docker-compose'),
    enablePreview: config.enablePreview !== false && config.javaVersion === '25',
    year: new Date().getFullYear(),
    modulithDataDep: (() => {
      const f = features;
      const db = config.database;
      if (!f.includes('modulith')) return '';
      if (['postgresql', 'mysql', 'h2'].includes(db)) return 'implementation("org.springframework.modulith:spring-modulith-starter-jpa")';
      if (db === 'mongodb') return 'implementation("org.springframework.modulith:spring-modulith-starter-mongodb")';
      return '';
    })(),
  };
}

// ---------------------------------------------------------------------------
// File generators
// ---------------------------------------------------------------------------

function generateBuildFile(projectDir, templateSet, ctx) {
  const file = templateSet === 'maven' ? 'pom.xml' : 'build.gradle.kts';
  const content = renderTemplate(join(TEMPLATES_DIR, templateSet, `${file}.template`), ctx);
  writeFileSync(join(projectDir, file), content);
}

function generateApplicationClass(projectDir, ctx) {
  const srcDir = join(projectDir, 'src/main/java', ctx.packagePath);
  mkdirSync(srcDir, { recursive: true });
  const content = renderTemplate(
    join(TEMPLATES_DIR, 'gradle-kotlin/src/main/java/com/example/app/Application.java.template'),
    ctx
  );
  writeFileSync(join(srcDir, `${ctx.appName}Application.java`), content);
}

function generateApplicationYaml(projectDir, ctx) {
  const resourcesDir = join(projectDir, 'src/main/resources');
  mkdirSync(resourcesDir, { recursive: true });
  const content = renderTemplate(
    join(TEMPLATES_DIR, 'gradle-kotlin/src/main/resources/application.yaml.template'),
    ctx
  );
  writeFileSync(join(resourcesDir, 'application.yaml'), content);
}

function generateApplicationTests(projectDir, ctx) {
  const testDir = join(projectDir, 'src/test/java', ctx.packagePath);
  mkdirSync(testDir, { recursive: true });
  const content = renderTemplate(
    join(TEMPLATES_DIR, 'gradle-kotlin/src/test/java/com/example/app/ApplicationTests.java.template'),
    ctx
  );
  writeFileSync(join(testDir, `${ctx.appName}ApplicationTests.java`), content);
}

function generateDockerCompose(projectDir, ctx) {
  const content = renderTemplate(
    join(TEMPLATES_DIR, 'gradle-kotlin/compose.yaml.template'),
    ctx
  );
  writeFileSync(join(projectDir, 'compose.yaml'), content);
}

function generateModulithStructure(projectDir, ctx) {
  // Create example module structure
  const modules = ['orders', 'inventory', 'shared'];
  modules.forEach((mod) => {
    mkdirSync(join(projectDir, 'src/main/java', ctx.packagePath, mod, 'internal'), { recursive: true });
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toPascalCase(str) {
  return str.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
}

function printNextSteps(config, projectDir) {
  const cd = `cd ${config.projectName}`;
  const run = config.buildTool === 'maven'
    ? './mvnw spring-boot:run'
    : './gradlew bootRun';

  console.log(`
${chalk.bold('Next steps:')}

  ${chalk.cyan(cd)}
  ${chalk.cyan(run)}

${chalk.bold('Install the AI coding skill (optional):')}

  ${chalk.cyan('npx skills add AyrtonAldayr/agent-skill-java-spring-framework --skill java-spring-framework')}
  ${chalk.dim('or')}
  ${chalk.cyan('claude skills install github:AyrtonAldayr/agent-skill-java-spring-framework')}

${chalk.dim('Docs: https://github.com/AyrtonAldayr/agent-skill-java-spring-framework')}
`);
}
