var tests = null;

function t_print0ToN(data) {
  tests.SimpleOutputTestWithInputRange(data, {min: 0, max: 20}, function(inp, vars) {
    var expected = [0];
    for (var i = 1; i <= inp[0]; ++i) {
      expected.push(i);
    }
    return expected;
  });
}

function t_printNTo0(data) {
  tests.SimpleOutputTestWithInputRange(data, {min: 0, max: 20}, function(inp, vars) {
    var expected = [0];
    for (var i = 1; i <= inp[0]; ++i) {
      expected.unshift(i);
    }
    return expected;
  });
}

function t_timesTable(data) {
  tests.SimpleOutputTestWithInputRange(data, {min: 1, max: 16}, function(inp, vars) {
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
  if (tests.CountNumInstructionsOfType(data, CRUNCH.INSTRUCTION_TYPE_OUT) > 1) {
    tests.ShowFail('You are not allowed to use more than one OUT for this test.');
    return;
  }
  tests.SimpleOutputTest(data, [], function(inp, vars) {
    return [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
  });
}

function t_10Div2(data) {
  if (tests.CountNumInstructionsOfType(data, CRUNCH.INSTRUCTION_TYPE_DIV) > 0) {
    tests.ShowFail('You are not allowed to use any DIV instructructions for this test.');
    return;
  }
  tests.SimpleOutputTest(data, [{name: 'X', min: 0, max: 1000}, {name: 'Y', min: 1, max: 50}],
    function(inp, vars) {
      return [Math.floor(vars[0].value / vars[1].value)]
    }
  );
}

function t_xPowerY(data) {
  tests.SimpleOutputTestWithInputRange(data, {num: 2, min: -1, max: 10}, function(inp, vars) {
    if (inp[0] < 0 || inp[1] < 0) {
      return [-1];
    }
    return [Math.pow(inp[0], inp[1])];
  });
}

function t_fibonacci(data) {
  var fibonacci = function(iterations, output, val1, val2) {
    if (iterations > 0) {
      output.push(fibonacci(iterations - 1, output, val2, val1 + val2));
    }
    return val1;
  }
  
  tests.SimpleOutputTestWithInputRange(data, {min: 0, max: 20}, function(inp, vars) {
    var expected1 = [];
    fibonacci(inp[0], expected1, 0, 1);
    var expected2 = expected1.slice();
    expected1.push(0);
    expected1.reverse();
    return {num: 2, values: [expected1, expected2]};
  });
}

function t_nFactorial(data) {
  tests.SimpleOutputTestWithInputRange(data, {min: 0, max: 12}, function(inp, vars) {
    var expected = 1;
    for (var i = 1; i <= inp[0]; ++i) {
      expected *= i;
    }
    return [expected];
  });
}

function waitForCrunchScript() {
  if (!window.TESTS_COMMON) {
    setTimeout(waitForCrunchScript, 100);
    return;
  }
  tests = window.TESTS_COMMON;
  tests.SetupButtonTest();
}

waitForCrunchScript();

