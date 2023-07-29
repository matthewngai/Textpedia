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
var TwilioAuthService = require('node-twilio-verify');
var	dict = new Dictionary({
		key: "54447308-e899-4235-8c60-636df931ac75"
});
var yandex = require('yandex-translate')('trnsl.1.1.20160821T044313Z.8fbdeed9f777bcbc.8bf304d8532c781d6e8f52dc8df4d3f833166087');
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
    var query = [];
    try {
    query = req.body.Body.split(' ').toLowerCase();
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
    var query = [];
    var fullQuery;
     try {
    	fullQuery = req.body.Body;
    	query = fullQuery.split(' ');
	    if (query[0] !== undefined) {

		    if (query[0].toLowerCase() == 'define') {
	          var word = query[1];
	          if (word) {
	            translate(word, function(definition) {
	            	twiml.message(definition);
	            	res.writeHead(200, {'Content-Type': 'text/xml'});
    				res.end(twiml.toString());
	            });
	          }
	          else {
		        twiml.message('word is empty');
		        res.writeHead(200, {'Content-Type': 'text/xml'});
    			res.end(twiml.toString());
	          }
		    }
		    else if (query[0].toLowerCase() == 'instruction') {
	            twiml.message("definition: define <word>\
translate: translate <language code> <sentence>\
detect: detect <sentence>\
List of language codes: languages\
");
	            res.writeHead(200, {'Content-Type': 'text/xml'});
    			res.end(twiml.toString());
		    }
		    else if (query[0].toLowerCase() == 'hello') {
	            twiml.message('Hello! This is Textpedia. Enter a word below to search for definition');
	            res.writeHead(200, {'Content-Type': 'text/xml'});
    			res.end(twiml.toString());
		    }
		    else if (query[0].toLowerCase() == 'translate') {
		    	var result = fullQuery.split(/\s+/);
		    	result = result.slice(2, result.length);
		    	var sentence = result.join(" ");

		    	yandex.translate(sentence, {to: query[1]}, function(err, resp) {
			    	twiml.message(resp.text[0]);
			        res.writeHead(200, {'Content-Type': 'text/xml'});
		    		res.end(twiml.toString());
		    	});
		    }
		    else if (query[0].toLowerCase() == 'detect') {
		    	var result = fullQuery.split(/\s+/);
		    	result = result.slice(1, result.length);
		    	var sentence = result.join(" ");
				yandex.detect(sentence, function(err, resp) {
			    	twiml.message(resp.lang);
			        res.writeHead(200, {'Content-Type': 'text/xml'});
		    		res.end(twiml.toString());
				});
		    }
		    else if (query[0].toLowerCase() == 'languages') {
			    twiml.message("languages");
			    res.writeHead(200, {'Content-Type': 'text/xml'});
		    	res.end(twiml.toString());
		    }
		    else {
		        twiml.message('Invalid command. Please try a different command.');
		        res.writeHead(200, {'Content-Type': 'text/xml'});
    			res.end(twiml.toString());
		    }
	    }
    } catch(err) {
    	console.log(err);
    	twiml.message('Invalid request. Please try a different command.' + err);
    	res.writeHead(200, {'Content-Type': 'text/xml'});
    	res.end(twiml.toString());
    }
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});