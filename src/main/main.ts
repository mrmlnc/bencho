import { CommandsManager } from './managers/commands.js';
import * as promiseUtils from './utils/promise.js';
import { CommandExecutor } from './executor/command.js';
import { UnknownReporterNameError } from './errors.js';
import { DetailReporter } from './reporters/detail.js';
import { CompactReporter } from './reporters/compact.js';
import { BenchmarkReporter } from './reporters/benchmark.js';
import { JsonReporter } from './reporters/json.js';
import { IterationExecutor } from './executor/iteration.js';
import { ProcessExecutor } from './executor/process.js';

import type { Reporter } from './reporters/reporter.js';
import type { Settings } from './settings.js';
import type { ExecutedCommand } from './executor/command.js';

export default async function main(input: string[], settings: Settings): Promise<void> {
	const processExecutor = new ProcessExecutor(settings);
	const iterationExecutor = new IterationExecutor(settings, processExecutor);

	const commandsManager = new CommandsManager(settings);
	const commandExecutor = new CommandExecutor(settings, iterationExecutor);

	const reporter = getReporter(settings.reporter, settings);

	const commands = commandsManager.build(input);

	const executedCommands: ExecutedCommand[] = [];

	await promiseUtils.map(commands, async (command) => {
		const executedCommand = await commandExecutor.execute(command);

		executedCommands.push(executedCommand);
	}, { concurrency: 1 });

	await reporter.report(executedCommands);
}

function getReporter(name: string, settings: Settings): Reporter {
	if (name === 'detail') {
		return new DetailReporter(settings);
	}

	if (name === 'compact') {
		return new CompactReporter(settings);
	}

	if (name === 'benchmark') {
		return new BenchmarkReporter(settings);
	}

	if (name === 'json') {
		return new JsonReporter(settings);
	}

	throw new UnknownReporterNameError(name);
}
