var crunchConstants = require('./crunchConstants');

/******************
 * Source helpers *
 ******************/

exports.GetNumberOfNonExecutableLines = function(sourceLines) {
  var numNonExecutableLines = 0;
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type !== crunchConstants.LINE_TYPE_INSTRUCTION
      || sourceLine.instruction === crunchConstants.INSTRUCTION_TYPE_DAT) {
      numNonExecutableLines++;
    }
  }
  return numNonExecutableLines;
};

exports.DoesSourceHaveInstructions = function(sourceLines) {
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type === crunchConstants.LINE_TYPE_INSTRUCTION
      && sourceLine.instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      return true;
    }
  }
  return false;
};

exports.GetLabelsFromSource = function(sourceLines, lineNumber) {
  var labels = [];
  var instructionAddress = sourceLines.length - exports.GetNumberOfNonExecutableLines(sourceLines);
  for (var i = sourceLines.length - 1; i >= 0; --i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type === crunchConstants.LINE_TYPE_INSTRUCTION
      && sourceLine.instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      instructionAddress--;
    } else if (sourceLine.type === crunchConstants.LINE_TYPE_LABEL && i !== lineNumber) {
      labels.push({name: sourceLine.value, value: instructionAddress});
    }
  }
  return labels;
};

exports.GetVariablesFromSource = function(sourceLines, lineNumber) {
  var lines = [];
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.instruction === crunchConstants.INSTRUCTION_TYPE_DAT && i !== lineNumber) {
      lines.push({name: sourceLine.name, value: sourceLine.value});
    }
  }
  return lines;
};

exports.GetLineNumberFromLabel = function(sourceLines, labelName) {
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type === crunchConstants.LINE_TYPE_LABEL && sourceLine.value === labelName) {
      return i;
    }
  }
  
  return null;
};

exports.GetValueForName = function(nameValuePairs, name) {
  for (var i = 0; i < nameValuePairs.length; ++i) {
    var nameValuePair = nameValuePairs[i];
    if (nameValuePair.name === name) {
      return {index: i, value: nameValuePair.value};
    }
  }
  
  return null;
};

exports.GetFirstDatLineNumber = function(sourceLines) {
  for (var i = sourceLines.length - 1; i >= 0; i--) {
    if (sourceLines[i].instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      return i + 1;
    }
  }
  
  return 0;
};

/**********************
 * Validation helpers *
 **********************/

exports.ValidateIntegerBounds = function(value) {
  return value >= crunchConstants.MIN_INT_VALUE && value <= crunchConstants.MAX_INT_VALUE;
};

exports.ValidateUniqueName = function(uniqueName, nameList) {
  if (typeof uniqueName !== 'string' || uniqueName === '') {
    return false;
  }
  
  for (var i = 0; i < nameList.length; ++i) {
    if (nameList[i].name === uniqueName) {
      return false;
    }
  }
  return true;
};

exports.ValidateAlphanumericName = function(name) {
  return name.match(crunchConstants.ALPHANUMERIC_REGEX) != null;
};

exports.IsParameterInSource = function(sourceLines, parameter) {
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type === crunchConstants.LINE_TYPE_INSTRUCTION
    && sourceLine.value === parameter
    && sourceLine.instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      return true;
    }
  }
  return false;
};

exports.GetParameterInSource = function(sourceLines, parameter) {
  var lineNumbers = [];
  for (var i = 0; i < sourceLines.length; ++i) {
    var sourceLine = sourceLines[i];
    if (sourceLine.type === crunchConstants.LINE_TYPE_INSTRUCTION
    && sourceLine.value === parameter
    && sourceLine.instruction !== crunchConstants.INSTRUCTION_TYPE_DAT) {
      lineNumbers.push(i);
    }
  }
  return lineNumbers;
};

/*************************************
 * Variable and label naming helpers *
 *************************************/

exports.GetNextUniqueName = function(defaultName, uniqueCounter, uniqueNames) {
  var uniqueName = '';
  
  do {
    uniqueName = defaultName + uniqueCounter;
    uniqueCounter++;
  } while (!exports.ValidateUniqueName(uniqueName, uniqueNames));
  
  return uniqueName;
};

exports.GetNextUniqueLabelName = function(labels) {
  return exports.GetNextUniqueName(crunchConstants.DEFAULT_LABEL_NAME,
    crunchConstants.UNIQUE_LABEL_COUNTER, labels);
};

exports.GetNextUniqueVariableName = function(variables) {
  return exports.GetNextUniqueName(crunchConstants.DEFAULT_VARIABLE_NAME,
    crunchConstants.UNIQUE_VARIABLE_COUNTER, variables);
};

/****************************
 * Instruction data helpers *
 ****************************/

exports.GetInstructionName = function(instructionType) {
  if (instructionType > crunchConstants.INSTRUCTION_DATA.length) {
    console.log('GetInstructionData - unhandled instructionType ' + instructionType);
    return 'INV';
  }
  return crunchConstants.INSTRUCTION_DATA[instructionType].name;
};

exports.GetInstructionType = function(instructionName) {
  var instructionType = -1;
  for (var i = 0; i < crunchConstants.INSTRUCTION_DATA.length; ++i) {
    if (instructionName === crunchConstants.INSTRUCTION_DATA[i].name) {
      instructionType = crunchConstants.INSTRUCTION_DATA[i].id;
    }
  }
  if (instructionType === -1) {
    console.log('GetInstructionType - there is no instruction named ' + instructionName);
    instructionType = -1;
  }
  return instructionType;
};

exports.GetInstructionDetailedDescription = function(instructionType, parameterType) {
  if (exports.GetInputTypeFromInstruction(instructionType) === crunchConstants.INPUT_TYPE_VARIABLE_NUMBER) {
    if (parameterType === 'string') {
      return crunchConstants.INSTRUCTION_DATA[instructionType].detailedDescriptions[0];
    }
    return crunchConstants.INSTRUCTION_DATA[instructionType].detailedDescriptions[1];
  }
  return crunchConstants.INSTRUCTION_DATA[instructionType].desc;
};

exports.GetInstructionDisplayedId = function(instructionType, parameterType) {
  var displayedId = crunchConstants.INSTRUCTION_DATA[instructionType].displayedId;
  if (exports.GetInputTypeFromInstruction(instructionType) === crunchConstants.INPUT_TYPE_VARIABLE_NUMBER
    && parameterType === 'number') {
    displayedId++;
  }
  if (displayedId < 10) {
    return '0' + displayedId;
  }
  return displayedId.toString();
};

exports.GetInputTypeFromInstruction = function(instructionType) {
  switch(instructionType) {
    case crunchConstants.INSTRUCTION_TYPE_LDA:
    case crunchConstants.INSTRUCTION_TYPE_ADD:
    case crunchConstants.INSTRUCTION_TYPE_SUB:
    case crunchConstants.INSTRUCTION_TYPE_CMP: {
      return crunchConstants.INPUT_TYPE_VARIABLE_NUMBER;
    } case crunchConstants.INSTRUCTION_TYPE_STA:
    case crunchConstants.INSTRUCTION_TYPE_MUL:
    case crunchConstants.INSTRUCTION_TYPE_DIV: {
      return crunchConstants.INPUT_TYPE_VARIABLE;
    } case crunchConstants.INSTRUCTION_TYPE_BGT:
    case crunchConstants.INSTRUCTION_TYPE_BGE:
    case crunchConstants.INSTRUCTION_TYPE_BLT:
    case crunchConstants.INSTRUCTION_TYPE_BLE:
    case crunchConstants.INSTRUCTION_TYPE_BEQ:
    case crunchConstants.INSTRUCTION_TYPE_BNE:
    case crunchConstants.INSTRUCTION_TYPE_JMP: {
      return crunchConstants.INPUT_TYPE_LABEL;
    } case crunchConstants.INSTRUCTION_TYPE_DAT: {
      return crunchConstants.INPUT_TYPE_STRING_NUMBER;
    } case crunchConstants.INSTRUCTION_TYPE_OUT: {
      return crunchConstants.INPUT_TYPE_STRING;
    } case crunchConstants.INSTRUCTION_TYPE_INP:
    case crunchConstants.INSTRUCTION_TYPE_INC:
    case crunchConstants.INSTRUCTION_TYPE_DEC:
    case crunchConstants.INSTRUCTION_TYPE_END:
    case crunchConstants.INSTRUCTION_TYPE_PSH:
    case crunchConstants.INSTRUCTION_TYPE_POP: {
      return crunchConstants.INPUT_TYPE_NONE;
    } default: {
      console.log('GetInputTypeFromInstruction - unhandled instructionType ' + instructionType);
      return crunchConstants.INPUT_TYPE_NONE;
    }
  }
};
