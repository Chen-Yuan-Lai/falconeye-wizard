import fs from 'fs/promises';
import ora from 'ora';
import chalk from 'chalk';
import esbuild from 'esbuild';
import sendSourceMap from './sendSourceMap.js';
import writeYamlFile from './createGitHubAction.js';
import validate from './validate.js';
import buildMap from './buildMap.js';

const nextLine = async num => {
  for (let i = 0; i < num; i++) {
    console.log(chalk.bold('|'));
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

const runTasks = async answers => {
  const spinner = ora('Processing...');
  try {
    const { path, userKey, clientToken, noGit, hasGit } = answers;
    console.log(path, userKey, clientToken, noGit, hasGit);
    console.log(
      chalk.bold(`
  ==================================
  ||                              ||
  ||  Let's start configuration~  ||
  ||                              ||
  ==================================
  `)
    );

    console.log(`✨ ${chalk.bold('1) Validating user key & client token')}`);
    spinner.start();

    await new Promise(resolve => setTimeout(resolve, 500));
    const validateRes = await validate(userKey, clientToken);

    if (validateRes.status && validateRes.status === 'fail') {
      spinner.fail(chalk.red('Operation failed.'));
      throw new Error('something wrong in validation');
    }

    spinner.succeed(chalk.green('Operation successful.'));
    await nextLine(3);

    console.log(`✨ ${chalk.bold('2) Building source map')}`);
    spinner.start();
    await buildMap(path, './bundle.js');

    spinner.succeed(chalk.green('Operation successful.'));
    await nextLine(3);

    console.log(`✨ ${chalk.bold('3) Uploading source map')}`);
    spinner.start();

    const map = await fs.readFile('./bundle.js.map', 'utf8');
    const sendMapRes = await sendSourceMap(map, userKey, clientToken);

    if (sendMapRes.status && sendMapRes.status === 'fail') {
      spinner.fail(chalk.red('Operation failed.'));
      throw new Error('something wrong in validation');
    }

    spinner.succeed(chalk.green(`Operation successful---${sendMapRes.message}`));
    await nextLine(3);

    if (!noGit && hasGit) {
      console.log(`✨ ${chalk.bold('4) build auto uploading workflow')}`);
      spinner.start();

      await writeYamlFile(path);
      spinner.succeed(chalk.green('Operation successful.'));
    }
    await nextLine(3);
    console.log(`✨ ${chalk.bold('5) Deleting unnecessary files')}`);

    spinner.start();
    await fs.unlink('./bundle.js');
    await fs.unlink('./bundle.js.map');
    spinner.succeed(chalk.green('Operation successful.'));

    await nextLine(3);
    console.log(chalk.bold('configuration completed! Bye~ 👋👋👋'));
  } catch (err) {
    spinner.fail(chalk.red('Operation failed.'));
    console.log(err);
    throw err;
  }
};

export default runTasks;
