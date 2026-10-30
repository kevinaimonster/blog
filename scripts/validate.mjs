import { spawnSync } from 'node:child_process';
import { projectRoot } from './content.mjs';

const env = {
  ...process.env,
  SITE_URL: 'https://kevin1988.fun',
  SITE_INDEXABLE: 'true',
  SHOW_DRAFTS: 'false',
};
for (const script of ['check', 'build', 'test']) {
  const result = spawnSync(
    process.execPath,
    [process.env.npm_execpath, 'run', script],
    { cwd: projectRoot, env, stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
