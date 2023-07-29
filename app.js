var express = require('express');
var request = require('request');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});


app.get('/message', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    console.log(req.query.Body);
    var query = [];
    try {
    query = req.query.Body.split(' ').toLowerCase();
	    if (query[0] !== undefined) {
		    if (query[0] == 'define') {
		        twiml.message('Define word!');
		    } else {
		        twiml.message('Invalid request. Please try a different command.');
		    }
	    }
    } catch(err) {
    	console.log(err);
    	twiml.message('Invalid request. Please try a different command.' + err);
    }


    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.post('/message', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    if (req.body.Body == 'Define') {
        twiml.message('Define word!');
    } else {
        twiml.message('Invalid request. Please try a different command.');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});