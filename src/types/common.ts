export interface Options {
	/**
	 * @default []
	 */
	commandNames?: string[];
	/**
	 * @default 1
	 */
	runs?: number;
	/**
	 * @default 0
	 */
	warmup?: number;
	/**
	 * @default false
	 */
	showOutput?: boolean;
	/**
	 * @default false
	 */
	parallel?: boolean;
	/**
	 * @default 1
	 */
	concurrency?: number;
	/**
	 * @default false
	 */
	allowMultiple?: boolean;
	/**
	 * @default []
	 */
	parameters?: ParameterValues[];
	/**
	 * @default true
	 */
	strictParameters?: boolean;
	/**
	 * @default null
	 */
	includeMarkers?: string[] | null;
	/**
	 * @default 'detail'
	 */
	reporter?: string;
}

export interface ParameterValues {
	label: string;
	values: string[];
}

export interface Command {
	name: string | undefined;
	formatted: string;
	original: string;
	parameters: CommandParameters;
	warmupRunsCount: number;
	runsCount: number;
}

export type CommandParameters = Record<string, string>;

export enum MarkerType {
	Time = 'time',
	Memory = 'memory',
	Value = 'value',
}

export interface CombinedMarker {
	key: string;
	label: string;
	type: MarkerType;
	system: boolean;
	values: number[];
}

export interface CommandStatistic {
	mean: number;
	min: number;
	max: number;
	stddev: number;
	stddevPercent: number;
}
