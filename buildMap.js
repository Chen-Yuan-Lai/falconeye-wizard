import fs from 'fs/promises';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url';

const getDependencies = async () => {
  const projectPackage = await fs.readFile('./package.json', 'utf8');
  const packageJson = JSON.parse(projectPackage);

  return Object.keys(packageJson.dependencies);
};

const shouldMarkAsExternal = async packageName => {
  return packageName.includes('aws');
};

const buildMap = async (path, output) => {
  try {
    const allDependencies = getDependencies();
    const externalDependencies = allDependencies.filter(shouldMarkAsExternal);

    await esbuild.build({
      entryPoints: [path],
      bundle: true,
      sourcemap: true,
      format: 'esm',
      platform: 'node',
      external: externalDependencies,
      outfile: output,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default buildMap;
