/**
 * Interactive wizard — collects project configuration
 */

import inquirer from 'inquirer';

const DEFAULTS = {
  projectName: 'my-service',
  packageName: 'com.example',
  description: 'Spring Boot 4 microservice',
  buildTool: 'gradle',
  javaVersion: '25',
  bootVersion: '4.0.3',
  database: 'postgresql',
  features: ['actuator', 'security', 'validation'],
};

export async function runWizard(projectNameArg, options = {}) {
  if (options.interactive === false) {
    return {
      ...DEFAULTS,
      projectName: projectNameArg || DEFAULTS.projectName,
      buildTool: options.maven ? 'maven' : 'gradle',
    };
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectNameArg || DEFAULTS.projectName,
      validate: (v) => /^[a-z][a-z0-9-]*$/.test(v) || 'Use lowercase letters, numbers, and hyphens',
    },
    {
      type: 'input',
      name: 'packageName',
      message: 'Base package (e.g. com.acme):',
      default: DEFAULTS.packageName,
      validate: (v) => /^[a-z][a-z0-9.]*$/.test(v) || 'Use lowercase letters, numbers, and dots',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'Spring Boot 4 microservice',
    },
    {
      type: 'list',
      name: 'buildTool',
      message: 'Build tool:',
      choices: [
        { name: 'Gradle Kotlin DSL  (recommended for 2026)', value: 'gradle' },
        { name: 'Maven POM', value: 'maven' },
      ],
      default: options.maven ? 'maven' : 'gradle',
    },
    {
      type: 'list',
      name: 'javaVersion',
      message: 'Java version:',
      choices: [
        { name: 'Java 25 LTS  (recommended)', value: '25' },
        { name: 'Java 21 LTS', value: '21' },
        { name: 'Java 17 LTS  (minimum)', value: '17' },
      ],
      default: '25',
    },
    {
      type: 'list',
      name: 'bootVersion',
      message: 'Spring Boot version:',
      choices: [
        { name: '4.0.3  (stable)', value: '4.0.3' },
        { name: '4.1.0-M1  (milestone)', value: '4.1.0-M1' },
      ],
      default: '4.0.3',
    },
    {
      type: 'list',
      name: 'database',
      message: 'Database:',
      choices: [
        { name: 'PostgreSQL 17', value: 'postgresql' },
        { name: 'MySQL 9', value: 'mysql' },
        { name: 'MongoDB 7.0', value: 'mongodb' },
        { name: 'H2  (in-memory / dev only)', value: 'h2' },
        { name: 'None', value: 'none' },
      ],
      default: 'postgresql',
    },
    {
      type: 'confirm',
      name: 'minimal',
      message: 'Minimal project (API only — no Actuator, Security, Validation)?',
      default: false,
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Features  (space to toggle, enter to confirm):',
      choices: [
        { name: 'Spring Actuator + OTEL Observability', value: 'actuator', checked: true },
        { name: 'Spring Security 7 (OAuth2 Resource Server)', value: 'security', checked: true },
        { name: 'Bean Validation 3.1', value: 'validation', checked: true },
        { name: 'Spring Modulith (domain-driven modules)', value: 'modulith', checked: false },
        { name: 'GraalVM Native Image', value: 'native', checked: false },
        { name: 'Spring WebFlux (Reactive)', value: 'webflux', checked: false },
        { name: 'Docker Compose support', value: 'docker-compose', checked: false },
      ],
      when: (ans) => !ans.minimal,
    },
    {
      type: 'confirm',
      name: 'enablePreview',
      message: 'Enable Java preview features? (Structured Concurrency, Scoped Values)',
      default: true,
      when: (ans) => ans.javaVersion === '25',
    },
  ]);

  if (answers.minimal) {
    answers.features = [];
  }
  return answers;
}
