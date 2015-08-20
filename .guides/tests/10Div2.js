var tests = require('./testsCommon');
var constants = require('./crunchConstants');

var data = tests.GetCrunchData('/home/codio/workspace/public/10Div2.crunch');
if (data && tests.CountNumInstructionsOfType(data, constants.INSTRUCTION_TYPE_DIV) > 0) {
  console.log('You are not allowed to use any DIV instructions for this test.');
  process.exit(1);
}

var res = tests.SimpleOutputTest('/home/codio/workspace/public/10Div2.crunch', 
  [{name: 'X', min: 0, max: 1000}, {name: 'Y', min: 1, max: 50}],
  function(inp, vars) {
    return [Math.floor(vars[0].value / vars[1].value)]
  }
);
tests.FlushOutput();

process.exit(!res);
