import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve('.');
const archive = path.join(root, 'site/public/downloads/magpie-bridge.zip');
const source = path.join(root, 'docs/skills/magpie-bridge');
const entries = ['SKILL.md', 'agents/openai.yaml', 'assets/gpt-claude'];

test('the published skill download and checksum match the reviewed source', async () => {
  execFileSync('python3', ['scripts/package-magpie-skill.py', '--check'], {
    cwd: root,
  });
  const bytes = await readFile(archive);
  assert.deepEqual(await readFile('dist/downloads/magpie-bridge.zip'), bytes);
  const checksum = `${createHash('sha256').update(bytes).digest('hex')}  magpie-bridge.zip\n`;
  assert.equal(
    await readFile('dist/downloads/magpie-bridge.zip.sha256', 'utf8'),
    checksum,
  );
  const names = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' })
    .trim()
    .split('\n');
  assert.deepEqual(
    names.sort(),
    entries.map((name) => `magpie-bridge/${name}`).sort(),
  );
});

test('the ZIP installs a complete skill in either client directory without overwriting an existing skill', async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'magpie-skill-install-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const client of ['.agents', '.claude']) {
    const target = path.join(directory, client, 'skills');
    await mkdir(target, { recursive: true });
    execFileSync('unzip', ['-n', archive, '-d', target]);
    const skill = path.join(target, 'magpie-bridge');
    for (const entry of entries) {
      assert.deepEqual(
        await readFile(path.join(skill, entry)),
        await readFile(path.join(source, entry)),
      );
    }
    const launcher = path.join(skill, 'assets/gpt-claude');
    assert.ok(
      (await stat(launcher)).mode & 0o111,
      'Launcher remains executable',
    );
    execFileSync('sh', ['-n', launcher]);
    const ownSkill = path.join(skill, 'SKILL.md');
    await writeFile(ownSkill, 'Existing personal customization\n');
    execFileSync('unzip', ['-n', archive, '-d', target]);
    assert.equal(
      await readFile(ownSkill, 'utf8'),
      'Existing personal customization\n',
    );
  }
});
