import type { CombinedMarker } from '../../types/common.js';
import type { Measurement } from './measurement.js';

export class AggregateMeasurement {
	#measurements: Measurement[] = [];

	constructor(measurements: Measurement[]) {
		this.#measurements = measurements;
	}

	public combine(): CombinedMarker[] {
		const result: Record<string, CombinedMarker> = {};

		for (const measurement of this.#measurements) {
			for (const marker of measurement.markers) {
				const key = marker.key;

				const combined = result[key] ?? {
					key,
					label: marker.label,
					type: marker.type,
					system: marker.system,
					values: [],
				};

				combined.values.push(marker.value);

				result[key] = combined;
			}
		}

		return Object.values(result);
	}
}
