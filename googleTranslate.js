var yandex = require('yandex-translate')('trnsl.1.1.20160821T044313Z.8fbdeed9f777bcbc.8bf304d8532c781d6e8f52dc8df4d3f833166087');
var fs = require('fs');

yandex.translate('Hello, my name is Jack', {to: 'zh'}, function(err, res) {
  console.log(res.text);
  fs.writeFile('output.txt', res.text);
});
