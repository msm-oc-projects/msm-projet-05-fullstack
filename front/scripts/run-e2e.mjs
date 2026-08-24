import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'cypress.cmd' : 'cypress';
const environment = { ...process.env };
delete environment.ELECTRON_RUN_AS_NODE;
delete environment.ELECTRON_NO_ATTACH_CONSOLE;

const child = spawn(command, ['run'], {
  env: environment,
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error(`Unable to start Cypress: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
