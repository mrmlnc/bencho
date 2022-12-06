import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { Settings } from '../settings.js';
import { IterationExecutor } from './iteration.js';
import { ProcessExecutor } from './process.js';
import { CommandExecutor } from './command.js';

import type { Command } from '../../types/common.js';

describe('main – CommandExecutor', () => {
	describe('.execute', () => {
		it('should execute command', async () => {
			const settings = new Settings({ warmup: 3, runs: 3 });
			const processExecutor = new ProcessExecutor(settings);
			const iterationExecutor = new IterationExecutor(settings, processExecutor);
			const executor = new CommandExecutor(settings, iterationExecutor);

			const command: Command = {
				name: undefined,
				formatted: 'node -p "\'bencho_marker:time;time;11\'"',
				original: 'node -p "\'bencho_marker:time;time;11\'"',
				parameters: {},
				warmupRunsCount: 3,
				runsCount: 3,
			};

			const actual = await executor.execute(command);

			assert.deepStrictEqual(actual.command, command);

			const markers = actual.result.combine();

			// Runs count.
			assert.strictEqual(markers.length, 2);
			assert.strictEqual(markers[0]?.key, 'time.time');
			assert.deepStrictEqual(markers[0]?.values, [11, 11, 11]);
		});
	});
});
