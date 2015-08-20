var tests = require('./testsCommon');

var res = tests.SimpleOutputTestWithInputRange('/home/codio/workspace/public/nFactorial.crunch',
  {min: 0, max: 12},
  function(inp, vars) {
    var expected = 1;
    for (var i = 1; i <= inp[0]; ++i) {
      expected *= i;
    }
    return [expected];
  }
);
tests.FlushOutput();

process.exit(!res);