import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { Marker } from './marker.js';
import { MarkerType } from '../../types/common.js';
import { InvalidMarkerDataError, InvalidMarkerLabelError, InvalidMarkerValueError, UnknownMarkerTypeError } from '../errors.js';

describe('main – Marker', () => {
	describe('constructor', () => {
		it('should apply arguments', () => {
			const actual = new Marker('label', MarkerType.Memory, 15, true);

			assert.strictEqual(actual.label, 'label');
			assert.strictEqual(actual.type, MarkerType.Memory);
			assert.strictEqual(actual.value, 15);
			assert.strictEqual(actual.system, true);
		});
	});

	describe('.fromString', () => {
		it('should return an undefined if an input does not contain marker', () => {
			const actual = Marker.fromString('string;but;not;marker');

			assert.strictEqual(actual, undefined);
		});

		it('should return a marker', () => {
			const expected = new Marker('label', MarkerType.Memory, 11);

			const actual = Marker.fromString('bencho_marker:label;memory;11');

			assert.strictEqual(actual?.label, expected.label);
			assert.strictEqual(actual.type, expected.type);
			assert.strictEqual(actual.value, expected.value);
			assert.strictEqual(actual.system, expected.system);
		});

		it('should return trim marker parts', () => {
			const expected = new Marker('label', MarkerType.Memory, 11);

			const actual = Marker.fromString('bencho_marker: label ; memory ; 11 ');

			assert.strictEqual(actual?.label, expected.label);
			assert.strictEqual(actual.type, expected.type);
			assert.strictEqual(actual.value, expected.value);
			assert.strictEqual(actual.system, expected.system);
		});

		it('should throw an error when the marker has an invalid data', () => {
			assert.throws(() => Marker.fromString('bencho_marker:label;'), InvalidMarkerDataError);
		});

		it('should throw an error when the marker has an invalid label', () => {
			assert.throws(() => Marker.fromString('bencho_marker:;memory;11'), InvalidMarkerLabelError);
		});

		it('should throw an error when the marker has an invalid type', () => {
			assert.throws(() => Marker.fromString('bencho_marker:label;;11'), UnknownMarkerTypeError);
		});

		it('should throw an error when the marker has an invalid value', () => {
			assert.throws(() => Marker.fromString('bencho_marker:label;memory;'), InvalidMarkerValueError);
		});
	});
});
