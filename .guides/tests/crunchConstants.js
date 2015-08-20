exports.START_ADDRESS_INSTRUCTIONS = 1000;
exports.START_ADDRESS_VARIABLES = 2000;

exports.MAX_INT_VALUE = 999999999;
exports.MIN_INT_VALUE = -999999999;

exports.MAX_COMMENT_LENGTH = 70;
exports.MAX_LABEL_LENGTH = 20;
exports.MAX_VARIABLE_NAME_LENGTH = 25;

exports.MAX_SOURCE_LINES = 1000;
exports.MAX_VARIABLES = 500;
exports.MAX_LABELS = 500;

exports.MAX_UNDO_OPS = 100;

exports.ALPHANUMERIC_REGEX = /(^$)|(^[a-z_][a-z0-9_]*$)/i;

exports.DEFAULT_LABEL_NAME = 'labelName';
exports.UNIQUE_LABEL_COUNTER = 0;
exports.DEFAULT_VARIABLE_NAME = 'variableName';
exports.UNIQUE_VARIABLE_COUNTER = 0;

exports.LINE_TYPE_INSTRUCTION = 0;
exports.LINE_TYPE_COMMENT = 1;
exports.LINE_TYPE_LABEL = 2;

exports.INSTRUCTION_TYPE_LDA = 0;
exports.INSTRUCTION_TYPE_STA = 1;
exports.INSTRUCTION_TYPE_INP = 2;
exports.INSTRUCTION_TYPE_OUT = 3;
exports.INSTRUCTION_TYPE_ADD = 4;
exports.INSTRUCTION_TYPE_SUB = 5;
exports.INSTRUCTION_TYPE_MUL = 6;
exports.INSTRUCTION_TYPE_DIV = 7;
exports.INSTRUCTION_TYPE_INC = 8;
exports.INSTRUCTION_TYPE_DEC = 9;
exports.INSTRUCTION_TYPE_CMP = 10;
exports.INSTRUCTION_TYPE_BGT = 11;
exports.INSTRUCTION_TYPE_BGE = 12;
exports.INSTRUCTION_TYPE_BLT = 13;
exports.INSTRUCTION_TYPE_BLE = 14;
exports.INSTRUCTION_TYPE_BEQ = 15;
exports.INSTRUCTION_TYPE_BNE = 16;
exports.INSTRUCTION_TYPE_JMP = 17;
exports.INSTRUCTION_TYPE_END = 18;
exports.INSTRUCTION_TYPE_PSH = 19;
exports.INSTRUCTION_TYPE_POP = 20;
exports.INSTRUCTION_TYPE_DAT = 21;
exports.INSTRUCTION_TYPE_COUNT = 22;

exports.INSTRUCTION_DATA = [{
    id: 0, displayedId: 1, name: 'LDA',
    desc: 'Load an address or value into the accumulator',
    detailedDescriptions: [
      'Load an address into the accumulator',
      'Load a value into the accumulator'
    ]
  }, {
    id: 1, displayedId: 10, name: 'STA',
    desc: 'Store accumulator to address'
  }, {
    id: 2, displayedId: 20, name: 'INP',
    desc: 'Input value to the accumulator'
  }, {
    id: 3, displayedId: 21, name: 'OUT',
    desc: 'Output accumulator to screen'
  }, {
    id: 4, displayedId: 30, name: 'ADD',
    desc: 'Add an address or value to the accumulator',
    detailedDescriptions: [
      'Add an address to the accumulator',
      'Add a value to the accumulator'
    ]
  }, {
    id: 5, displayedId: 32, name: 'SUB',
    desc: 'Subtract an address or value from the accumulator',
    detailedDescriptions: [
      'Subtract an address from the accumulator',
      'Subtract a value from the accumulator'
    ]
  }, {
    id: 6, displayedId: 34, name: 'MUL',
    desc: 'Multiply address with accumulator'
  }, {
    id: 7, displayedId: 35, name: 'DIV',
    desc: 'Divide accumulator by address'
  }, {
    id: 8, displayedId: 36, name: 'INC',
    desc: 'Increment accumulator'
  }, {
    id: 9, displayedId: 37, name: 'DEC',
    desc: 'Decrement accumulator'
  }, {
    id: 10, displayedId: 40, name: 'CMP',
    desc: 'Compare accumulator with the given value and set flag registers accordingly',
    detailedDescriptions: [
      'Compare accumulator with the value at the address and set flag registers accordingly',
      'Compare accumulator with the value and set flag registers accordingly'
    ]
  }, {
    id: 11, displayedId: 42, name: 'BGT',
    desc: 'Branch to <label> if CMP > flag register is set'
  }, {
    id: 12, displayedId: 43, name: 'BGE',
    desc: 'Branch to <label> if CMP >= flag register is set'
  }, {
    id: 13, displayedId: 44, name: 'BLT',
    desc: 'Branch to <label> if CMP < flag register is set'
  }, {
    id: 14, displayedId: 45, name: 'BLE',
    desc: 'Branch to <label> if CMP <= flag register is set'
  }, {
    id: 15, displayedId: 46, name: 'BEQ',
    desc: 'Branch to <label> if CMP = flag register is set'
  }, {
    id: 16, displayedId: 47, name: 'BNE',
    desc: 'Branch to <label> if CMP != flag register is set'
  }, {
    id: 17, displayedId: 48, name: 'JMP',
    desc: 'Jump to <label>'
  }, {
    id: 18, displayedId: 60, name: 'END',
    desc: 'Stop execution'
  }, {
    id: 19, displayedId: 70, name: 'PSH',
    desc: 'Push accumulator onto the stack'
  }, {
    id: 20, displayedId: 71, name: 'POP',
    desc: 'Pop value off the stack into the accumulator'
  }, {
    id: 21, displayedId: 80, name: 'DAT',
    desc: 'Declare a new variable'
  }
];

exports.INPUT_TYPE_VARIABLE = 0;
exports.INPUT_TYPE_STRING = 1;
exports.INPUT_TYPE_LABEL = 2;
exports.INPUT_TYPE_VARIABLE_NUMBER = 3;
exports.INPUT_TYPE_STRING_NUMBER = 4;
exports.INPUT_TYPE_NONE = 5;

exports.DROPDOWN_MAX_LINES = 8;

exports.SHOW_ICONS_THRESHOLD_WIDTH = 550;
exports.UI_SCALE_WINDOW_WIDTH_THRESHOLD = 590;

exports.MIN_FONT_SIZE = 50.5;
exports.FONT_CHANGE_INCREMENT = 3;

exports.MOUSE_DRAG_DISTANCE_THRESHOLD = 5;

exports.LIGHT_UI_COLOR = 'white';
exports.DARK_UI_COLOR = '#373737';
exports.REFERENCED_UI_COLOR = 'crimson';

exports.FONT_PREFERENCE_KEY = 'crunchFont';
exports.UI_COLOR_PREFERENCE_KEY = 'crunchColor';
