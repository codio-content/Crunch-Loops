var tests = require('./testsCommon');

/*var fibonacci = function(iterations, output, val1, val2) {
  if (iterations > 0) {
    output.push(fibonacci(iterations - 1, output, val2, val1 + val2));
  }
  return val1;
}*/
var FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946];

var res = tests.SimpleOutputTestWithInputRange('/home/codio/workspace/public/fibonacci.crunch',
  {min: 0, max: 20},
  function(inp, vars) {
    return {num: 2, values: [FIBONACCI.slice(0, inp[0]), FIBONACCI.slice(1, inp[0] + 1)]};
  }
);
tests.FlushOutput();

process.exit(!res);
