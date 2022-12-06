import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { Settings } from '../settings.js';
import { CommandsManager } from './commands.js';
import { UnknownParameterPlaceholderError } from '../errors.js';

import type { Command } from '../../types/common.js';

describe('main – CommandsManager', () => {
	describe('.build', () => {
		it('should return an empty array of commands', () => {
			const settings = new Settings();
			const manager = new CommandsManager(settings);

			const actual = manager.build([]);

			assert.deepStrictEqual(actual, []);
		});

		it('should apply *runs option to commands', () => {
			const settings = new Settings({ runs: 11, warmup: 8 });
			const manager = new CommandsManager(settings);

			const expected: Command[] = [{
				name: undefined,
				formatted: 'echo 1',
				original: 'echo 1',
				parameters: {},
				runsCount: 11,
				warmupRunsCount: 8,
			}];

			const actual = manager.build(['echo 1']);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return an array of commands without parameters', () => {
			const settings = new Settings();
			const manager = new CommandsManager(settings);

			const expected: Command[] = [
				{
					name: undefined,
					formatted: 'echo 1',
					original: 'echo 1',
					parameters: {},
					runsCount: 1,
					warmupRunsCount: 0,
				},
				{
					name: undefined,
					formatted: 'echo 2',
					original: 'echo 2',
					parameters: {},
					runsCount: 1,
					warmupRunsCount: 0,
				},
			];

			const actual = manager.build(['echo 1', 'echo 2']);

			assert.deepStrictEqual(actual, expected);
		});

		it('should apply parameters with single values to commands', () => {
			const settings = new Settings({
				parameters: [{ label: 'type', values: ['system'] }],
			});
			const manager = new CommandsManager(settings);

			const expected: Command[] = [{
				name: undefined,
				formatted: 'echo 1 system',
				original: 'echo 1 {type}',
				parameters: { type: 'system' },
				runsCount: 1,
				warmupRunsCount: 0,
			}];

			const actual = manager.build(['echo 1 {type}']);

			assert.deepStrictEqual(actual, expected);
		});

		it('should apply parameters with multiple values to commands', () => {
			const settings = new Settings({
				parameters: [{ label: 'type', values: ['system', 'universal'] }],
			});
			const manager = new CommandsManager(settings);

			const expected: Command[] = [
				{
					name: undefined,
					formatted: 'echo 1 system',
					original: 'echo 1 {type}',
					parameters: { type: 'system' },
					runsCount: 1,
					warmupRunsCount: 0,
				},
				{
					name: undefined,
					formatted: 'echo 1 universal',
					original: 'echo 1 {type}',
					parameters: { type: 'universal' },
					runsCount: 1,
					warmupRunsCount: 0,
				},
			];

			const actual = manager.build(['echo 1 {type}']);

			assert.deepStrictEqual(actual, expected);
		});

		it('should throw an error when the command contains non existing parameter label', () => {
			const settings = new Settings();
			const manager = new CommandsManager(settings);

			assert.throws(() => manager.build(['echo 1 {type}']), UnknownParameterPlaceholderError);
		});

		it('should do not throw an error when the command contains non existing parameter label', () => {
			const settings = new Settings({ strictParameters: false });
			const manager = new CommandsManager(settings);

			const expected: Command[] = [{
				name: undefined,
				formatted: 'echo 1 {type}',
				original: 'echo 1 {type}',
				parameters: {},
				runsCount: 1,
				warmupRunsCount: 0,
			}];

			const actual = manager.build(['echo 1 {type}']);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
