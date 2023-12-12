import { readdir } from 'fs/promises';
import { resolve, sep } from 'path';
import esbuild from 'esbuild';

const listNodeModules = async (dir = 'node_modules') => {
  let results = [];

  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      const res = resolve(dir, file.name);
      results.push(res.split(sep).slice(-2).join('/'));
      results = results.concat(await listNodeModules(res));
    }
  }
  return results;
};

const shouldMarkAsExternal = packageName => {
  const externalKeywords = ['@aws-sdk', '@mapbox'];
  return externalKeywords.some(keyword => packageName.includes(keyword));
  // return packageName.includes('aws');
};

const buildMap = async (path, output) => {
  try {
    const allDependencies = await listNodeModules();
    const externalDependencies = allDependencies.filter(shouldMarkAsExternal);
    await esbuild.build({
      entryPoints: [path],
      bundle: true,
      sourcemap: true,
      format: 'esm',
      platform: 'node',
      external: externalDependencies,
      loader: { '.html': 'text' },
      outfile: output,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default buildMap;
