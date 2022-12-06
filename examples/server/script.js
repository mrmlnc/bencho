'use strict';

import path from 'node:path';
import cp from 'node:child_process';
import url from 'node:url';

// ESM
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, './server.js');

const child = cp.spawn('node', [serverPath], {
	cwd: process.cwd(),
	encoding: 'utf8',
	stdio: 'inherit',
});

await new Promise(resolve => setTimeout(() => resolve(), 100));

for (const signal of ['uncaughtException', 'SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		process.kill(child.pid);
		process.exit();
	})
}

for (let index = 0; index < 1_000; index++) {
	try {
		await fetch('http://127.0.0.1:3000');
	} catch (error) {
		console.log(error);
	}
}

process.kill(child.pid);
process.exit();
