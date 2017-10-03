/*
   Face detector configuration - If not specified, defaults to F
   affdex.FaceDetectorMode.LARGE_FACES
   affdex.FaceDetectorMode.LARGE_FACES=Faces occupying large portions of the frame
   affdex.FaceDetectorMode.SMALL_FACES=Faces occupying small portions of the frame
*/
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
var isDetectorInitialized = false;
//Construct a FrameDetector and specify the image width / height and face detector mode.
var detector = new affdex.FrameDetector(faceMode);
//Add a callback to notify when the detector is initialized and ready for runing.
      detector.addEventListener("onInitializeSuccess", function() {
      	isDetectorInitialized = true;
        log('#logs', "The detector reports initialized");
        console.log("onInitializeSuccess");
        //Display canvas instead of video feed because we want to draw the feature points on it
        //$("#face_video_canvas").css("display", "block");
        //$("#face_video").css("display", "none");
        startTimestamp = (new Date()).getTime() / 1000;
        captureImage();
      });

      detector.addEventListener("onInitializeFailure", function() {
      	isDetectorInitialized = false;
        log('#logs', "The detector reports initialization failed");
        console.log("onInitializeFailure");
      });

/* 
  onImageResults success is called when a frame is processed successfully and receives 3 parameters:
  - Faces: Dictionary of faces in the frame keyed by the face id.
           For each face id, the values of detected emotions, expressions, appearane metrics 
           and coordinates of the feature points
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: The timestamp of the captured image in seconds.
*/
//detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {});

/* 
  onImageResults success receives 3 parameters:
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: An imageData object contain the pixel values for the processed frame.
  - err_detail: A string contains the encountered exception.
*/
detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {

	console.log("onImageResultsFailure");
	console.log("timestamp is "+ timestamp);
	console.log("err_detail " + err_detail);

	var c = document.getElementById("resultCanvas");
	var ctx = c.getContext("2d");	
	ctx.putImageData(image, 10, 70);
});

detector.addEventListener("onResetSuccess", function() {});
detector.addEventListener("onResetFailure", function() {});

detector.addEventListener("onStopSuccess", function() {});
detector.addEventListener("onStopFailure", function() {});

// Track smiles
detector.detectExpressions.smile = true;

// Track joy emotion
detector.detectEmotions.joy = true;

// Detect person's gender
detector.detectAppearance.gender = true;

detector.detectAllExpressions();
detector.detectAllEmotions();
detector.detectAllEmojis();
detector.detectAllAppearance();

//Cache the timestamp of the first frame processed
var startTimestamp = (new Date()).getTime() / 1000;

 //function executes when Start button is pushed.
  function startDetector() {
  	console.log("startDetector");
    if (detector && !detector.isRunning) {
      $("#logs").html("");
      detector.start();
      console.log("detected started");
      //
    }else{
      $("#logs").html("Detector running");
    }
    log('#logs', "Clicked the start button");
  }


function captureImage(){
	console.log("captureImage");
	//Get a canvas element from DOM

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var img = document.getElementById('stream');
	 canvas.width = img.width;
	 canvas.height = img.height;
	 context.drawImage(img, 0, 0 );
	//var myData = context.getImageData(0, 0, img.width, img.height);


	

	//Get imageData object.
	var imageData = context.getImageData(0, 0, img.width, img.height);

	//Get current time in seconds
	var now = (new Date()).getTime() / 1000;

	//Get delta time between the first frame and the current frame.
	var deltaTime = now - startTimestamp;

	//Process the frame
	detector.process(imageData, deltaTime);
}

//Add a callback to receive the results from processing an image.
      //The faces object contains the list of the faces detected in an image.
      //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
      detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
      	console.log("onImageResultsSuccess");
        $('#results').html("");
        log('#results', "Timestamp: " + timestamp.toFixed(2));
        log('#results', "Number of faces found: " + faces.length);
        if (faces.length > 0) {
          log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
          log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          }));
          log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          }));
          log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
          //drawFeaturePoints(image, faces[0].featurePoints);
        }
      });

      function stopDetector() {
        console.log("Clicked the stop button");
        if (detector && detector.isRunning) {
          detector.removeEventListener();
          detector.stop();
        }
      };

      //function executes when the Reset button is pushed.
      function resetDetector() {
        console.log("Clicked the reset button");
        if (detector && detector.isRunning) {
          detector.reset();
          $('#results').html("");
        }

      };

       function log(node_name, msg) {
        $(node_name).append("<span>" + msg + "</span><br />")
      }

       //Draw the detected facial feature points on the image
      function drawFeaturePoints(img, featurePoints) {
        var contxt = $('#face_video_canvas')[0].getContext('2d');

        var hRatio = contxt.canvas.width / img.width;
        var vRatio = contxt.canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);

        contxt.strokeStyle = "#FFFFFF";
        for (var id in featurePoints) {
          contxt.beginPath();
          contxt.arc(featurePoints[id].x,
            featurePoints[id].y, 2, 0, 2 * Math.PI);
          contxt.stroke();

        }
      }


