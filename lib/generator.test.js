/**
 * Unit tests for the generator context builder (buildContext).
 */

import { buildContext } from './generator.js';

describe('buildContext', () => {
  it('includes projectName, packageName, appName, packagePath', () => {
    const ctx = buildContext({
      projectName: 'my-service',
      packageName: 'com.acme',
      database: 'none',
      features: [],
    });
    expect(ctx.projectName).toBe('my-service');
    expect(ctx.packageName).toBe('com.acme');
    expect(ctx.appName).toBe('MyService');
    expect(ctx.packagePath).toBe('com/acme');
  });

  it('sets hasJpa true for postgresql, mysql, h2', () => {
    expect(buildContext({ projectName: 'x', packageName: 'c', database: 'postgresql', features: [] }).hasJpa).toBe(true);
    expect(buildContext({ projectName: 'x', packageName: 'c', database: 'mysql', features: [] }).hasJpa).toBe(true);
    expect(buildContext({ projectName: 'x', packageName: 'c', database: 'h2', features: [] }).hasJpa).toBe(true);
    expect(buildContext({ projectName: 'x', packageName: 'c', database: 'none', features: [] }).hasJpa).toBe(false);
  });

  it('sets hasActuator, hasSecurity, hasValidation from features', () => {
    const ctx = buildContext({
      projectName: 'x',
      packageName: 'c',
      database: 'none',
      features: ['actuator', 'validation'],
    });
    expect(ctx.hasActuator).toBe(true);
    expect(ctx.hasSecurity).toBe(false);
    expect(ctx.hasValidation).toBe(true);
  });

  it('sets hasModulith, hasNative, hasDockerCompose from features', () => {
    const ctx = buildContext({
      projectName: 'x',
      packageName: 'c',
      database: 'postgresql',
      features: ['modulith', 'docker-compose'],
    });
    expect(ctx.hasModulith).toBe(true);
    expect(ctx.hasNative).toBe(false);
    expect(ctx.hasDockerCompose).toBe(true);
  });

  it('provides description default when missing', () => {
    const ctx = buildContext({
      projectName: 'x',
      packageName: 'c',
      database: 'none',
      features: [],
    });
    expect(ctx.description).toBe('Spring Boot 4 microservice');
  });

  it('uses provided description when set', () => {
    const ctx = buildContext({
      projectName: 'x',
      packageName: 'c',
      description: 'My API',
      database: 'none',
      features: [],
    });
    expect(ctx.description).toBe('My API');
  });

  it('sets modulithDataDep for JPA when modulith and postgresql', () => {
    const ctx = buildContext({
      projectName: 'x',
      packageName: 'c',
      database: 'postgresql',
      features: ['modulith'],
    });
    expect(ctx.modulithDataDep).toContain('modulith-starter-jpa');
  });
});
