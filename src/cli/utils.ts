import { IncompleteParameterListValueError } from '../main/errors.js';

import type { ParameterValues } from '../types/common.js';

export function parseParameterList(values: string[] = []): ParameterValues[] | never {
	return values.map((value) => {
		const parts = value.split('=');

		const label = parts[0] ?? '';
		const values = parts[1] ?? '';

		if (label.length === 0 || values.length === 0) {
			throw new IncompleteParameterListValueError(value);
		}

		return {
			label,
			values: values.split(','),
		};
	});
}
