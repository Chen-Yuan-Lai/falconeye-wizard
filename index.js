#!/usr/bin/env node
import wizard from './wizard.js';
import buildMap from './buildMap.js';
import showTitle from './title.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('falconeye-wizrad')
  .description('CLI to to configure your project to upload map file')
  .version('1.1.0');

program
  .command('wizard')
  .description('a wizard to help to configure all things step by step')
  .action(async () => {
    showTitle('FalconEye');
    await wizard();
  });

program
  .command('build')
  .description('Build bundle source map files for the js file')
  .argument('<string>', 'file path you want to build')
  .option('-o, --outpath <string>', 'output file path', './bundle.js')
  .action(async (file, option) => {
    await buildMap(file, option.outpath);
  });

// ascii art

program.parse();
