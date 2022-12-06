import EasyTable from 'easy-table';
import chalk from 'chalk';

import { Reporter } from './reporter.js';
import * as math from '../utils/math.js';
import * as utils from './utils.js';

import type { Command, CommandStatistic, MarkerType } from '../../types/common.js';
import type { ExecutedCommand } from '../executor/command.js';

type CommandMarkersStatistic = Record<string, MarkerStatistic>;

interface MarkerStatistic {
	label: string;
	type: MarkerType;
	commands: CommandMarkerStatistic[];
}

interface CommandMarkerStatistic {
	command: Command;
	statistic: CommandStatistic;
}

export class BenchmarkReporter extends Reporter {
	public async report(commands: ExecutedCommand[]): Promise<void> {
		const statistic = this.#calculateCommandsStatistic(commands);

		this.#reportMarkers(Object.values(statistic));
	}

	#calculateCommandsStatistic(commands: ExecutedCommand[]): CommandMarkersStatistic {
		const result: CommandMarkersStatistic = {};

		for (const command of commands) {
			for (const marker of command.result.combine()) {
				const label = marker.label;
				const type = marker.type;
				const item = result[label];

				if (item === undefined) {
					result[marker.label] = { label, type, commands: [] };
				}

				result[marker.label]?.commands.push({
					command: command.command,
					statistic: this.#calculateMarkerStatistic(marker.values),
				});
			}
		}

		return result;
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

	#reportMarkers(markers: MarkerStatistic[]): void {
		const table = new EasyTable();
		const tableLeftPadder = EasyTable.leftPadder(' ');

		for (const marker of markers) {
			if (this._settings.includeMarkers?.includes(marker.label) === false) {
				continue;
			}

			const formatValue = utils.getValueFormatter(marker.type);

			const formattedMarkerLabel = chalk.yellowBright('Marker');
			const formattedTypeLabel = chalk.blueBright('Type');
			const formattedMeanLabel = chalk.greenBright('Mean');
			const formattedStddevLabel = chalk.cyanBright('StdDev');
			const formattedStddevPercentLabel = chalk.magentaBright('StdDev, %');
			const formattedRatioLabel = chalk.redBright('Ratio');
			const formattedLowestLabel = chalk.cyanBright('Lowest');

			const baseline = marker.commands[0] as CommandMarkerStatistic;

			const ratios = marker.commands.map((command) => command.statistic.mean / baseline.statistic.mean);

			const minRatio = Math.min.apply(null, ratios);
			const maxRatio = Math.max.apply(null, ratios);

			for (const [index, command] of marker.commands.entries()) {
				const ratio = ratios[index] ?? 0;

				const isMaxRatio = ratio >= maxRatio;
				const isMinRatio = ratio <= minRatio;
				const isLowest = ratio === minRatio;

				table.cell(formattedMarkerLabel, marker.label);
				table.cell(formattedTypeLabel, marker.type);
				table.cell('Command', command.command.name ?? command.command.formatted);
				table.cell(formattedMeanLabel, formatValue(command.statistic.mean), tableLeftPadder);
				table.cell(formattedStddevLabel, formatValue(command.statistic.stddev), tableLeftPadder);
				table.cell(formattedStddevPercentLabel, utils.formatPercentValue(command.statistic.stddevPercent), tableLeftPadder);
				table.cell(formattedRatioLabel, this.#formatRatioValue(ratio, isMinRatio, isMaxRatio), tableLeftPadder);
				table.cell(formattedLowestLabel, isLowest ? chalk.cyanBright('yes') : '', tableLeftPadder);

				table.newRow();
			}

			table.newRow();
		}

		console.log(table.toString());
	}

	#formatRatioValue(ratio: number, isMinRatio: boolean, isMaxRatio: boolean): string {
		const value = ratio.toFixed(2);

		if (isMaxRatio) {
			return chalk.redBright(value);
		}

		if (isMinRatio) {
			return chalk.greenBright(value);
		}

		return value;
	}
}
