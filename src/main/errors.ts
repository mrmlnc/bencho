export class ApplicationError extends Error {
	constructor(message: string) {
		super(message);

		this.name = 'ApplicationError';

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * The error that is thrown when the program executes an instruction that was thought to be unreachable.
 */
export class UnreachableError extends ApplicationError {
	constructor(message: string) {
		super(message);

		this.name = 'UnreachableError';
	}
}

export class InvalidCommandListItemError extends ApplicationError {
	constructor(value: string) {
		super(`Invalid command list item: ${value}. Cannot extract the command.`);

		this.name = 'InvalidCommandListItemError';
	}
}

export class IncompleteParameterListValueError extends ApplicationError {
	constructor(value: string) {
		super(`Incomplete parameter list value: ${value}`);

		this.name = 'IncompleteParameterListValueError';
	}
}

export class UnknownParameterPlaceholderError extends ApplicationError {
	constructor(placeholder: string) {
		super(`Unknown parameter placeholder in the command: ${placeholder}`);

		this.name = 'UnknownParameterPlaceholderError';
	}
}

export class InvalidMarkerDataError extends ApplicationError {
	constructor(data: string) {
		super(`Invalid marker data: ${data}`);

		this.name = 'InvalidMarkerDataError';
	}
}

export class InvalidMarkerLabelError extends ApplicationError {
	constructor(input: string) {
		super(`Invalid marker label: ${input}`);

		this.name = 'InvalidMarkerLabelError';
	}
}

export class UnknownMarkerTypeError extends ApplicationError {
	constructor(input: string) {
		super(`Unknown marker type: ${input}`);

		this.name = 'UnknownMarkerTypeError';
	}
}

export class InvalidMarkerValueError extends ApplicationError {
	constructor(input: string) {
		super(`Invalid marker value: ${input}`);

		this.name = 'InvalidMarkerValueError';
	}
}

export class ProcessMarkerAlreadyRegisteredError extends ApplicationError {
	constructor(label: string) {
		super(`Found duplicate marker in the same process: ${label}`);

		this.name = 'ProcessMarkerAlreadyRegisteredError';
	}
}

export class UnknownReporterNameError extends ApplicationError {
	constructor(name: string) {
		super(`Unknown reporter name: ${name}`);

		this.name = 'UnknownReporterNameError';
	}
}
