#!/usr/bin/env node
require('dotenv').config();
const { program } = require('commander');
const init = require('../commands/init');
const clone = require('../commands/clone');
const commit = require('../commands/commit');
const push = require('../commands/push');
const status = require('../commands/status');

program
  .version('1.0.0')
  .description('dGit-ICP CLI for decentralized Git on Internet Computer');

program
  .command('init')
  .description('Initialize a new dGit repository')
  .action(init);

program
  .command('clone')
  .description('Clone a repository')
  .argument('<repoId>', 'Repository ID')
  .action(clone);

program
  .command('commit')
  .description('Commit changes to the repository')
  .option('-m, --message <message>', 'Commit message', 'Update')
  .action(commit);

program
  .command('push')
  .description('Push committed changes to the on-chain repository')
  .action(push);

program
  .command('status')
  .description('Show the status of the repository')
  .action(status);

program.parse(process.argv);