import { BENCHO_MARKER_RE } from '../constants.js';
import { InvalidMarkerDataError, InvalidMarkerLabelError, InvalidMarkerValueError, UnknownMarkerTypeError } from '../errors.js';
import { MarkerType } from '../../types/common.js';

type ParsedMarker = Readonly<[string, string, string]>;

export class Marker {
	public key: string;

	constructor(label: string, type: MarkerType, value: number, system: boolean = false) {
		this.label = label;
		this.type = type;
		this.value = value;
		this.system = system;

		this.key = `${label}.${type}`;
	}

	public static fromString(input: string): Marker | undefined {
		const match = input.match(BENCHO_MARKER_RE);

		if (match === null) {
			return undefined;
		}

		return this.#extractMarker(match);
	}

	static #extractMarker(match: RegExpMatchArray): Marker {
		const data = match.groups?.['data'] ?? '';

		const [label, type, value] = this.#getMarkerParts(data);

		return new Marker(this.#getMarkerLabel(label), this.#getMarkerType(type), this.#getMarkerValue(value));
	}

	static #getMarkerParts(data: string): ParsedMarker {
		const [label, type, value] = data.split(';');

		if (label === undefined || type === undefined || value === undefined) {
			throw new InvalidMarkerDataError(data);
		}

		return [label.trim(), type.trim(), value.trim()];
	}

	static #getMarkerLabel(input: string): string {
		const label = input.trim();

		if (label.length === 0) {
			throw new InvalidMarkerLabelError(label);
		}

		return label;
	}

	static #getMarkerType(input: string): MarkerType {
		const type = input.trim();

		if (!this.#isMarkerType(type)) {
			throw new UnknownMarkerTypeError(type);
		}

		return type;
	}

	static #isMarkerType(input: unknown): input is MarkerType {
		return typeof input === 'string' && Object.values<string>(MarkerType).includes(input);
	}

	static #getMarkerValue(input: string): number {
		const value = Number.parseFloat(input);

		if (!Number.isFinite(value)) {
			throw new InvalidMarkerValueError(input);
		}

		return value;
	}

	public accessor label: string;
	public accessor type: MarkerType;
	public accessor value: number;
	public accessor system: boolean;
}
