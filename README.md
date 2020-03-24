# jsoffload

## Usage

Step 1.
Run Babel transformation command
```sh
node_modules/.bin/babel fixtures/input_file.js --out-dir lib
```

This command takes input js file and transform its js function's form to use lib/offload_lib.js's |remoteExecution|.
```sh
input file : fixtures/input_file.js
output file (babel transformed result) : lib/input_file.js
```

## Example

* input: fixtures/input_file.js
```sh
var a = 1;
let b = 2;

// test comments 1
// test comments 2
function square(n) {
  // test inner 1
  return n * n;
  // test inner 2
}

// test comments 3
function test(n) {
        return n * n;
}
// test comments 4
// <<offload>>
function offloaded(a, b, c) {
  console.log("offloaded");
}

square(3);
```

* output: lib/input_file.js

```sh
"use strict";

var a = 1;
let b = 2; // test comments 1
// test comments 2

function square(n) {
  // test inner 1
  return n * n; // test inner 2
} // test comments 3


function test(n) {
  return n * n;
} // test comments 4
// <<offload>>


function _offloaded(a, b, c) {
  console.log("offloaded");
}

function offloaded(a, b, c) {
  remoteExecution(_offloaded, [a, b, c]);
}

square(3);
```

Step 2. Run src/node_server.js with node

```sh
node src/node_server.js
```

Step 3. Run chromium with the runtime option as below.
This is for disable CORS for now for test purpose.
"fixtures/offload_test.html" files includes "lib/offload_lib.js" in top of it.
```sh
out/Release/chrome --disable-web-security --user-data-dir='/tmp' fixtures/offload_test.html
```

Step 4. Open inspector console and see the console.log to check the behavior.

## Overall

* src/offload_babel_plugin.js
```sh
This babel plugin identifies // <<offload>> comment located right above a function,
then generate a function which has '_' prefixed name, e.g. "_test"
if the function name is "test".

The "_test" function has its original function's body content,
and "test" function's body is replaced with |remoteExecution| CallExpression,
which is defined in lib/offload_lib.js library.
```
* lib/offload_lib.js 
```sh
It has |remoteExecution| function definition,
which is in charge of passing the js call to server via network,
and receiving the remote execution's result.
```
