var express = require('express');
var request = require('request');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var app = express();
var Dictionary = require('./dictionary');
var	request = require('request');
var	express = require('express');
var	bodyParser = require('body-parser');
var	dict = new Dictionary({
		key: "54447308-e899-4235-8c60-636df931ac75"
});
var translate = function(word, callback) {
	var definition = '';
	dict.define(word, function(error, result){
		if (error == null) {
			if(typeof result[0] != 'undefined'){
				for(var i=0; i<1; i++){
					definition += 'Part of speech: '+result[i].partOfSpeech+'\nDefinitions: '
					+result[i].definition;
				}
			} else {
				definition += 'Word not found';
			}
		}
		else if (error === "suggestions"){
			definition += word+' not found in dictionary. \nPossible suggestions: \n';
			for (var i=0; i<3; i++){
				definition += result[i]+'\n';
			}
		}
		else {
			console.log(error);
			definition += error;
		}
		callback(definition);
	});
};

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
    console.log(req.query.Body);
    var query = [];
    try {
    query = req.query.Body.split(' ').toLowerCase();
	    if (query[0] !== undefined) {
		    if (query[0] == 'define') {
          var word = query[1];
          if (word) {
            translate(word, function(definition) {
            	twiml.message(definition);
            });
          } else {

          }
		        // twiml.message('Define word!');

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

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});