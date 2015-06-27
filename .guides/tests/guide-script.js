window.addEventListener('codio-button-custom', function (ev) {
  if (codio) {
    TESTS.RESULT_BUTTON_ID = ev.id;
    
    TESTS.ShowProgress();
    
    $.get(window.location.origin + ':9500/get-crunch-file', {'file': ev.cmd}, function(data, error) {
      // 404 Error
      if (data === '404') {
        TESTS.ShowSysError('Unable to reach server. Please contact support@codio.com.');
        return;
      }
      
      // Select test
      switch (ev.cmd) {
        case 'io.crunch':
          t_io(data);
          break;
        case 'add100.crunch':
          t_add100(data);
          break;
        case 'x-times-y.crunch':
          t_xTimesY(data);
          break;
        case 'abc.crunch':
          t_abc(data);
          break;
        case 'branch-1.crunch':
          t_branch1(data);
          break;
        case 'branch-2.crunch':
          t_branch2(data);
          break;
        case 'branch-3.crunch':
          t_branch3(data);
          break;
        case 'print-0-to-N.crunch':
          t_print0ToN(data);
          break;
        case 'print-N-to-0.crunch':
          t_printNTo0(data);
          break;
        case 'times-table.crunch':
          t_timesTable(data);
          break;
        case 'x2.crunch':
          t_x2(data);
          break;
        case '10-div-2.crunch':
          t_10div2(data);
          break;
        default:
          TESTS.ShowSysError('Test for ' + ev.cmd + ' not yet built.');
          break;
      }
    }).fail(function(err) {
      TESTS.ShowSysError('Server error: ' + err)
    });
  }
});

function t_io(data) {
  var inp = TESTS.GetRandomIntegerArray(1);
  TESTS.SimpleOutputTest(data, inp, [], inp);
}

function t_add100(data) {
  var inp = TESTS.GetRandomIntegerArray(1);
  TESTS.SimpleOutputTest(data, inp, [], [100 + inp[0]]);
}

function t_xTimesY(data) {
  var inp = TESTS.GetRandomIntegerArray(2);
  TESTS.SimpleOutputTest(data, inp, [], [inp[0] * inp[1]]);
}

function t_abc(data) {
  var inp = TESTS.GetRandomIntegerArray(3);
  TESTS.SimpleOutputTest(data, inp, [], [inp[0] * (inp[1] + inp[2])]);
}

function t_branch1(data) {
  var inp = TESTS.GetRandomIntegerArray(1, 20);
  TESTS.SimpleOutputTest(data, inp, [], [inp[0] > 20 ? 1 : 0]);
}

function t_branch2(data) {
  var inp = TESTS.GetRandomIntegerArray(2, 20);
  TESTS.SimpleOutputTest(data, inp, [], [inp[0] + inp[1] > 20 ? 1 : 0]);
}

function t_branch3(data) {
  var inp = TESTS.GetRandomIntegerArray(1, 40)[0];
  var expected;
  if (inp <= 10) {
    expected = 0;
  } else if (inp <= 20) {
    expected = 1;
  } else if (inp <= 30) {
    expected = 2;
  } else {
    expected = 99;
  }
  TESTS.SimpleOutputTest(data, [], [{name: 'Number', value: inp}], [expected]);
}

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

