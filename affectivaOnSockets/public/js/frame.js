/*
   Face detector configuration - If not specified, defaults to F
   affdex.FaceDetectorMode.LARGE_FACES
   affdex.FaceDetectorMode.LARGE_FACES=Faces occupying large portions of the frame
   affdex.FaceDetectorMode.SMALL_FACES=Faces occupying small portions of the frame
*/
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

//Construct a FrameDetector and specify the image width / height and face detector mode.
var detector = new affdex.FrameDetector(faceMode);

detector.addEventListener("onInitializeSuccess", function() {});
detector.addEventListener("onInitializeFailure", function() {});

/* 
  onImageResults success is called when a frame is processed successfully and receives 3 parameters:
  - Faces: Dictionary of faces in the frame keyed by the face id.
           For each face id, the values of detected emotions, expressions, appearane metrics 
           and coordinates of the feature points
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: The timestamp of the captured image in seconds.
*/
detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {});

/* 
  onImageResults success receives 3 parameters:
  - image: An imageData object containing the pixel values for the processed frame.
  - timestamp: An imageData object contain the pixel values for the processed frame.
  - err_detail: A string contains the encountered exception.
*/
detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {});

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

 //function executes when Start button is pushed.
  function startDetector() {
  	console.log("startDetector");
    if (detector && !detector.isRunning) {
      $("#logs").html("");
      detector.start();
      console.log("detected started");
      process()
    }else{
      $("#logs").html("Detector running");
    }
    log('#logs', "Clicked the start button");
  }


function process(){
	console.log("process");
	//Get a canvas element from DOM
	var aCanvas = document.getElementById("canvas");
	var context = aCanvas.getContext('2d');

	//Cache the timestamp of the first frame processed
	var startTimestamp = (new Date()).getTime() / 1000;

	//Get imageData object.
	var imageData = context.getImageData(0, 0, 640, 480);

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
          drawFeaturePoints(image, faces[0].featurePoints);
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


