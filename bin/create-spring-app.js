#!/usr/bin/env node
/**
 * spring-boot4-skill — Interactive CLI scaffolder
 * Spring Boot 4.x / Spring Framework 7.x / Java 25 (2026 standards)
 * Author: AyrtonAldayr — https://github.com/AyrtonAldayr/agent-skill-java-spring-framework
 */

import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runWizard } from '../lib/prompts.js';
import { generateProject } from '../lib/generator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

console.log(
  chalk.bold.green('\n  ╔══════════════════════════════════════╗') +
  chalk.bold.green('\n  ║  Spring Boot 4 Project Generator     ║') +
  chalk.bold.green('\n  ║  Java 25 · Spring Framework 7 · 2026 ║') +
  chalk.bold.green('\n  ╚══════════════════════════════════════╝\n')
);

program
  .name('spring-boot4-skill')
  .description('Scaffold a Spring Boot 4.x / Java 25 project with 2026 best practices')
  .version(pkg.version)
  .argument('[project-name]', 'Project name (skips the prompt)')
  .option('--gradle', 'Use Gradle Kotlin DSL (default)')
  .option('--maven', 'Use Maven instead of Gradle')
  .option('--no-interactive', 'Use defaults without prompts')
  .action(async (projectName, options) => {
    try {
      const answers = await runWizard(projectName, options);
      await generateProject(answers);
    } catch (err) {
      if (err.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n  Cancelled.'));
        process.exit(0);
      }
      console.error(chalk.red('\n  Error: ') + err.message);
      process.exit(1);
    }
  });

program.parse();
