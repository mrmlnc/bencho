import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';

import { MarkerType } from '../../types/common.js';

export function getValueFormatter(type: MarkerType): (value: number) => string {
	switch (type) {
		case MarkerType.Time: {
			return formatTimeValue;
		}

		case MarkerType.Memory: {
			return formatMemoryValue;
		}

		default: {
			return (value) => value.toString();
		}
	}
}

export function formatTimeValue(ms: number): string {
	return prettyMilliseconds(ms, {
		secondsDecimalDigits: 3,
		millisecondsDecimalDigits: 3,
	});
}

export function formatMemoryValue(bytes: number): string {
	return prettyBytes(bytes, {
		binary: true,
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	});
}

export function formatPercentValue(value: number): string {
	return `${value.toFixed(3)}%`;
}
