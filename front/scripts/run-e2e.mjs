import { spawn } from 'node:child_process';

const currentMajor = Number.parseInt(process.versions.node.split('.')[0], 10);
if (currentMajor !== 22) {
  console.warn(`Warning: this project declares Node 22.x in package.json, but you are using Node ${process.version}. Cypress may fail or behave inconsistently.`);
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['cypress', 'run'];
const environment = { ...process.env };
delete environment.ELECTRON_RUN_AS_NODE;
delete environment.ELECTRON_NO_ATTACH_CONSOLE;

const child = spawn(command, args, {
  env: environment,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('error', (error) => {
  console.error(`Unable to start Cypress: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
