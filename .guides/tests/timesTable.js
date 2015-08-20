var tests = require('./testsCommon');

var res = tests.SimpleOutputTestWithInputRange('/home/codio/workspace/public/timesTable.crunch',
  {min: 1, max: 16},
  function(inp, vars) {
    var expected = [];
    if (inp[0] <= 12) {
      for (var i = 1; i <= 12; ++i) {
        expected.push(i * inp[0]);
      }
    } else {
      expected.push(99);
    }
    return expected;
  }
);
tests.FlushOutput();

process.exit(!res);