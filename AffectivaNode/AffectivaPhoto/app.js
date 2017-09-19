var express = require('express');
var app = express();
var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/index', function(req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
});
