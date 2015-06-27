var TESTS = {
  RESULT_BUTTON_ID: null,
  
  SimpleOutputTest: function(crunchData, inp, vars, expected) {
    RunCrunch(JSON.parse(crunchData).sourceLines, inp, vars, function(res) {
      var numOutputs = expected.length;
      var expectedNumOutputs = res.outputLines.length;
      if (TESTS.CheckExitCode(res.exitCode) && TESTS.CheckOutput(expectedNumOutputs, numOutputs)) {
        for (var i = 0; i < expectedNumOutputs; ++i) {
          if (res.outputLines[i].acc !== expected[i]) {
            TESTS.ShowFailWithExplanation(inp, vars, res.outputLines, expected);
            return;
          }
        }
        TESTS.ShowSuccess();
      }
    });
  },
  
  CheckExitCode: function(exitCode) {
    switch (exitCode) {
      case 0:
        return true;
      case 1:
        TESTS.ShowFail('Unable to set the required DAT variables. Have you added them?');
        break;
      case 2:
        TESTS.ShowFail('There are more input statements in your code than expected.');
        break;
      case 3:
        TESTS.ShowFail('There are not as many input statements in your code as we expected.');
        break;
      case 4:
        TESTS.ShowFail('An error occurred during the execution of your program.');
        break;
    }
    return false;
  },
  
  CheckOutput: function(expectedNumOutputs, numOutputs) {
    if (expectedNumOutputs < numOutputs) {
      TESTS.ShowFail('Less outputs were detected than expected.');
    } else if (expectedNumOutputs > numOutputs) {
      TESTS.ShowFail('More outputs were detected than expected.');
    } else {
      return true;
    }
    return false;
  },
  
  GetRandomIntegerArray: function(length, max, min) {
    var result = [];
    if (!max) {
      max = 100;
    }
    if (!min) {
      min = 0;
    }
    for (var i = 0; i < length; ++i) {
      result.push(Math.floor(Math.random() * (max - min) + min));
    }
    return result;
  },
  
  ShowSuccess(msg) {
    codio.setButtonValue(TESTS.RESULT_BUTTON_ID, codio.BUTTON_STATE.SUCCESS, msg || 'Well done!!');
  },
  ShowFail(msg) {
    codio.setButtonValue(TESTS.RESULT_BUTTON_ID, codio.BUTTON_STATE.FAILURE, msg);
  },
  ShowFailWithExplanation(inputs, variables, result, expected) {
    var output = '';
    if (inputs.length) {
      output += 'We input ' + inputs[0];
      for (var i = 1; i < inputs.length; ++i) {
        output += ' and ' + inputs[i];
      }
      output += '.  ';
    }
    if (variables.length) {
      output += 'We set variable ' + variables[0].name + ' to ' + variables[0].value;
      for (var i = 1; i < variables.length; ++i) {
        output += ' and variable ' + variables[i].name + ' to ' + variables[i].value;
      }
      output += '.  ';
    }
    output += 'Your code output ' + result[0].acc;
    for (var i = 1; i < result.length; ++i) {
      output += ' ' + result[i].acc;
    }
    output += ' instead of ' + expected[0];
    for (var i = 1; i < expected.length; ++i) {
      output += ' ' + expected[i];
    }
    output += '.';
    
    codio.setButtonValue(TESTS.RESULT_BUTTON_ID, codio.BUTTON_STATE.FAILURE, output);
  },
  ShowSysError(msg) {
    codio.setButtonValue(TESTS.RESULT_BUTTON_ID, codio.BUTTON_STATE.INVALID, msg);
  },
  ShowProgress(msg) {
    codio.setButtonValue(TESTS.RESULT_BUTTON_ID, codio.BUTTON_STATE.PROGRESS, msg || 'Checking...');
  }
};
