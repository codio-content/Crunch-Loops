function t_print0ToN(data) {
  var inp = TESTS.GetRandomIntegerArray(1, 20);
  var expected = [0];
  for (var i = 1; i <= inp[0]; ++i) {
    expected.push(i);
  }
  TESTS.SimpleOutputTest(data, inp, [], expected);
}

function t_printNTo0(data) {
  var inp = TESTS.GetRandomIntegerArray(1, 20);
  var expected = [0];
  for (var i = 1; i <= inp[0]; ++i) {
    expected.unshift(i);
  }
  TESTS.SimpleOutputTest(data, inp, [], expected);
}

function t_timesTable(data) {
  var inp = TESTS.GetRandomIntegerArray(1, 16)[0];
  var expected = [];
  if (inp <= 12) {
    for (var i = 1; i <= 12; ++i) {
      expected.push(i * inp);
    }
  } else {
    expected.push(99);
  }
  TESTS.SimpleOutputTest(data, [inp], [], expected);
}

function t_x2(data) {
  if (data.split('instruction: 3').length > 2) {
    TESTS.ShowFail('You are not allowed to use more than one OUT for this test');
    return;
  }
  TESTS.SimpleOutputTest(data, [], [], [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);
}

function t_10div2(data) { // TODO check there are no DIV instructions
  var inp1 = TESTS.GetRandomIntegerArray(1, 1000)[0];
  var inp2 = TESTS.GetRandomIntegerArray(1, 50)[0];
  var variables = [{name: 'X', value: inp1}, {name: 'Y', value: inp2}];
  TESTS.SimpleOutputTest(data, [], variables, [Math.floor(inp1 / inp2)]);
}

TESTS.SetupButtonTest();

