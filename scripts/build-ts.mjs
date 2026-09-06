#!/usr/bin/env node
import { glob } from 'node:fs/promises';
import { dirname, basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const watch = process.argv.includes('--watch');
const isProd = !watch;

const sharedOptions = {
  bundle: true,
  format: 'esm',
  target: 'es2022',
  platform: 'browser',
  logLevel: 'info',
  ...(isProd
    ? { minify: true, sourcemap: false }
    : { minify: false, sourcemap: 'inline' }),
};

async function findEntries(pattern) {
  const entries = [];
  for await (const file of glob(pattern, { cwd: projectRoot })) {
    entries.push(file);
  }
  return entries.sort();
}

async function buildPageEntries() {
  // Match content/**/script.ts and content/**/script.*.ts (entry points only)
  const entries = await findEntries('content/**/script*.ts');
  if (!entries.length) {
    return [];
  }

  const contexts = [];
  for (const entry of entries) {
    const absEntry = join(projectRoot, entry);
    const outDir = dirname(absEntry);
    const outName = basename(entry, '.ts');
    const outfile = join(outDir, `${outName}.js`);

    const ctx = await esbuild.context({
      ...sharedOptions,
      entryPoints: [absEntry],
      outfile,
    });

    if (watch) {
      await ctx.watch();
      contexts.push(ctx);
    } else {
      await ctx.rebuild();
      await ctx.dispose();
    }
  }
  return contexts;
}

async function buildThemeEntries() {
  // Match themes/black-purple-2025/assets/ts/*.ts at the top level only
  const entries = await findEntries('themes/black-purple-2025/assets/ts/*.ts');
  if (!entries.length) {
    return [];
  }

  const outdir = join(
    projectRoot,
    'themes',
    'black-purple-2025',
    'static',
    'js',
  );
  const absEntries = entries.map((e) => join(projectRoot, e));

  const ctx = await esbuild.context({
    ...sharedOptions,
    entryPoints: absEntries,
    outdir,
  });

  if (watch) {
    await ctx.watch();
    return [ctx];
  }

  await ctx.rebuild();
  await ctx.dispose();
  return [];
}

const contexts = [
  ...(await buildPageEntries()),
  ...(await buildThemeEntries()),
];

if (watch) {
  console.log('esbuild: watching for changes...');
  // Keep process alive
  await new Promise(() => {});
} else {
  console.log('esbuild: build complete');
}
