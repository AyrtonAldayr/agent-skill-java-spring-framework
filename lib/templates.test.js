/**
 * Unit tests for the template engine (renderTemplate, interpolate, #if, #each).
 * Uses in-memory template strings; does not read from disk.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { renderTemplate } from './templates.js';

describe('templates', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'skill-tpl-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true });
  });

  function createTemplate(content) {
    const path = join(tempDir, 'tpl.txt');
    writeFileSync(path, content);
    return path;
  }

  describe('interpolate', () => {
    it('replaces {{key}} with context value', () => {
      const path = createTemplate('Hello {{name}}');
      expect(renderTemplate(path, { name: 'World' })).toBe('Hello World');
    });

    it('replaces multiple placeholders', () => {
      const path = createTemplate('{{a}} and {{b}}');
      expect(renderTemplate(path, { a: 'A', b: 'B' })).toBe('A and B');
    });

    it('replaces undefined/null with empty string', () => {
      const path = createTemplate('x{{missing}}y');
      expect(renderTemplate(path, {})).toBe('xy');
    });
  });

  describe('{{#if}}', () => {
    it('includes block when value is truthy', () => {
      const path = createTemplate('{{#if ok}}yes{{/if}}');
      expect(renderTemplate(path, { ok: true })).toBe('yes');
    });

    it('omits block when value is falsy', () => {
      const path = createTemplate('{{#if ok}}yes{{/if}}');
      expect(renderTemplate(path, { ok: false })).toBe('');
    });

    it('supports negation {{#if !key}}', () => {
      const path = createTemplate('{{#if !hide}}show{{/if}}');
      expect(renderTemplate(path, { hide: true })).toBe('');
      expect(renderTemplate(path, { hide: false })).toBe('show');
    });
  });

  describe('{{#each}}', () => {
    it('iterates array and exposes {{item}}', () => {
      const path = createTemplate('{{#each items}}({{item}}){{/each}}');
      expect(renderTemplate(path, { items: ['a', 'b'] })).toBe('(a)(b)');
    });

    it('returns empty string when key is not an array', () => {
      const path = createTemplate('{{#each items}}x{{/each}}');
      expect(renderTemplate(path, { items: null })).toBe('');
    });
  });

  it('combines if and interpolate', () => {
    const path = createTemplate('{{name}}{{#if active}} (active){{/if}}');
    expect(renderTemplate(path, { name: 'Foo', active: true })).toBe('Foo (active)');
    expect(renderTemplate(path, { name: 'Bar', active: false })).toBe('Bar');
  });
});
