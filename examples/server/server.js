'use strict';

import { performance } from 'node:perf_hooks';
import http from 'node:http';

import { MarkerManager } from '../../build/marker.js';

const markerManager = new MarkerManager();

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		markerManager.flush();
		process.exit();
	});
}

http.createServer((request, response) => {
	const startTime = performance.now();

	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.write('hello!');
	response.end();

	const time = performance.now() - startTime;
	const memory = process.memoryUsage().heapUsed;

	markerManager.time('time', time);
	markerManager.memory('memory', memory);
})
	.listen(3000, '127.0.0.1');
