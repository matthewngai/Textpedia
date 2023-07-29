var request = require ('request');

var formData = {
  word: process.argv[2]
};

request.post({
  url: 'http://localhost:3000/translate',
  form: formData},
  function callback(err, httpReponse, body) {
    if(err) {
      console.error('Error: ', err);
    } else {
      console.log(body);
    }
  }
);