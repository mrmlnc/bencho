import * as assert from 'node:assert';

import { describe, it } from 'mocha';

import { Measurement } from './measurement.js';
import { Marker } from './marker.js';
import { MarkerType } from '../../types/common.js';
import { AggregateMeasurement } from './result.js';

describe('main – AggregateMeasurement', () => {
	describe('.combine', () => {
		it('should return result', () => {
			const firstMeasurement = new Measurement();

			firstMeasurement.add(new Marker('time', MarkerType.Time, 11));
			firstMeasurement.add(new Marker('memory', MarkerType.Memory, 22));

			const secondMeasurement = new Measurement();

			secondMeasurement.add(new Marker('time', MarkerType.Time, 33));
			secondMeasurement.add(new Marker('memory', MarkerType.Memory, 44));

			const combiner = new AggregateMeasurement([firstMeasurement, secondMeasurement]);

			const actual = combiner.combine();

			assert.deepStrictEqual(actual[0]?.values, [11, 33]);
			assert.deepStrictEqual(actual[1]?.values, [22, 44]);
		});
	});
});
