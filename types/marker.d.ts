// I couldn't find a good way to generate the declaration files, so I copy them manually here.

export declare function time(label: string, value: number): void;
export declare function memory(label: string, value: number): void;
export declare function value(label: string, value: number): void;
export declare function log(label: string, type: 'memory' | 'time' | 'value', value: number): void;
export declare class MarkerManager {
	public time(label: string, value: number): void;
	public memory(label: string, value: number): void;
	public value(label: string, value: number): void;
	public flush(): void;
}
