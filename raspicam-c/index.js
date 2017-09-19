var RaspiCam = require("raspicam");


var camera = new RaspiCam({
	mode: "photo",
	output: "./photo/image.jpg",
	encoding: "jpg",
	timeout: 0 // take the picture immediately
});

var camera1 = new RaspiCam({
	mode: "video",
	output: "./video/video.h264",
	framerate: 15,
	timeout: 5000 // take a 5 second video
});


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