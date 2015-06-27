
var path = require('path');
var fs = require('fs');
var express = require('express');

var router = express.Router();


// Play a sound command
router.get('/get-crunch-file', function(req, res) {

  console.log('Test:' + req.query.file)
  
  fs.readFile('/home/codio/workspace/public/' + req.query.file, 'utf8', function (err, data) {
    if (err) {
      console.log('Cannot access file')
    }
    else {
      console.log('Got file:' + data)
      res.send(data)
    }
  })
  
  
});


module.exports = router;
