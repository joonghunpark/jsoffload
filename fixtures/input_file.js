// global variables.
var a = 1;
let b = 2;
let c = 3;

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
function offloaded(arg1, arg2, arg3) {
  console.log(a);
  var local_1 = "1"
  local_1;
  console.log(local_1);
  b;
  c;
  console.log("offloaded");
}

square(3);

// <<offload>>
function offloaded_add(a, b) {
	return a + b;
}

function outer(arg1, arg2) {
	console.log(arg1);
	function inner() {
		console.log(arg2);
	}
}

var add_result = offloaded_add(100, 1000);
console.log("add_result: " + add_result);
