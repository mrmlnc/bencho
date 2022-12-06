import type { ExecutedCommand } from '../executor/command.js';
import type { Settings } from '../settings.js';

export abstract class Reporter {
	constructor(protected readonly _settings: Settings) {}

	public abstract report(commands: ExecutedCommand[]): Promise<void>;
}
