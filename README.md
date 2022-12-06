# bencho

> A command-line benchmarking tool.

> :book: This is an early version of the package.

Bencho is inspired by [hyperfine](https://github.com/sharkdp/hyperfine). The main difference is the method of measurement. Measurements in Bencho are based on markers placed inside the process being measured. Any number of markers. Supports marker types. Any programming language. Any framework. Any integration with other tools like OpenTelemetry or loggers.

See the example in the [`./examples/min.js`](./examples/min.js) file.

```php
$ bencho 'node --expose-gc ./examples/min.js {mode}' -n 'min.js {mode}' -r 1 -l mode=math,math-spread,loop,sort,reduce --reporter benchmark --allow-multiple

Marker        Type    Command             Mean       StdDev       StdDev, %  Ratio   Lowest
------------  ------  ------------------  ---------  -----------  ---------  ------  ------
time          time    min.js math           0.148ms      0.017ms    11.744%    1.00     yes
time          time    min.js math-spread    0.152ms      0.027ms    17.487%    1.03
time          time    min.js loop           0.241ms      0.341ms   141.105%    1.63
time          time    min.js sort          18.774ms      0.528ms     2.815%  126.58
time          time    min.js reduce         1.246ms      0.066ms     5.270%    8.40

memory        memory  min.js math         4.180 MiB  130.722 kiB     3.054%    1.00     yes
memory        memory  min.js math-spread  4.251 MiB  104.033 kiB     2.390%    1.02
memory        memory  min.js loop         4.358 MiB  415.165 kiB     9.304%    1.04
memory        memory  min.js sort         6.026 MiB  163.173 kiB     2.644%    1.44
memory        memory  min.js reduce       4.411 MiB  132.157 kiB     2.926%    1.06

max           value   min.js math             99999            0     0.000%    1.00     yes
max           value   min.js math-spread      99999            0     0.000%    1.00     yes
max           value   min.js loop             99999            0     0.000%    1.00     yes
max           value   min.js sort             99999            0     0.000%    1.00     yes
max           value   min.js reduce           99999            0     0.000%    1.00     yes

process.time  time    min.js math            4.018s          0ms     0.000%    1.00
process.time  time    min.js math-spread     4.011s          0ms     0.000%    1.00     yes
process.time  time    min.js loop            4.028s          0ms     0.000%    1.00
process.time  time    min.js sort            5.873s          0ms     0.000%    1.46
process.time  time    min.js reduce          4.124s          0ms     0.000%    1.03
```

## How does it work?

In the code you place markers for time, memory or any numeric values. Markers write information to stdout or stderr.

Examples of such a marker:

```js
bencho_marker:<marker_label>;<marker_type>;<marker_value>

bencho_marker:time;time;${time}
bencho_marker:memory;memory;${memory}
bencho_marker:counter;value;${counter}
```

> :book: Bencho does not perform any manipulations with your code.
>
> In general, you can use `console.log` or `console.error` when you put markers in the benchmark code. In more complex cases, you can work with markers by condition to be able to cut them out at build time for production.

Run bencho, specifying the necessary number of warm-up and main runs. Bencho starts the process and collects marker information from stdout and stderr.

Then the markers are processed and the statistics are calculated. And boom! You can see the results.

## Installation

> :book: Right now we only support installation from the `npm` registry.

```console
npm install bencho
```

## Usage

Check our help using the `bencho --help` command and see examples in the `./examples` directory.

An example of your code before using this package:

```js
// ./code.mjs
async function findAllEmptyResolutions() { /* code */ }

await findAllEmptyResolutions();
```

Instrumented code:

```js
// ./code.mjs
import { performance } from 'node:perf_hooks';
import * as bencho from 'bencho';

async function findAllEmptyResolutions() { /* code */ }

const startTime = performance.now();

// Calling the measured function.
await findAllEmptyResolutions();

// Calculating values for metrics.
const time = performance.now() - startTime;
const memory = process.memoryUsage().heapUsed;

// Report markers.
bencho.time('time', time);
bencho.memory('memory', memory);
```

Command to run:

```shell
$ bencho 'node ./code.mjs' -w 10 -r 50
```

Results:

```php
Benchmark #1
Command:    node ./code.mjs
            node ./code.mjs

Marker        Type    Mean       StdDev   StdDev, %  Min        Max
------------  ------  ---------  -------  ---------  ---------  ---------
time          time      0.011ms  0.002ms    19.064%    0.008ms    0.017ms
process.time  time     36.135ms  2.163ms     5.985%   33.077ms   43.087ms
memory        memory  5.127 MiB  0.000 B     0.000%  5.127 MiB  5.127 MiB
```
