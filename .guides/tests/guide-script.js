function t_print0ToN(data) {
  TESTS.SimpleOutputTest(data, [{min: 0, max: 20}], function(inp, vars) {
    var expected = [0];
    for (var i = 1; i <= inp[0]; ++i) {
      expected.push(i);
    }
    return expected;
  });
}

function t_printNTo0(data) {
  TESTS.SimpleOutputTest(data, [{min: 0, max: 20}], function(inp, vars) {
    var expected = [0];
    for (var i = 1; i <= inp[0]; ++i) {
      expected.unshift(i);
    }
    return expected;
  });
}

function t_timesTable(data) {
  TESTS.SimpleOutputTest(data, [{min: 0, max: 16}], function(inp, vars) {
    var expected = [];
    if (inp[0] <= 12) {
      for (var i = 1; i <= 12; ++i) {
        expected.push(i * inp[0]);
      }
    } else {
      expected.push(99);
    }
    return expected;
  });
}

function t_x2(data) {
  if (TESTS.CountNumInstructionsOfType(CRUNCH.INSTRUCTION_TYPE_OUT) > 2) {
    TESTS.ShowFail('You are not allowed to use more than one OUT for this test.');
    return;
  }
  TESTS.SimpleOutputTest(data, [], function(inp, vars) {
    return [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
  });
}

function t_10div2(data) {
  if (TESTS.CountNumInstructionsOfType(CRUNCH.INSTRUCTION_TYPE_DIV) > 1) {
    TESTS.ShowFail('You are not allowed to use any DIV instructructions for this test.');
    return;
  }
  var inp1 = TESTS.GetRandomIntegerArray(1, 1000)[0];
  var inp2 = TESTS.GetRandomIntegerArray(1, 50)[0];
  var variables = [{name: 'X', value: inp1}, {name: 'Y', value: inp2}];
  TESTS.SimpleOutputTest(data, [{name: 'X', min: 0, max: 1000}, {name: 'Y', min: 1, max: 50}],
    function(inp, vars) {
      return [Math.floor(vars[0].value / vars[1].value)]
    }
  );
}

TESTS.SetupButtonTest();

