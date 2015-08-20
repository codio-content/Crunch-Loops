var tests = require('./testsCommon');
var constants = require('./crunchConstants');

var data = tests.GetCrunchData('/home/codio/workspace/public/x2.crunch');
if (data && tests.CountNumInstructionsOfType(data, constants.INSTRUCTION_TYPE_OUT) > 1) {
  console.log('You are not allowed to use more than one OUT for this test.');
  process.exit(1);
}

var res = tests.SimpleOutputTest('/home/codio/workspace/public/x2.crunch', 
  [],
  function(inp, vars) {
    return [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
  }
);
tests.FlushOutput();

process.exit(!res);
