import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { Settings } from '../settings.js';
import { IterationExecutor } from './iteration.js';
import { ProcessExecutor } from './process.js';

import type { Command } from '../../types/common.js';

describe('main – IterationExecutor', () => {
	describe('.execute', () => {
		it('should return a measurement with only system markers for command without markers', async () => {
			const settings = new Settings();
			const executor = new IterationExecutor(settings, new ProcessExecutor(settings));

			const command: Command = {
				name: undefined,
				formatted: 'node -p 123',
				original: 'node -p 123',
				parameters: {},
				warmupRunsCount: 1,
				runsCount: 1,
			};

			const actual = await executor.execute(command);

			assert.strictEqual(actual.markers.length, 1);
		});

		it('should return a measurement with custom markers', async () => {
			const settings = new Settings();
			const executor = new IterationExecutor(settings, new ProcessExecutor(settings));

			const command: Command = {
				name: undefined,
				formatted: 'node -p "\'bencho_marker:time;time;11\'"',
				original: 'node -p "\'bencho_marker:time;time;11\'"',
				parameters: {},
				warmupRunsCount: 1,
				runsCount: 1,
			};

			const actual = await executor.execute(command);

			assert.strictEqual(actual.markers.length, 2);
			assert.deepStrictEqual(actual.markers.map((item) => item.key), ['time.time', 'process.time.time']);
		});
	});
});
