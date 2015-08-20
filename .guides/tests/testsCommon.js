var fs = require('fs');

var crunchExecution = require('./crunchExecution');

exports.RUN_CRUNCH_STOP_THRESHOLD = 10000;

exports.ERROR_MESSAGE_NO_FILE = 'Unable to get crunch file: ';
exports.ERROR_MESSAGE_NO_VARS = 'Unable to set the required DAT variables. Have you added them?';
exports.ERROR_MESSAGE_TOO_MANY_INP = 'There are more input statements in your code than expected.';
exports.ERROR_MESSAGE_TOO_FEW_INP = 'There are not as many input statements in your code as we expected.';
exports.ERROR_MESSAGE_PROGRAM_ERROR = 'An error occurred during the execution of your program.';
exports.ERROR_MESSAGE_TOO_LONG = 'Your program took too long to execute.';

var Output = null;

exports.SimpleOutputTest = function(fileName, inputParams, checkResult) {
  Output = [];
  
  var crunchData = exports.GetCrunchData(fileName);
  if (!crunchData) {
    return false;
  }

  for (var i = 0; i < 10; ++i) {
    var inputValues = [];
    var inputVariables = [];
    for (var j = 0; j < inputParams.length; ++j) {
      var inputParam = inputParams[j];
      var input = GetRandomInteger(inputParam.min, inputParam.max);
      if (inputParam.name) {
        inputVariables.push({name: inputParam.name, value: input});
      } else {
        inputValues.push(input);
      }
    }
    if (!RunAndCheckOutput(crunchData, inputValues, inputVariables, checkResult)) {
      return false;
    }
  }
  
  OutputSuccess();
  return true;
};

exports.SimpleOutputTestWithInputRange = function(fileName, inputRange, checkResult) {
  Output = [];

  var crunchData = exports.GetCrunchData(fileName);
  if (!crunchData) {
    return false;
  }

  for (var i = 0; i <= inputRange.max - inputRange.min; ++i) {
    if (inputRange.name) {
      if (!RunAndCheckOutput(crunchData,
        [], [{name: inputRange.name, value: inputRange.min + i}],
        checkResult)) {
        return false;
      }
    } else if (inputRange.num) {
      var inputs = [];
      for (var j = 0; j < inputRange.num; ++j) {
        inputs.push(inputRange.min + i);
      }
      if (!RunAndCheckOutput(crunchData, inputs, [], checkResult)) {
        return false;
      }
    } else if (!RunAndCheckOutput(crunchData, [inputRange.min + i], [], checkResult)) {
      return false;
    }
  }
  
  OutputSuccess();
  return true;
};

exports.GetCrunchData = function(fileName) {
  var data = null;
  try {
    data = fs.readFileSync(fileName, 'utf8');
  } catch (e) {
    BufferOutput(exports.ERROR_MESSAGE_NO_FILE + e);
  }
  return data;
};

var RunAndCheckOutput = function(crunchData, inp, vars, checkResult) {
  var succeeded = true;
  
  var res = RunCrunch(JSON.parse(crunchData).sourceLines, inp, vars, function(numInstructions) {
      if (numInstructions > exports.RUN_CRUNCH_STOP_THRESHOLD) {
        succeeded = false;
        return true;
      }
      return false;
    }
  );
  
  var expectedResults = checkResult(inp, vars);
  var numResults = expectedResults.num || 1;
  expectedResults = Array.isArray(expectedResults) ? [expectedResults] : expectedResults.values;
  var numFailures = 0;
  for (var i = 0; i < numResults; ++i) {
    var expectedResult = expectedResults[i];
    for (var j = 0; j < expectedResult.length; ++j) {
      if (!res.outputLines[j] || expectedResult[j] !== res.outputLines[j].acc) {
        numFailures++;
        break;
      }
    }
  }
  if (numFailures === numResults || !succeeded) {
    OutputFailWithExplanation(inp, vars, res.outputLines, expectedResult);
    CheckExitCode(res.exitCode);
    succeeded = false;
  }
  
  return succeeded;
};

var RunCrunch = function(sourceLines, inputs, variables, shouldStop) {
  var exitCode = 0;
  
  var currentState = crunchExecution.CreateExecutionState(sourceLines);
  var currentVariables = currentState.currentVariables;
  for (var i = 0; i < variables.length; ++i) {
    var foundVariable = false;
    for (var j = 0; j < currentVariables.length; ++j) {
      if (currentVariables[j].name === variables[i].name) {
        currentVariables[j].value = variables[i].value;
        foundVariable = true;
        break;
      }
    }
    if (!foundVariable) {
      // Couldn't set all variables given
      exitCode = 1;
      break;
    }
  }
  
  var currentInputInstruction = 0;
  var processInputInstruction = function() {
    if (currentInputInstruction < inputs.length) {
      currentState.currentAccumulator = inputs[currentInputInstruction];
      currentInputInstruction++;
    } else {
      // Expected more inputs than number of inputs given
      exitCode = 2;
    }
  }
  
  var numInstructionsProcessed = 0;
  while (currentState.finishedExecution === 0) {
    if (exitCode !== 0) {
      break;
    }
    if (shouldStop(numInstructionsProcessed)) {
      exitCode = 5;
      break;
    } else {
      numInstructionsProcessed++;
      crunchExecution.ProcessNextInstruction(currentState, sourceLines, processInputInstruction);
    }
  }
  
  if (exitCode === 0 && currentInputInstruction < inputs.length) {
    // Didn't use all inputs given
    exitCode = 3;
  }
  
  if (currentState.finishedExecution > 1) {
    // Error occurred in the program
    exitCode = 4;
  }
  
  currentState.exitCode = exitCode;

  return currentState;
};

var CheckExitCode = function(exitCode) {
  switch (exitCode) {
    case 0:
      return true;
    case 1:
      BufferOutput(exports.ERROR_MESSAGE_NO_VARS);
      break;
    case 2:
      BufferOutput(exports.ERROR_MESSAGE_TOO_MANY_INP);
      break;
    case 3:
      BufferOutput(exports.ERROR_MESSAGE_TOO_FEW_INP);
      break;
    case 4:
      BufferOutput(exports.ERROR_MESSAGE_PROGRAM_ERROR);
      break;
    case 5:
      BufferOutput(exports.ERROR_MESSAGE_TOO_LONG);
      break;
  }
  return false;
};

exports.CountNumInstructionsOfType = function(data, type) {
  return data.split('instruction\"\:' + type).length - 1;
};

var GetRandomInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var OutputSuccess = function(msg) {
  BufferOutput('Well done!!');
};

var BufferOutput = function(msg) {
  Output.push(msg);
};

exports.FlushOutput = function(index) {
  index = index || Output.length;
  for (var i = 0; i < index; ++i) {
    console.log(Output.pop());
  }
};

var OutputFailWithExplanation = function(inputs, variables, result, expected) {
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
  output += 'Your code output';
  if (!result.length) {
    output += ' nothing';
  }
  for (var i = 0; i < result.length; ++i) {
    output += ' ' + result[i].acc;
  }
  output += ' instead of ' + expected[0];
  for (var i = 1; i < expected.length; ++i) {
    output += ' ' + expected[i];
  }
  output += '.';
  
  BufferOutput(output);
};
