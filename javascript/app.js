// Plugin order is critical:
var images = [
'IMG_7318.PNG',
'IMG_7319.PNG',
'REF.jpg',
'IMG_7320.PNG',
'IMG_7321.PNG',
'IMG_7322.PNG',
'IMG_7323.PNG',
'IMG_7324.PNG',
'IMG_7325.PNG',
'IMG_7326.PNG',
'IMG_7327.PNG',
'IMG_7328.PNG',
'IMG_7329.PNG',
'IMG_7330.PNG',
'IMG_7331.PNG',
'IMG_7332.PNG',
'IMG_7333.PNG',
'IMG_7334.PNG',
'IMG_7335.PNG',
'IMG_7336.PNG',
'IMG_7337.PNG',
'IMG_7338.PNG',
'IMG_7339.PNG',
'IMG_7340.PNG']

const minValueFist = 0.6;
var imageCount = 4;
var countLoop = 0;
window.ACTUALIZAR = true;
var execBefore = {};
var vector;
var transformation = {
  vr:false,
  position: new THREE.Vector3(0,-400,-490)
};
Leap.loop({enableGestures: true,
  hand: function(hand){
    var type = hand.type;
    if(type == "left"){
      console.log("Left hand.");
    } else {
      //stopTrackingIfNeeded(hand);
      //stopInteractionIfNeeded(hand)
      desplazamiento2(hand);
    }
    
  }
},function(frame){
  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
      var duration = gesture.duration;
      switch (gesture.type){

        case "circle":
        if(duration >= 500000){
          vectNormal = gesture.normal;
          if(!execBefore.reload && vectNormal[2]<-0.8){
            location.reload();
            execBefore.reload = true;
          }
        }
        else{
          execBefore.reload = false;
        }
        break;

        case "swipe":
        if (duration >= 500) {
          vectDir = gesture.direction;
          console.log()
          if(!execBefore.newImages && vectDir[0]<-0.7 && gesture.speed >70){
            console.log("Swipe Gesture");
            console.log();
            for (var i = 0; i < 4-dock.images.length; i++) {
              dock.pushImage("images/UP/" + images[(imageCount++)%images.length]);
            };
            execBefore.newImages = true;
          }  
        }else if (duration <= 150) {
          console.log('fin gesto')
          execBefore.newImages = false;
        }
        break;

      }
    });
}
})
.use('transform', transformation)
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


function checkFist(hand){
  var sum = 0;
  for(var i=0;i<hand.fingers.length;i++){
    var finger = hand.fingers[i];
    if(finger.type !== 0){
      var meta = finger.bones[0].direction();
      var proxi = finger.bones[1].direction();
      var inter = finger.bones[2].direction();
      var dMetaProxi = Leap.vec3.dot(meta,proxi);
      var dProxiInter = Leap.vec3.dot(proxi,inter);
      sum += dMetaProxi;
      sum += dProxiInter
    } 
  }
  sum = sum/8;

  if(sum<=minValueFist && getExtendedFingers(hand)==0){
    return true;
  }else{
    return false;
  }
}
function getExtendedFingers(hand){
  var f = 0;
  for(var i=0;i<hand.fingers.length;i++){
    var finger = hand.fingers[i];
    if(finger.type !== 0 && finger.extended){
      f++;
    }
  }
  return f;
}
function stopTrackingIfNeeded(hand){
  if(checkFist(hand))
  {
    if(!execBefore.fixedPosition){
      vector = hand.palmPosition;
      execBefore.fixedPosition = true;
    }
    else{
      var newVector = hand.palmPosition;
      var trnsAct = transformation.position;
      transformation.position = new THREE.Vector3(trnsAct.x - newVector[0] + vector[0] ,trnsAct.y - newVector[1] + vector[1],trnsAct.z );
    }

  } else{

    execBefore.fixedPosition = false;
  }
}

function stopInteractionIfNeeded (hand){
  var dotProduct = Leap.vec3.dot(
    hand.indexFinger.proximal.direction(),
    hand.middleFinger.proximal.direction()
    );
  var angle = Math.acos(dotProduct) * 180 / Math.PI; 

  if(angle > 10){
    window.ACTUALIZAR = true;
  }
  else{
    window.ACTUALIZAR = false;
  }
}

const puntoCentral = [ 25, 222, -16.4 ];
var vectorHandPosAnt;
function desplazamiento2(hand){
  if(!execBefore.desplazamiento2){
    vectorHandPosAnt = hand.palmPosition;
    execBefore.desplazamiento2 = true;
  }
  else{
    var palmPos = hand.palmPosition;
    var trnsPos = transformation.position;
    var deltaTrnsPalm  = delta ([trnsPos.x,trnsPos.y, trnsPos.z] , palmPos);
    

    //console.log(palmPos, " dis " , trnsPos, " : ", deltaTrnsPalm);
    var delPCtoPalm = delta(deltaTrnsPalm, puntoCentral)
    var distancia = norma2D( delPCtoPalm );

    if(distancia > 90){
      var delPosPalmAume = productoEscalar2D(distancia/200000, delPCtoPalm );
      var xNuevo = trnsPos.x - delPosPalmAume[0]
      if(xNuevo > 200 || xNuevo < -200 ){
        xNuevo = trnsPos.x;
      }
      var yNuevo = trnsPos.y - delPosPalmAume[1];
      if(yNuevo > -250 || yNuevo < -400 ){
        yNuevo = trnsPos.y;
      }
      transformation.position = new THREE.Vector3( xNuevo,yNuevo,trnsPos.z );

    }
    
    vectorHandPosAnt = palmPos;
  }
}

function delta(v1, v2)
{
  return [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2] ]
}
function norma2D (v)
{
  return Math.pow(v[0], 2) + Math.pow(v[1], 2)
}
function productoEscalar2D (escalar, v)
{
  return [escalar*v[0], escalar*v[1]];
}




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