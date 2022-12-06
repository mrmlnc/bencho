import fastCartesian from 'fast-cartesian';

import { UnknownParameterPlaceholderError, UnreachableError } from '../errors.js';

import type { Command, CommandParameters, ParameterValues } from '../../types/common.js';
import type { Settings } from '../settings.js';

export class CommandsManager {
	readonly #settings: Settings;

	constructor(settings: Settings) {
		this.#settings = settings;
	}

	public build(commands: string[]): Command[] {
		if (this.#settings.parameters.length > 0) {
			return this.#multipleCommandsByParameters(commands);
		}

		return commands.map((command, index) => {
			return this.#buildCommand(this.#getCommandName(index), command, {});
		});
	}

	#getParameterCombinations(parameters: ParameterValues[]): string[][] {
		return fastCartesian(parameters.map((item) => item.values));
	}

	#getCommandParameters(values: string[]): CommandParameters {
		const parameters: CommandParameters = {};

		for (const [index, value] of values.entries()) {
			const label = this.#settings.parameters[index]?.label;

			if (label === undefined) {
				throw new UnreachableError('Cannot extract the label for the parameter value.');
			}

			parameters[label] = value;
		}

		return parameters;
	}

	#buildCommand(name: string | undefined, original: string, parameters: CommandParameters): Command {
		return {
			name: name === undefined ? undefined : this.#formatCommand(name, parameters),
			original,
			formatted: this.#formatCommand(original, parameters),
			parameters,
			warmupRunsCount: this.#settings.warmup,
			runsCount: this.#settings.runs,
		};
	}

	#formatCommand(command: string, parameters: CommandParameters): string {
		// eslint-disable-next-line prefer-named-capture-group
		return command.replace(/{(\w+)}/g, (substring, placeholder: string) => {
			const value = parameters[placeholder];

			if (this.#settings.strictParameters && value === undefined) {
				throw new UnknownParameterPlaceholderError(placeholder);
			}

			return value ?? substring;
		});
	}

	#multipleCommandsByParameters(commands: string[]): Command[] {
		const result: Command[] = [];

		const parametersGroups = this.#getParameterCombinations(this.#settings.parameters);

		for (const [index, command] of commands.entries()) {
			for (const parameterGroup of parametersGroups) {
				const name = this.#getCommandName(index);
				const parameters = this.#getCommandParameters(parameterGroup);

				result.push(this.#buildCommand(name, command, parameters));
			}
		}

		return result;
	}

	#getCommandName(commandIndex: number): string | undefined {
		return this.#settings.commandNames[commandIndex];
	}
}
