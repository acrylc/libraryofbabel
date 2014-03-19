var Babel = Babel || {};
// 'use strict';

Babel.Audio = {

	addEvent : function (element, eventName, callback) {
	    if (element.addEventListener) {
	        element.addEventListener(eventName, callback, false);
	    } else if (element.attachEvent) {
	        element.attachEvent('on'+ eventName, callback);
	    } else {
	        element['on' + eventName] = callback;
	    }
	},

	myAudio : new Audio('piano.wav'),
	spacebar : new Audio('switch.mp3'),

	init: function(){
		this.myAudio.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);
		this.myAudio.play();
		
		addEvent(document, 'keydown', function (e) {
			e = e || window.event;
			if (e.keyCode === 32) {
				spacebar.play();
		    }
		});
	},
};

(function(){
	// 'use strict';
	Babel.Audio.init();

}());


function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent('on'+ eventName, callback);
    } else {
        element['on' + eventName] = callback;
    }
}


var myAudio = new Audio('piano.wav');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();

var spacebar = new Audio('switch.mp3');

addEvent(document, 'keydown', function (e) {
	e = e || window.event;
	if (e.keyCode === 32) {
		spacebar.play();
    }
});

// ----- AUDIO 



// 'use strict'

var container;
var camera, scene, renderer, clock;
var mesh, lightMesh;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var lookAtX = 0,
	lookAtY = 100,
	lookAtZ = -20,
	lookAt = new THREE.Vector3 (lookAtX,lookAtY,lookAtZ);
var noiseY = 0;
var noiseInc = 0.008;
var stop = false;
var moveNext = false;
var turnInc = 1;
var turning = true;
var side = 1;
var currentRoom = {
	id:-1,
	walls:[
	]
}

var path = "";
var pathTitles = [];
var turns = []
var prevId, prevTitle
var playerName, playerId, playerRoomRef, nameRef

// document.addEventListener( 'mousemove', onDocumentMouseMove, false );


function init() {

	// Create container to display library
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	initDBListeners();
	initRoom();

	// create camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.y = 0;// -400;
	camera.position.z = -35;//400;
	camera.position.x = 0;
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(lookAt);


	// create scene
	scene = new THREE.Scene();

	//create clock
	clock = new THREE.Clock(true);

	// create hexgon
	hexagon =  Hexagon(120, 50, 0,0, THREE);
	hexagon.rotation.z = 0.523598776;
	
	scene.add(hexagon);

	//Create particle system
	var particles = new THREE.Geometry;
	for (var p = 0; p <2000; p++) {
		var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 150, Math.random() * 500 - 0);
		particles.vertices.push(particle);
	}
	particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });
	particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	scene.add(particleSystem);

	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setClearColor( 0x000000, 0 ); // the default
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	render();
}

//Initalize all Firebase Listeners and writers
 function initDBListeners(){
    var usersRef = new Firebase('https://libraryofbabel.firebaseio.com/players/');
    playerName = Math.random().toString(36).substring(7);
    $('input').val(playerName);
	t = usersRef.push({'name' : playerName});
	playerId = t.name();
    playerRoomRef = new Firebase('https://libraryofbabel.firebaseio.com/players/'+playerId+'/room/');
    nameRef = new Firebase('https://libraryofbabel.firebaseio.com/players/'+playerId+'/name/');
	winRef = new Firebase('https://libraryofbabel.firebaseio.com/win/');

 	winRef.on('child_added', function(childSnapshot, prevChildName) {
 		displayWin( childSnapshot.val() );
	});

 	usersRef.on('child_added', function(childSnapshot, prevChildName) {
		pli = $('<li class="pli"></li>');
		$(pli).data({'name':childSnapshot.val().name, 'room':childSnapshot.val().room})
		childSnapshot.ref().on('value', function(cs, ps){
			$(pli).data({'name':cs.val().name, 'room':cs.val().room})
			if (cs.val().room == currentRoom.title){
				pli.html( cs.val().name )
				pli.prependTo($('#myroom'))
			}
			else{
				pli.html( '<div id="pname"> '+cs.val().name + ' : </div>  <div id="proom"> ' + cs.val().room +'</div>' )
				pli.prependTo($('#notmyroom'))
			}
		});
	});
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
	var timer = 0.0001 * Date.now();
	var delta = clock.getDelta();
	particleSystem.rotation.z += delta*0.02;
	renderer.render( scene, camera );
};

var material2 = new THREE.MeshBasicMaterial({
	color:0xfa1a1F
});

// keyboard control for moving forward, next, back
$(document).keydown(function(evt) {
    // on space or arrow up move next 
    if (evt.keyCode === 32 || evt.keyCode === 38) {
      space = true;
      moveNext= true;
    }
    if (evt.keyCode == 37) {
		turns.push(1);
	}
	if (evt.keyCode == 39){
	    turns.push(2);
	}
	if (evt.keyCode == 40){
	    moveBack = true;
	    console.log('moving back')
	}
});

// camera.position.y += 0.008;
var animateTurn = function(time){
	if (turns[0] == 1)
		mult = -1;
	if (turns[0] == 2)
		mult = 1;
	if ( inc < 1.04719755   ){
		var axis = new THREE.Vector3( 0, 0, 1 );
		var angle = -0.05;
		var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
		inc += 0.25;
		hexagon.rotation.z += mult*0.25;		
	}
	camera.lookAt(lookAt);
	// camera.rotation.x = ( Math.PI / 90)

	if ( inc >= 1.0){
		// var axis = new THREE.Vector3( 0, 0, 1 );
		// var angle = -0.05;
		// var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
		inc +=0.04719755;
		// lookAt.applyMatrix4( matrix );
		hexagon.rotation.z =  mult* 1.04719755*side + Math.PI/180*90 ;
		particleSystem.rotation.z += mult* 1.04719755*side + Math.PI/180*90 ;

		if (turns[0] == 1){
			side = (side-1)
			if (side==-1) side=5
		} else if (turns[0]==2)
			side = (side+1)%6;
		
		inc = 0;
		lastTime = time;  
		turning = false;
		turns.pop();
		if (currentRoom.walls[side] === undefined) {
			$('#side-title').html('');
		}
		else {
			$('#side-title').html(currentRoom.walls[side].title);
		}
		// hexagon.rotation.z +=0.05719755;		
	}

	lastTime = time;
};

  // revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;
var inc = 0;
// this function is executed on each animation frame
function animate(){
  	render();
  		// camera.position.y += 0.1;// -400;
	camera.position.z += noiseInc;//400;
	noiseY+=noiseInc;
	if (noiseY>1)
		noiseInc=-0.008;
	if (noiseY<-1)
				noiseInc=0.008;

	// camera.position.x += 0.1;

    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;

    if (moveNext == true) {
    	turning = false;

    	moveToNextRoom();
    }

	if (turns.length!=0 ) {
		if (turns[0] == 1 || 2)
		    animateTurn(time);
	}

    // request new frame
    requestAnimationFrame( function() {
        animate();
    });
}

init();
animate();

$('#players-btn').on('click', function(){
	if ($('#roomlists').is(':visible')){
		$('#roomlists').fadeOut(150);
	} else {
		$('#userinput').fadeOut(100);
		$('#roomlists').fadeIn(150);
		$('#journey').fadeOut(100);
		$('#path').fadeOut(100);
	}
})

$('#user-btn').on('click', function(){
	if ($('#userinput').is(':visible')){
		$('#userinput').fadeOut(150);
	} else {
		$('#roomlists').fadeOut(100);
		$('#userinput').fadeIn(150);
		$('#journey').fadeOut(100);
		$('#path').fadeOut(100);
	}
})

$('#journey-btn').on('click', function(){
	if ($('#journey').is(':visible')){
		$('#journey').fadeOut(300);
	} else {
		$('#journey').fadeIn(300);
		$('#userinput').fadeOut(100);
		$('#roomlists').fadeOut(100);
		$('#path').fadeOut(100);
	}
})

$('#path-btn').on('click', function(){
	if ($('#path').is(':visible')){
		$('#path').fadeOut(300);
	} else {
		$('#path').fadeIn(300);
		$('#userinput').fadeOut(100);
		$('#roomlists').fadeOut(100);
		$('#journey').fadeOut(100);
	}
})

$( "input[type='text']" ).change(function() {
  // Check inp ut( $( this ).val() ) for validity here
  nameRef.set( $( this ).val() );
});

