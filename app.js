var express = require('express');
var request = require('request');
var path = require('path');
var router = express.Router();
var app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.listen(3000, function () {
  console.log('app listening orn port 3000!');
});