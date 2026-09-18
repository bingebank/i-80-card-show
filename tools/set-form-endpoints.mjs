#!/usr/bin/env node
/**
 * Wires the Formspree endpoints into the site's two forms.
 *
 *   node tools/set-form-endpoints.mjs --vendor xdkolqwz --notify mzzvopqr
 *
 * Accepts either the bare form ID that Formspree shows you, or the whole
 * https://formspree.io/f/... URL. Run it again any time to change them, or
 * pass "none" to clear one back to the email-us fallback.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = {
  vendor: { file: 'vendors.html', formId: 'vendor-form', label: 'vendor sign-up' },
  notify: { file: 'index.html', formId: 'notify-form', label: 'date announcement' },
};

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--vendor' || arg === '--notify') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${arg} needs a value (a Formspree form ID, a full URL, or "none")`);
      }
      out[arg.slice(2)] = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return out;
}

function toEndpoint(value) {
  if (value.toLowerCase() === 'none') return '';
  const trimmed = value.trim().replace(/\/+$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    if (!/formspree\.io\/f\/[A-Za-z0-9_-]+$/i.test(trimmed)) {
      throw new Error(`That doesn't look like a Formspree endpoint: ${value}`);
    }
    return trimmed;
  }
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    throw new Error(`That doesn't look like a Formspree form ID: ${value}`);
  }
  return `https://formspree.io/f/${trimmed}`;
}

function setAction(html, formId, endpoint) {
  // Match the opening tag of the form carrying this id, however its
  // attributes are wrapped across lines.
  const tag = new RegExp(`<form\\b[^>]*\\bid="${formId}"[^>]*>`, 'i');
  const match = html.match(tag);
  if (!match) throw new Error(`Couldn't find a <form id="${formId}"> tag`);

  const original = match[0];
  if (!/\baction="[^"]*"/i.test(original)) {
    throw new Error(`<form id="${formId}"> has no action attribute to set`);
  }
  const updated = original.replace(/\baction="[^"]*"/i, `action="${endpoint}"`);
  return { html: html.replace(original, updated), changed: original !== updated };
}

let args;
try {
  args = parseArgs(process.argv.slice(2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

if (!args.vendor && !args.notify) {
  console.error('Usage: node tools/set-form-endpoints.mjs --vendor <id|url|none> --notify <id|url|none>');
  process.exit(1);
}

let failed = false;
for (const [key, value] of Object.entries(args)) {
  const { file, formId, label } = TARGETS[key];
  const path = join(ROOT, file);
  try {
    const endpoint = toEndpoint(value);
    const { html, changed } = setAction(readFileSync(path, 'utf8'), formId, endpoint);
    writeFileSync(path, html);
    const where = endpoint || '(cleared — falls back to "email us instead")';
    console.log(`${changed ? 'updated' : 'unchanged'}  ${file}  ${label}  ->  ${where}`);
  } catch (err) {
    console.error(`failed   ${file}  ${label}: ${err.message}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
