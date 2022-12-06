import * as path from 'node:path';
import * as fs from 'node:fs';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import main from '../main/main.js';
import * as utils from './utils.js';
import { Settings } from '../main/settings.js';

const FLOW_GROUP_LABEL = 'Flow options';
const COMMAND_OPTIONS_LABEL = 'Commands options';
const PARAMETERS_GROUP_LABEL = 'Parameters options';
const OUTPUT_GROUP_LABEL = 'Output options';

const packagePath = path.resolve('./package.json');
const packageContent = fs.readFileSync(packagePath, 'utf8');

interface PackageJson {
	name: string;
	description: string;
	version: string;
}

const packageInfo = JSON.parse(packageContent) as PackageJson;

await yargs(hideBin(process.argv))
	.scriptName(packageInfo.name)
	.version(packageInfo.version)
	.showHelpOnFail(false)
	.wrap(null)
	.command('* <commands...>', packageInfo.description, (builder) => {
		return builder
			.positional('commands', {
				type: 'string',
				array: true,
				description: [
					'The commands to benchmark. This can be the name of an executable a command line',
					'like "grep -i todo" or a shell command like "sleep 0.5 && echo test".',
				].join('\n'),
				demandOption: true,
			})
			.option('runs', {
				alias: 'r',
				type: 'number',
				description: 'Perform exactly NUM runs for each command.',
				group: FLOW_GROUP_LABEL,
			})
			.option('warmup', {
				alias: 'w',
				type: 'number',
				description: 'Perform NUM warmup runs sequentially before the actual benchmark.',
				group: FLOW_GROUP_LABEL,
			})
			.option('parallel', {
				type: 'boolean',
				description: 'Perform runs for each command in parallel, using all available cores.',
				group: FLOW_GROUP_LABEL,
			})
			.option('concurrency', {
				alias: 'c',
				type: 'number',
				description: 'Perform runs for each command with the specified concurrency.',
				group: FLOW_GROUP_LABEL,
			})
			.option('command-name', {
				alias: 'n',
				type: 'string',
				array: true,
				description: [
					'Give a meaningful name to a command. This can be specified multiple times',
					'if several commands are benchmarked.',
				].join('\n'),
				group: COMMAND_OPTIONS_LABEL,
			})
			.option('show-output', {
				type: 'boolean',
				description: [
					'Print the stdout and stderr of the benchmark instead of suppressing it. This',
					'will increase the time it takes for benchmarks to run, so it should only be',
					'used for debugging purposes or when trying to benchmark output speed.',
				].join('\n'),
				group: OUTPUT_GROUP_LABEL,
			})
			.option('allow-multiple', {
				type: 'boolean',
				description: [
					'Allow to report the same marker multiple times from the same run. By default,',
					'each marker can be reported once per run.',
				].join('\n'),
				group: OUTPUT_GROUP_LABEL,
			})
			.option('parameter-list', {
				alias: 'l',
				type: 'string',
				array: true,
				description: [
					'Perform command runs for each value in the comma-separated list <VALUES>.',
					'Replaces the string "{VAR}" in each command by the current parameter value.',
				].join('\n'),
				group: PARAMETERS_GROUP_LABEL,
			})
			.option('strict-parameters', {
				type: 'boolean',
				description: [
					'Throw an error if the parameter presented in the command, but not presented',
					'in the parameter list.',
				].join('\n'),
				group: PARAMETERS_GROUP_LABEL,
			})
			.option('include-marker', {
				type: 'string',
				array: true,
				description: 'Prints only those markers that are specified in this list.',
				group: OUTPUT_GROUP_LABEL,
			})
			.option('reporter', {
				type: 'string',
				description: 'The name of the reporter that will be used when outputting the results.',
				group: OUTPUT_GROUP_LABEL,
				choices: ['benchmark', 'detail', 'compact', 'json'],
			});
	}, async (args) => {
		const settings = new Settings({
			commandNames: args.commandName,
			runs: args.runs,
			warmup: args.warmup,
			showOutput: args.showOutput,
			allowMultiple: args.allowMultiple,
			concurrency: args.concurrency,
			parallel: args.parallel,
			parameters: utils.parseParameterList(args.parameterList),
			strictParameters: args.strictParameters,
			includeMarkers: args.includeMarker,
			reporter: args.reporter,
		});

		await main(args.commands, settings);
	})
	.parseAsync();
