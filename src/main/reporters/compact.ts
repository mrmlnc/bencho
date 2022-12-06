import chalk from 'chalk';
import EasyTable from 'easy-table';

import { Reporter } from './reporter.js';
import * as math from '../utils/math.js';
import * as utils from './utils.js';

import type { ExecutedCommand } from '../executor/command.js';
import type { CommandStatistic, MarkerType } from '../../types/common.js';

interface MarkerStatistic {
	label: string;
	type: MarkerType;
	statistic: CommandStatistic;
}

export class CompactReporter extends Reporter {
	public async report(commands: ExecutedCommand[]): Promise<void> {
		const table = new EasyTable();

		for (const command of commands) {
			const markers = this.#calculateCommandStatistic(command);

			table.cell('Label', command.command.name ?? command.command.formatted);

			for (const marker of markers) {
				const formatter = utils.getValueFormatter(marker.type);

				const label = `${marker.label} (${chalk.grey(marker.type)})`;
				const mean = formatter(marker.statistic.mean);
				const stderr = utils.formatPercentValue(marker.statistic.stddevPercent);

				table.cell(label, `${chalk.cyan(mean)} ±${stderr}`);
			}

			table.newRow();
		}

		console.log(table.toString());
	}

	#calculateCommandStatistic(command: ExecutedCommand): MarkerStatistic[] {
		const result: MarkerStatistic[] = [];

		for (const marker of command.result.combine()) {
			const statistic = this.#calculateMarkerStatistic(marker.values);

			result.push({
				label: marker.label,
				type: marker.type,
				statistic,
			});
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
}
