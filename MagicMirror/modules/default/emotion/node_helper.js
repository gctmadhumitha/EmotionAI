/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
	mode: "photo",
	output: "./photo/image.jpg",
	encoding: "jpg",
	timeout: 0 // take the picture immediately
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



module.exports = NodeHelper.create({
	
	init: function() {
		console.log("Initializing new module helper ...");
	},

	loaded: function(callback) {
		console.log("Module helper loaded: " + this.name);
		callback();
	},
	
	// Override start method.
	start: function() {
		console.log("Madhu Starting node helper for: " + this.name);
	},
	
	stop: function() {
		console.log("Madhu Stopping node helper for: " + this.name);
	},
	
	
	startCam: function() {
		console.log("Starting node helper for: " + this.name);
		camera.start( );
	},

	stopCam: function() {
		console.log("Stopping node helper for: " + this.name);
		camera.stop( );
	}
 
});
