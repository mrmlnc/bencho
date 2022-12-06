import type { Options, ParameterValues } from '../types/common.js';

export class Settings implements Options {
	declare public readonly commandNames: string[];
	declare public readonly runs: number;
	declare public readonly warmup: number;
	declare public readonly showOutput: boolean;
	declare public readonly allowMultiple: boolean;
	declare public readonly parallel: boolean;
	declare public readonly concurrency: number;
	declare public readonly parameters: ParameterValues[];
	declare public readonly strictParameters: boolean;
	declare public readonly includeMarkers: string[] | null;
	declare public readonly reporter: string;

	constructor(options: Options = {}) {
		this.commandNames = this.#getValue(options.commandNames, []);
		this.runs = this.#getValue(options.runs, 1);
		this.warmup = this.#getValue(options.warmup, 0);
		this.showOutput = this.#getValue(options.showOutput, false);
		this.allowMultiple = this.#getValue(options.allowMultiple, false);
		this.parallel = this.#getValue(options.parallel, false);
		this.concurrency = this.#getValue(options.concurrency, 1);
		this.parameters = this.#getValue(options.parameters, []);
		this.strictParameters = this.#getValue(options.strictParameters, true);
		this.includeMarkers = this.#getValue(options.includeMarkers, null);
		this.reporter = this.#getValue(options.reporter, 'detail');
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}
