var tests = require('./testsCommon');

var res = tests.SimpleOutputTestWithInputRange('/home/codio/workspace/public/print0ToN.crunch',
  {min: 0, max: 20},
  function(inp, vars) {
    var expected = [0];
    for (var i = 1; i <= inp[0]; ++i) {
      expected.push(i);
    }
    return expected;
  }
);
tests.FlushOutput();

process.exit(!res);