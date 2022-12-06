import { performance } from 'node:perf_hooks';

import { MarkerType } from '../../types/common.js';
import { ProcessMarkerAlreadyRegisteredError } from '../errors.js';
import { Measurement } from './measurement.js';
import { Marker } from './marker.js';

import type { ProcessExecutor } from './process.js';
import type { Command } from '../../types/common.js';
import type { Settings } from '../settings.js';

export class IterationExecutor {
	#settings: Settings;
	#executor: ProcessExecutor;

	constructor(settings: Settings, executor: ProcessExecutor) {
		this.#settings = settings;
		this.#executor = executor;
	}

	public async execute(command: Command): Promise<Measurement> {
		const measurement = new Measurement();

		const processStartTime = performance.now();

		await this.#executor.execute(command, {
			onChunk: (chunk) => {
				const markers = this.#parseProcessOutput(chunk);

				for (const marker of markers) {
					if (!this.#settings.allowMultiple && measurement.has(marker)) {
						throw new ProcessMarkerAlreadyRegisteredError(marker.label);
					}

					measurement.add(marker);
				}
			},
		});

		const processTime = performance.now() - processStartTime;
		const processTimeMarker = new Marker('process.time', MarkerType.Time, processTime, true);

		measurement.add(processTimeMarker);

		return measurement;
	}

	#parseProcessOutput(input: string): Marker[] {
		const markers: Marker[] = [];

		// The input can contain the newline symbol.
		const lines = input.split(/\r?\n/);

		for (const line of lines) {
			const marker = Marker.fromString(line);

			if (marker === undefined) {
				continue;
			}

			markers.push(marker);
		}

		return markers;
	}
}
