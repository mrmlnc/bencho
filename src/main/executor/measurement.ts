import type { Marker } from './marker.js';

export class Measurement {
	#markers: Set<Marker> = new Set<Marker>();
	#keys: Set<string> = new Set<string>();

	public accessor index: number = 0;

	public add(marker: Marker): void {
		this.#markers.add(marker);
		this.#keys.add(marker.key);
	}

	public has(marker: Marker): boolean {
		return this.#keys.has(marker.key);
	}

	public get markers(): Marker[] {
		return [...this.#markers];
	}
}
