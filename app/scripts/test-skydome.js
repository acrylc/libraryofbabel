var Babel = Babel || {};

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
var noiseInc = 0.01;
var stop = false;
var moveNext = false;
var moveBack = false;
var turnInc = 1;
var turning = true;
var side = 1;
var currentRoom = {
	id:-1,
	walls:[
	]
}
var isIntro = true;
var path = "";
var pathTitles = [];
var turns = []
var prevId, prevTitle
var playerName, playerId, playerRoomRef, nameRef;
var pathStack = [];

var intro = [
	'The universe (which others call the Library) is composed of an indefinite and perhaps infinite number of hexagonal galleries.',
	'When it was proclaimed that the Library contained all books, the first impression was one of extravagant happiness. All men felt themselves to be the masters of an intact and secret treasure.',
	'Thousands of the greedy abandoned their sweet native hexagons and rushed up the stairways, urged on by the vain intention of finding their Vindication. These pilgrims disputed in the narrow corridors, proferred dark curses, strangled each other on the divine stairways...',
	'Others went mad.'
]
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );


function init() {

	// Create container to display library
	container = document.createElement( 'div' );
	container.setAttribute("style", "width:100%;height:100%;position:fixed;padding:0;margin:0;z-index:0;")
	document.body.appendChild( container );

	initDBListeners();
	initRoom();

	// create camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth*0.1 / window.innerHeight, 1, 100000 );
	camera.position.y = -420;//0;//140;// -400;
	camera.position.z = 300;//-30;//45;//400;
	camera.position.x = 350;//0;//340;
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
		var particle = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 500 - 550);
		var particle2 = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 500);
		particles.vertices.push(particle);
		particles.vertices.push(particle2);
	}
	for (var p = 0; p <2000; p++) {
		var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 550);
		var particle2 = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500);
		particles.vertices.push(particle);
		particles.vertices.push(particle2);
	}
	particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 0.7 });
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
			var url = currentRoom.walls[side].title.replace(' ','_');
			$('#side-title').html('<a href="http://wikipedia.org/wiki/'+url+'" target="blank">'+currentRoom.walls[side].title+'</a><br><br><p>'+currentRoom.walls[side].txt+'</p>');
			// $('#side-title').html(currentRoom.walls[side].title);
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
	camera.position.z += noiseInc;//400;
	noiseY+=noiseInc;
	if (noiseY>0.8){
		noiseInc=-0.01;
	}
	if (noiseY<-0.8){
		noiseInc=0.01;
	}
	if (isIntro){
	if (camera.position.x>0){
		camera.position.x-=0.3;
		} else {
			camera.position.x =0 ;
		}
			if (camera.position.y<0){

		camera.position.y+=0.25;
		} else {
			camera.position.y=0;
		}
		if (camera.position.z>-30){
		camera.position.z-=.22;
		} else {
			camera.position.z = -30;
		}
		if (camera.position.x===0&&camera.position.y===0&&camera.position.z===-30){
			isIntro=false;
			$('#intro-overlay').fadeOut(300);
			$('#project-title').fadeIn(500);
					setTimeout(function() {
			$('#canvas-overlay').fadeIn(400);
			$('#project-title').fadeOut(300);
}, 4000);
// }());
			// $('#canvas-overlay').fadeIn(300);
		}
	}
	camera.lookAt(lookAt);

    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;

    if (moveNext === true) {
    	turning = false;
    	moveToNextRoom();
    }

    if (moveBack === true) {
    	turning = false;
    	moveToPrevRoom();
    }

	if (turns.length!=0 ) {
		if (turns[0] == 1 || 2){
		    animateTurn(time);
		}
	}

    // request new frame
    requestAnimationFrame( function() {
        animate();
    });
}

init();
animate();

function skipIntro (){
	camera.position.x=0;
	camera.position.y=0;
	camera.position.z=-30;
}

(function(){
	$('#intro-overlay #t1').html(intro[0]);
	$('#intro-overlay #t2').html(intro[1]);
	$('#intro-overlay #t3').html(intro[2]);
	$('#intro-overlay #t4').html(intro[3]);
	$('#intro-overlay #t5').html(intro[4]);
	$('#t1').fadeIn(300);
	setTimeout(function() {
  $("#t1").fadeOut(300);
  $("#t2").fadeIn(300);
}, 6500);
	setTimeout(function() {
  $("#t2").fadeOut(300);
  $("#t3").fadeIn(300);
}, 14000);
		setTimeout(function() {
  // $("#t3").fadeOut(300);
  $("#t4").fadeIn(300);
}, 23500);
}());



