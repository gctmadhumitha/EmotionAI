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


var RaspiCam = require("raspicam");


var camera = new RaspiCam({
  mode: "photo",
  output: "./photo/image.jpg",
  encoding: "jpg",
  timeout: 100 // take the picture immediately
});

// var camera1 = new RaspiCam({
//  mode: "video",
//  output: "./video/video.h264",
//  framerate: 15,
//  timeout: 5000 // take a 5 second video
// });


camera.on("start", function( err, timestamp ){
  console.log("photo started at " + timestamp );
});

camera.on("read", function( err, timestamp, filename ){
  console.log("photo image captured with filename: " + filename );
});

camera.on("exit", function( timestamp ){
  console.log("photo child process has exited at " + timestamp );
});

camera.start();
console.log("about to wait...");
setTimeout(function() {
  console.log("done waiting");
  camera.stop();
}, 5000);