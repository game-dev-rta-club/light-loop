import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the distributable is one self-contained, portable skill', async () => {
  assert.deepEqual(await readdir(resolve(root, 'skills')), ['light-loop']);
  const directory = resolve(root, 'skills/light-loop');
  assert.deepEqual(await readdir(directory), ['SKILL.md']);
  const text = await readFile(resolve(directory, 'SKILL.md'), 'utf8');
  const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(header, 'skill needs YAML frontmatter');
  assert.match(header[1], /^name: light-loop$/m);
  assert.match(header[1], /^description: .+$/m);
  assert.match(header[1], /^license: MIT$/m);
  assert.doesNotMatch(text, /\/Users\/|current-project-knowledge|SuperHookGirl/);
});

test('release metadata is consistent and no runtime is bundled', async () => {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.private, true);
  assert.equal(manifest.bin, undefined);
  assert.equal(manifest.dependencies, undefined);
  const changelog = await readFile(resolve(root, 'CHANGELOG.md'), 'utf8');
  assert.ok(changelog.includes(`## ${manifest.version} —`));
});

test('all relative Markdown links resolve within the repository', async () => {
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const file = resolve(directory, entry.name);
      if (entry.isDirectory()) { await visit(file); continue; }
      if (!entry.name.endsWith('.md')) continue;
      const text = await readFile(file, 'utf8');
      for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
        const target = match[1];
        if (/^[a-z][a-z\d+.-]*:|^#/i.test(target)) continue;
        const linkedFile = resolve(dirname(file), decodeURIComponent(target.split('#')[0]));
        const inside = relative(root, linkedFile);
        assert.ok(!inside.startsWith('..') && !isAbsolute(inside), `link escapes repository: ${target}`);
        assert.ok((await stat(linkedFile)).isFile(), `missing linked file: ${target}`);
      }
    }
  }
  await visit(root);
});
