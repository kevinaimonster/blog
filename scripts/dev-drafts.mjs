import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { projectRoot } from './content.mjs';

const child = spawn(
  process.execPath,
  [
    resolve(projectRoot, 'node_modules/astro/bin/astro.mjs'),
    'dev',
    '--root',
    'site',
    '--host',
    '127.0.0.1',
    '--ignore-lock',
    ...process.argv.slice(2),
  ],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env, SHOW_DRAFTS: 'true', SITE_INDEXABLE: 'false' },
  },
);
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => process.exit(code ?? 1));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => child.kill(signal));
