import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { IncompleteParameterListValueError } from '../main/errors.js';
import * as utils from './utils.js';

import type { ParameterValues } from '../types/common.js';

describe('cli - utils', () => {
	describe('.parseParameterList', () => {
		it('should work with a single value', () => {
			const actual = utils.parseParameterList(['target=windows']);

			assert.deepStrictEqual<ParameterValues[]>(actual, [
				{ label: 'target', values: ['windows'] },
			]);
		});

		it('should work with a multiple values', () => {
			const actual = utils.parseParameterList(['target=windows,macos,linux']);

			assert.deepStrictEqual<ParameterValues[]>(actual, [
				{ label: 'target', values: ['windows', 'macos', 'linux'] },
			]);
		});

		it('should throw an error when parameter declaration has no label', () => {
			const action = (): unknown => utils.parseParameterList(['']);

			assert.throws(action, IncompleteParameterListValueError);
		});

		it('should throw an error when parameter declaration is corrupted', () => {
			const action = (): unknown => utils.parseParameterList(['=value']);

			assert.throws(action, IncompleteParameterListValueError);
		});

		it('should throw an error when parameter declaration has no value', () => {
			const action = (): unknown => utils.parseParameterList(['label=']);

			assert.throws(action, IncompleteParameterListValueError);
		});
	});
});
