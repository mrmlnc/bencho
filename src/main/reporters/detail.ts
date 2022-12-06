import EasyTable from 'easy-table';
import chalk from 'chalk';

import * as math from '../utils/math.js';
import { Reporter } from './reporter.js';
import * as utils from './utils.js';

import type { ExecutedCommand } from '../executor/command.js';
import type { CommandStatistic, Command } from '../../types/common.js';

export class DetailReporter extends Reporter {
	public async report(commands: ExecutedCommand[]): Promise<void> {
		for (const [index, command] of commands.entries()) {
			const isLatestCommand = index === commands.length - 1;

			console.log(chalk.cyan(`Benchmark #${index + 1} `));

			this.#reportCommand(command);

			if (!isLatestCommand) {
				console.log('');
			}
		}
	}

	#reportCommand(command: ExecutedCommand): void {
		const table = new EasyTable();
		const tableLeftPadder = EasyTable.leftPadder(' ');

		const markers = command.result.combine();

		this.#reportCommandHeader(command.command);

		markers.sort((a, b) => b.type.localeCompare(a.type));

		for (const marker of markers) {
			if (this._settings.includeMarkers?.includes(marker.label) === false) {
				continue;
			}

			const statistic = this.#calculateMarkerStatistic(marker.values);

			const formatValue = utils.getValueFormatter(marker.type);

			const formattedMarkerLabel = chalk.yellowBright('Marker');
			const formattedTypeLabel = chalk.blueBright('Type');
			const formattedMeanLabel = chalk.greenBright('Mean');
			const formattedStddevLabel = chalk.cyanBright('StdDev');
			const formattedStddevPercentLabel = chalk.magentaBright('StdDev, %');

			table.cell(formattedMarkerLabel, marker.label);
			table.cell(formattedTypeLabel, marker.type);
			table.cell(formattedMeanLabel, formatValue(statistic.mean), tableLeftPadder);
			table.cell(formattedStddevLabel, formatValue(statistic.stddev), tableLeftPadder);
			table.cell(formattedStddevPercentLabel, utils.formatPercentValue(statistic.stddevPercent), tableLeftPadder);
			table.cell('Min', formatValue(statistic.min), tableLeftPadder);
			table.cell('Max', formatValue(statistic.max), tableLeftPadder);

			table.newRow();
		}

		console.log(table.toString());
	}

	#reportCommandHeader(command: Command): void {
		const commandLabel = 'Command';
		const parametersLabel = 'Parameters';

		const labelPaddingLength = parametersLabel.length - commandLabel.length;

		const lines: string[] = [
			// Command: node ./index.js main
			`${chalk.whiteBright(commandLabel)}: ${' '.repeat(labelPaddingLength)}${command.formatted}`,
		];

		if (command.formatted !== command.original) {
			const padding = ' '.repeat(commandLabel.length + labelPaddingLength + 1);

			// <whitespace> node ./index.js {branch}
			lines.push(`${padding} ${chalk.grey(command.original)}`);
		}

		// Make the output of parameters part of the command? ...{mode=previous} {pattern=*}
		const parameters = Object.entries(command.parameters)
			.map(([key, value]) => `${key}=${value}`)
			.join(', ');

		if (parameters !== '') {
			// Parameters: branch=main
			lines.push(`${chalk.whiteBright(parametersLabel)}: ${parameters}`);
		}

		console.log(`${lines.join('\n')}\n`);
	}

	#calculateMarkerStatistic(values: number[]): CommandStatistic {
		const min = Math.min.apply(null, values);
		const max = Math.max.apply(null, values);
		const mean = math.mean(values);
		const stddev = math.stddev(values);

		return {
			min,
			max,
			mean,
			stddev,
			stddevPercent: stddev / mean * 100,
		};
	}
}
