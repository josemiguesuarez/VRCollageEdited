// Plugin order is critical:
var images = [
   "3d-abstract_hdwallpaper_steam-engine_50474.jpg                   ",
   "52_8134_Hoentrop_2012-09-16.jpg                   ",
   "steam-engine-4.png                          ",
   "steam-engine-wallpaper-9.jpg                            ",
   "LARGE-3-175 UP3618 mallet 1929.tif.jpg                   ",
   "LARGE-3-420 oiling 9000.Tif.jpg                          ",
   "LARGE-6 sideview 9000.Tif.jpg                            ",
   "LARGE-7-40 depot Omaha Stimson.Tif.jpg                   ",
   "LARGE-7-67 coach shop.tif.jpg                            ",
   "LARGE-7-160 Durant FD 1910.tif.jpg                       ",
   "LARGE-68-13 UP3703 mallet 1918.tif.jpg                   ",
   "LARGE-68-80 Council Bluffs no date.jpg.jpg               ",
   "LARGE-001347H tour buses-1.psd.jpg                       ",
   "LARGE-1791A M10000 overhead.Tif.jpg                      ",
   "LARGE-1802 poster BW M10000 progress.Tif.jpg             ",
   "LARGE-5127A LA Ltd SPA semaphores.Tif.jpg                ",
   "LARGE-10233 through the pipe.tif.jpg                     ",
   "LARGE-14618 UP9026 Archer.tif.jpg                        ",
   "LARGE-73069 Lane cutoff.tif.jpg                          ",
   "LARGE-73209 4-4-2 SFA 97.tif.jpg                         ",
   "LARGE-74688  Children's Book of Yellowstone Bears.jpg.jpg",
   "LARGE-74690 poster Zion.tif.jpg                          ",
   "LARGE-74694 ad Grand Canyon.Tif.jpg                      ",
   "LARGE-504590 Joseph ag train.jpg.jpg                     ",
   "LARGE-ag train Pilot Rock OWRN.jpg.jpg                   ",
   "LARGE-CoP Rochester NY .tif.jpg                          ",
   "LARGE-EHHarriman Sale of UP.tif.jpg                      ",
   "LARGE-H7-74 Omaha Shop emp 1908.tif.jpg                  ",
   "LARGE-LA Ltd SPA crew 3413.Tif.jpg                       ",
   "LARGE-Lane cutoff fill .tif.jpg                          ",
   "LARGE-lane cutoff.jpg.jpg                                ",
   "LARGE-Mountain type 4-8-2.tif.jpg                        ",
   "LARGE-Omaha Shop ext air 1907.tif.jpg                    ",
   "LARGE-Omaha stores dept 1912.tif.jpg                     ",
   "LARGE-Papio trestle construction.tif.jpg                 ",
   "LARGE-PFE cars ice dock.tif.jpg                          ",
   "LARGE-PFE Las Vegas 1931.tif.jpg                         ",
   "LARGE-SPLAandSL num504.tif.jpg                           ",
   "LARGE-Streamliner 3 locos.Tif.jpg                        ",
   "LARGE-UP SP office KC.tif.jpg                            ",
   "LARGE-X1729 No 4038 near Truckee.tif.jpg                 ",
   "LARGE-X2313 Excursion Midlake.tif.jpg                    ",
   "LARGE-Zoin Lodge opening 04-15-25.tif.jpg                "
];

var numCircle = 0;
var numSwipe = 0;
var imageCount = 0;
var countLoop = 0;
Leap.loop({enableGestures: true}, function(frame){
  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
      countLoop ++
      if(countLoop == 100){
        countLoop =0;
        numCircle = 0;
      }
      switch (gesture.type){
        case "circle":
        numCircle++;
        if (numCircle === 50) {
          console.log("Circle Gesture");
          numCircle = 0;
          numSwipe = 0;
          location.reload(); 
        };  
        break;
        case "swipe":
        numSwipe++;
        if (numSwipe === 7) {
          console.log("Swipe Gesture");
          dock.pushImage("images/UP/" + images[(imageCount++)%images.length]);
          numSwipe = 0;     
        };
        numCircle = 0;
        break;
      }
    });
  }})
.use('transform', {
  vr:false
  position: new THREE.Vector3(0,-300,-190)
})
.use('boneHand', {
    scene: null, // this tells boneHand to use defer scene usage/creation.
    opacity: 0.7,
    boneScale: 1/9,
    jointColor: new THREE.Color(0x22FF22),
    arm: false
  })
.use('proximity')
.use('pinchEvent')
.use('playback', {
  pauseOnHand: true,
  loop: false,
  overlay: false,
  resumeOnHandLost: false,
  autoPlay: false
})
.use('twoHandRecognizer');




// This is fairly important - it prevents the framerate from dropping while there are no hands in the frame.
// Should probably default to true in LeapJS.
Leap.loopController.loopWhileDisconnected = true;

Leap.loopController.on('streamingStarted', function(){
  console.log('Leap Motion Controller streaming');
  ga('send', 'event', 'Leap', 'streaming');

  var connection = this.connection;
  this.connection.on('focus', function(){
    if (!VRClientReady) return;

    connection.reportFocus(VRClientFocused);
  });

});


var VRClientReady = false;
var VRClientFocused = true;
VRClient.onFocus = function(){
  VRClientFocused = true;

  cursor.enable();

  var connection = Leap.loopController.connection;
  if (!connection) return;

  connection.reportFocus(true);
};

VRClient.onBlur = function(){
  VRClientFocused = false;

  cursor.disable();

  var connection = Leap.loopController.connection;
  if (!connection) return;

  connection.reportFocus(false);
};


angular.module('index', ['directives']);



// Trying to figure out where to go next?
// Check out directives/scene.js