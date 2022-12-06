
import * as assert from 'node:assert';

import { afterEach, describe, it } from 'mocha';
import * as sinon from 'sinon';

import { Settings } from '../settings.js';
import { ProcessExecutor } from './process.js';

import type { Command } from '../../types/common.js';

describe('main – ProcessExecutor', () => {
	afterEach(() => {
		sinon.reset();
		sinon.restore();
	});

	describe('.execute', () => {
		it('should execute command', async () => {
			const settings = new Settings();
			const executor = new ProcessExecutor(settings);

			const command: Command = {
				name: undefined,
				formatted: 'node -p 123',
				original: 'node -p 123',
				parameters: {},
				warmupRunsCount: 1,
				runsCount: 1,
			};

			let output = '';

			await executor.execute(command, {
				onChunk: (chunk) => {
					output += chunk;
				},
			});

			assert.strictEqual(output, '123\n');
		});

		it('should redirect output to process', async () => {
			const settings = new Settings({ showOutput: true });
			const executor = new ProcessExecutor(settings);

			const stdoutStub = sinon.stub(process.stdout);

			const command: Command = {
				name: undefined,
				formatted: 'node -p 123',
				original: 'node -p 123',
				parameters: {},
				warmupRunsCount: 1,
				runsCount: 1,
			};

			await executor.execute(command);

			sinon.assert.calledOnceWithExactly(stdoutStub.write, '123\n');
		});
	});
});
