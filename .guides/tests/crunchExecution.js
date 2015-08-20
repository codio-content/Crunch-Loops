var crunchConstants = require('./crunchConstants');
var crunchDataHelpers = require('./crunchDataHelpers');

exports.FindNextExecutableLineNumber = function(currentState, sourceLines) {
  var nextLineNumber = currentState.currentLineNumber;
  var nextInstruction = null;
  while (true) {
    nextLineNumber++;
    if (nextLineNumber >= sourceLines.length) {
      currentState.finishedExecution = 1;
      return;
    }
    
    nextInstruction = sourceLines[nextLineNumber];
    if (nextInstruction.type === crunchConstants.LINE_TYPE_INSTRUCTION
      && nextInstruction.instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      currentState.currentLineNumber = nextLineNumber;
      return;
    }
  }
};

exports.CreateExecutionState = function(sourceLines) {
  var newState = {};
  newState.isEditing = false;
  newState.finishedExecution = 0;
  newState.currentLineNumber = 0;
  newState.currentVariables = crunchDataHelpers.GetVariablesFromSource(sourceLines);
  newState.currentStack = [];
  newState.currentAccumulator = 0;
  newState.currentFlags = [false, false, false, false, false, false];
  newState.outputLines = [];
  
  var firstLine = sourceLines[0];
  if (firstLine.type !== crunchConstants.LINE_TYPE_INSTRUCTION
    || firstLine.instruction === crunchConstants.INSTRUCTION_TYPE_DAT) {
    exports.FindNextExecutableLineNumber(newState, sourceLines);
  }
  
  return newState;
};

exports.CopyExecutionState = function(newState, oldState) {
  newState.finishedExecution = oldState.finishedExecution;
  newState.currentLineNumber = oldState.currentLineNumber;
  newState.currentVariables = oldState.currentVariables.slice();
  newState.currentStack = oldState.currentStack.slice();
  newState.currentAccumulator = oldState.currentAccumulator;
  newState.currentFlags = oldState.currentFlags.slice();
  newState.outputLines = oldState.outputLines.slice();
};

exports.ProcessNextInstruction = function(currentState, sourceLines, inputHandler, errorHandler) {
  var nextInstruction = sourceLines[currentState.currentLineNumber];
  var parameterType = crunchDataHelpers.GetInputTypeFromInstruction(nextInstruction.instruction);
  var parameterValue = {value: nextInstruction.value};
  switch (parameterType) {
    case crunchConstants.INPUT_TYPE_VARIABLE_NUMBER:
    case crunchConstants.INPUT_TYPE_VARIABLE: {
      if (typeof parameterValue.value === 'string') {
        parameterValue = crunchDataHelpers.GetValueForName(currentState.currentVariables, parameterValue.value);
      }
      break;
    } case crunchConstants.INPUT_TYPE_LABEL: {
      parameterValue = crunchDataHelpers.GetLineNumberFromLabel(sourceLines, parameterValue.value);
      break;
    }
  }
  
  switch (nextInstruction.instruction) {
    case crunchConstants.INSTRUCTION_TYPE_LDA: {
      currentState.currentAccumulator = parameterValue.value;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_STA: {
      currentState.currentVariables[parameterValue.index].value = currentState.currentAccumulator;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_INP: {
      inputHandler(currentState);
      break;
    } case crunchConstants.INSTRUCTION_TYPE_OUT: {
      currentState.outputLines.push({msg: parameterValue.value, acc: currentState.currentAccumulator});
      break;
    } case crunchConstants.INSTRUCTION_TYPE_ADD: {
      currentState.currentAccumulator += parameterValue.value;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_SUB: {
      currentState.currentAccumulator -= parameterValue.value;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_MUL: {
      currentState.currentAccumulator *= parameterValue.value;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_DIV: {
      if (parameterValue.value === 0) {
        currentState.finishedExecution = 2;
        currentState.currentLineNumber = -1;
        if (errorHandler) {
          errorHandler('Error: division by zero!');
        }
      } else {
        currentState.currentAccumulator = Math.floor(currentState.currentAccumulator / parameterValue.value);
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_INC: {
      currentState.currentAccumulator++;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_DEC: {
      currentState.currentAccumulator--;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_CMP: {
      var acc = currentState.currentAccumulator;
      var val = parameterValue.value;
      if (acc < val) {
        currentState.currentFlags = [false, true, true, true, false, false];
      } else if (acc == val) {
        currentState.currentFlags = [true, false, false, true, false, true];
      } else {
        currentState.currentFlags = [false, true, false, false, true, true];
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BGT: {
      if (currentState.currentFlags[4]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BGE: {
      if (currentState.currentFlags[5]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BLT: {
      if (currentState.currentFlags[2]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BLE: {
      if (currentState.currentFlags[3]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BEQ: {
      if (currentState.currentFlags[0]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_BNE: {
      if (currentState.currentFlags[1]) {
        currentState.currentLineNumber = parameterValue;
      }
      break;
    } case crunchConstants.INSTRUCTION_TYPE_JMP: {
      currentState.currentLineNumber = parameterValue;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_END: {
      currentState.finishedExecution = 1;
      break;
    } case crunchConstants.INSTRUCTION_TYPE_PSH: {
      currentState.currentStack.push(currentState.currentAccumulator);
      break;
    } case crunchConstants.INSTRUCTION_TYPE_POP: {
      currentState.currentStack.pop();
      break;
    }
  }
  
  if (currentState.finishedExecution !== 1) {
    exports.FindNextExecutableLineNumber(currentState, sourceLines);
  }
};
