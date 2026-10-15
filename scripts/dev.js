import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const backendPort = Number(process.env.PORT) || 3000;
const children = new Set();
let stopping = false;

function start(command, args, env = process.env) {
  const child = spawn(command, args, { stdio: 'inherit', env });
  children.add(child);
  child.once('error', (error) => {
    console.error(`Could not start ${command}:`, error.message);
    stop(1);
  });
  child.once('exit', (code, signal) => {
    children.delete(child);
    if (!stopping) {
      if (signal) console.error(`${command} exited after ${signal}.`);
      stop(code || 1);
    }
  });
  return child;
}

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 1000).unref();
}

async function waitForBackend(server) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (stopping || server.exitCode !== null) throw new Error('Backend exited before becoming ready.');
    try {
      const response = await fetch(`http://127.0.0.1:${backendPort}/healthz`);
      if (response.ok) return;
    } catch {
      // The server may need a moment to bind its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Backend did not become ready on port ${backendPort} within 15 seconds. Check for a port conflict.`);
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

try {
  const server = start(process.execPath, ['server/index.js'], {
    ...process.env,
    NODE_ENV: 'development',
    PORT: String(backendPort),
    BATLAIYE_BACKEND_PORT: String(backendPort),
  });
  await waitForBackend(server);
  if (stopping) process.exit(1);

  console.log(`Backend ready on http://127.0.0.1:${backendPort}. Starting Vite; use its printed Local URL.`);
  const clientCommand = isWindows
    ? ['cmd.exe', ['/d', '/s', '/c', 'npm run dev:client']]
    : ['npm', ['run', 'dev:client']];
  start(clientCommand[0], clientCommand[1], {
    ...process.env,
    BATLAIYE_BACKEND_PORT: String(backendPort),
  });
} catch (error) {
  console.error(error.message);
  stop(1);
}
