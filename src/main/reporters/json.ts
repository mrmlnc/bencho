import { Reporter } from './reporter.js';

import type { ExecutedCommand } from '../executor/command.js';

export class JsonReporter extends Reporter {
	public async report(commands: ExecutedCommand[]): Promise<void> {
		const result = commands.map((command) => {
			return {
				command: command.command,
				result: command.result.combine().filter((marker) => {
					return this._settings.includeMarkers?.includes(marker.label);
				}),
			};
		});

		console.log(JSON.stringify(result, null, 2));
	}
}
