var express = require('express');
var googlehome = require('google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;

var deviceName = 'Google Home';
var language = 'ja';
googlehome.device(deviceName,language);
googlehome.accent(language);   // test

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', function (request, response) {
    let post_data = '';
    request.on('data', function (chunk) {
      post_data += chunk;
    });
    request.on('end', function () {
      const webhook = JSON.parse(post_data).events[0];
      if (webhook.type != 'message' || webhook.message.type != 'text') {
        return;
      }
      const data_text = webhook.message.text;
      try {
        googlehome.notify(data_text, function(notifyRes) {
          console.log(notifyRes);
          response.send(deviceName + ' will say: ' + data_text + '\n');
        });
      } catch(err) {
        console.log(err);
        response.sendStatus(500);
        response.send(err);
      }
    });
})

app.listen(serverPort,function(){
  // Nop
})

/* If you need to start server Port 
app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('--->'+err);
    console.log('POST "text=Hello Google Home" to:');
    console.log('    http://localhost:' + serverPort + '/google-home-notifier');
    console.log('    ' +url + '/google-home-notifier');
    console.log('example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
*/

