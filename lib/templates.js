/**
 * Minimal template engine — replaces {{key}} placeholders using a context object.
 * Supports {{#if key}}...{{/if}} blocks and {{#each array}}...{{/each}}.
 */

import { readFileSync } from 'fs';

export function renderTemplate(templatePath, ctx) {
  let source = readFileSync(templatePath, 'utf8');
  source = processIf(source, ctx);
  source = processEach(source, ctx);
  source = interpolate(source, ctx);
  return source;
}

/** Replace {{key}} with ctx[key] */
function interpolate(src, ctx) {
  return src.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = ctx[key];
    return val !== undefined && val !== null ? String(val) : '';
  });
}

/** Process {{#if key}}...{{/if}} — supports negation {{#if !key}} */
function processIf(src, ctx) {
  return src.replace(
    /\{\{#if (!?)(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, negate, key, body) => {
      const val = Boolean(ctx[key]);
      return (negate ? !val : val) ? body : '';
    }
  );
}

/** Process {{#each arrayKey}}...{{/each}} — exposes item as {{item}} */
function processEach(src, ctx) {
  return src.replace(
    /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, key, body) => {
      const arr = ctx[key];
      if (!Array.isArray(arr)) return '';
      return arr.map((item) => body.replace(/\{\{item\}\}/g, String(item))).join('');
    }
  );
}
