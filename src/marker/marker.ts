import { BENCHO_MARKER_PREFIX } from '../main/constants.js';
import { MarkerType } from '../types/common.js';

export function time(label: string, value: number): void {
	log(label, MarkerType.Time, value);
}

export function memory(label: string, value: number): void {
	log(label, MarkerType.Memory, value);
}

export function value(label: string, value: number): void {
	log(label, MarkerType.Value, value);
}

export function log(label: string, type: MarkerType, value: number): void {
	console.log(formatMarker(label, type, value));
}

export class MarkerManager {
	#markers: string[] = [];

	public time(label: string, value: number): void {
		this.#markers.push(formatMarker(label, MarkerType.Time, value));
	}

	public memory(label: string, value: number): void {
		this.#markers.push(formatMarker(label, MarkerType.Memory, value));
	}

	public value(label: string, value: number): void {
		this.#markers.push(formatMarker(label, MarkerType.Value, value));
	}

	public flush(): void {
		for (const marker of this.#markers) {
			console.log(marker);
		}
	}
}

function formatMarker(label: string, type: MarkerType, value: number): string {
	return `${BENCHO_MARKER_PREFIX}:${label};${type};${value}`;
}
