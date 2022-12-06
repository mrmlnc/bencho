import * as os from 'node:os';

import * as promiseUtils from '../utils/promise.js';
import { AggregateMeasurement } from './result.js';

import type { Command } from '../../types/common.js';
import type { Settings } from '../settings.js';
import type { Measurement } from './measurement.js';
import type { IterationExecutor } from './iteration.js';

export interface ExecutedCommand {
	command: Command;
	result: AggregateMeasurement;
}

export class CommandExecutor {
	#settings: Settings;
	#executor: IterationExecutor;

	constructor(settings: Settings, executor: IterationExecutor) {
		this.#settings = settings;
		this.#executor = executor;
	}

	public async execute(command: Command): Promise<ExecutedCommand> {
		await this.#executeWarmup(command);

		const measurements = await this.#executeRuns(command);
		const result = new AggregateMeasurement(measurements);

		return { command, result };
	}

	async #executeWarmup(command: Command): Promise<void> {
		await promiseUtils.times(command.warmupRunsCount, async () => {
			await this.#executor.execute(command);
		}, { concurrency: 1 });
	}

	async #executeRuns(command: Command): Promise<Measurement[]> {
		const concurrency = this.#getRunsConcurrency();

		return promiseUtils.times(command.runsCount, async (index) => {
			const measurement = await this.#executor.execute(command);

			measurement.index = index;

			return measurement;
		}, { concurrency });
	}

	#getRunsConcurrency(): number {
		if (this.#settings.parallel) {
			return Math.max(os.cpus().length, 1);
		}

		return this.#settings.concurrency;
	}
}
