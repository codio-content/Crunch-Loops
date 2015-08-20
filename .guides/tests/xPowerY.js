var tests = require('./testsCommon');

var res = tests.SimpleOutputTestWithInputRange('/home/codio/workspace/public/xPowerY.crunch',
  {num: 2, min: -1, max: 10},
  function(inp, vars) {
    if (inp[0] < 0 || inp[1] < 0) {
      return [-1];
    }
    return [Math.pow(inp[0], inp[1])];
  }
);
tests.FlushOutput();

process.exit(!res);