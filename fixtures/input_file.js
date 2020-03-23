// global variables.
var a = 1;
let b = 2;
c = 3;

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
  var local_1 = "1"
  local_1;
  console.log(local_1);
  var local_2;
  var local_3;
  console.log("offloaded");
}

square(3);
