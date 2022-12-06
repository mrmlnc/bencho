import { performance } from 'node:perf_hooks';

import * as marker from '../build/marker.js';

/**
* @type {'math' | 'math-spread' | 'loop' | 'sort' | 'reduce'}
*/
const mode = process.argv.slice(2)[0];

const method = getMethod(mode);

for (let index = 0; index < 100; index++) {
	const array = getArray();
	const max = measure(() => method(array));

	marker.value('max', max);
}

function math(array) {
	return Math.max.apply(null, array);
}

function mathSpread(array) {
	return Math.max(...array);
}

function loop(array) {
	let max = Number.NEGATIVE_INFINITY;

	for (const item of array) {
		if (max < item) {
			max = item;
		}
	}

	return max;
}

function sort(array) {
	array.sort((a, b) => a - b);

	return array[array.length - 1];
}

function reduce(array) {
	return array.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);
}

function getMethod(mode) {
	switch (mode) {
		case 'math': {
			return math;
		}

		case 'math-spread': {
			return mathSpread;
		}

		case 'loop': {
			return loop;
		}

		case 'sort': {
			return sort;
		}

		case 'reduce': {
			return reduce;
		}

		default: {
			throw new TypeError('Unknown mode');
		}
	}
}

function getArray() {
	const array = Array.from({ length: 100_000 }).map((_, index) => index);

	array.sort(() => Math.random() - 0.5);

	return array;
}

function measure(function_) {
	global.gc();

	const startTime = performance.now();

	const result = function_();

	const time = performance.now() - startTime;
	const memory = process.memoryUsage().heapUsed;

	marker.time('time', time);
	marker.memory('memory', memory);

	return result;
}
