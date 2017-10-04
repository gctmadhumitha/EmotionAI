var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
 
var spawn = require('child_process').spawn;
var proc;
 
app.use('/', express.static(path.join(__dirname, 'stream')));
app.use(express.static( __dirname + "/public" )); 
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
var sockets = {};
 
io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}
 
function startStreaming(io) {
 
  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }
 //raspistill -w 640 -h 480 -q 5 -o /tmp/stream/pic.jpg -tl 100 -t 9999999 -th 0:0:0 &
//  -w sets the image width. For an HD stream use 1920 here.
// -h sets the image height. For an HD stream use 1080 here.
// -q sets the JPEG quality level, from 0 to 100. I use a pretty low quality, better quality generates bigger pictures, which reduces the frame rate.
// -o sets the output filename for the JPEG pictures. I'm sending them to a temp directory. The same file will be rewritten with updated pictures.
// -tl sets the timelapse interval, in milliseconds. With a value of 100 you get 10 frames per second.
// -t sets the time the program will run. I put a large number here, that amounts to about two hours of run time.
// -th sets the thumbnail picture options. Since I want the pictures to be as small as possible I disabled the thumbnails by setting everything to zero.
// & puts the application to run in the background.

  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "200"];
  proc = spawn('raspistill', args);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })
 
}
