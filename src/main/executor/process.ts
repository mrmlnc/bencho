import * as cp from 'node:child_process';
import * as process from 'node:process';

import * as promiseUtils from '../utils/promise.js';

import type { Settings } from '../settings.js';
import type { Command } from '../../types/common.js';
import type { ChildProcessByStdio } from 'node:child_process';
import type { Readable } from 'node:stream';

type ChildProcess = ChildProcessByStdio<null, Readable, Readable>;

export type OnChunkFunction = (chunk: string) => void;
export type OnEndFunction = (process: ChildProcess) => void;

interface ExecuteOptions {
	onChunk?: OnChunkFunction;
}

export class ProcessExecutor {
	readonly #settings: Settings;

	constructor(settings: Settings) {
		this.#settings = settings;
	}

	public async execute(command: Command, options: ExecuteOptions = {}): Promise<unknown> {
		const deferred = promiseUtils.deferred();

		const process_ = this.#spawnProcess(command.formatted);

		if (options.onChunk !== undefined) {
			process_.stderr.on('data', (chunk: string) => options.onChunk?.(chunk));
			process_.stdout.on('data', (chunk: string) => options.onChunk?.(chunk));
		}

		if (this.#settings.showOutput) {
			this.#pipeStdioToProcess(process_);
		}

		process_.once('error', (error) => {
			deferred.reject(error);
		});

		process_.once('close', () => {
			deferred.resolve();
		});

		return deferred.promise;
	}

	#spawnProcess(command: string): ChildProcess {
		const process_ = cp.spawn(command, {
			shell: true,
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		process_.stderr.setEncoding('utf8');
		process_.stdout.setEncoding('utf8');

		return process_;
	}

	#pipeStdioToProcess(process_: ChildProcess): void {
		process_.stderr.pipe(process.stdout);
		process_.stdout.pipe(process.stdout);
	}
}
