var Dictionary = require('./dictionary'),
	request = require('request'),
	express = require('express'),
	bodyParser = require('body-parser'),
	//pass the constructor a config object with your key
	dict = new Dictionary({
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

var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.post('/translate', function(req, res) {
	translate(req.body.word, function(definition) {
		res.send(definition);
	});
});

if (!module.parent) {
	app.listen(3000);
	console.log('Express started on port 3000');
}