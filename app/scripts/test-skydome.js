
var container;
var skycube;
var camera, scene, renderer;
var mesh, lightMesh;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var lookAt, lookAtX, lookAtZ;
var stop = false;
var moveNext = false;
var turnInc = 1;
var turning = true;
var side = 1;
var currentRoom 
var crowd = new Howl({
	urls: ['crowd-talking.mp3']
});
var volume = 0.7;
var oldVol 
var newVol

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	// room = {}
	// // room objects has : title, caption (random str), wall[] with text and titles, 
	// room.title = 'The Library of babel'
	// room.txt = 'Despite — indeed, because of — this glut of information, all books are totally useless to the reader, leaving the librarians in a state of suicidal despair.'
	// room.walls = [
	// 	{title: 'Wall 1', txt :''},
	// 	{title: 'Wall 2', txt :''},
	// 	{title: 'Wall 3', txt :''},
	// 	{title: 'Wall 4', txt :''},
	// 	{title: 'Wall 5', txt :''},
	// 	{title: 'Wall 6', txt :''}
	// ]
	// room.chatter = 0.5;
initRoom();

	// create camera
	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.y = 0;// -400;
	camera.position.z = -35;//400;
	camera.position.x = 0;
	camera.up = new THREE.Vector3(0,0,1);
	lookAtX = 0;//52.2;//0;
	lookAtY = 100;//90;//0;
	lookAtZ = -20;//0;
	lookAt = new THREE.Vector3 (lookAtX,lookAtY,lookAtZ);
	camera.lookAt(lookAt);

	// create scene
	scene = new THREE.Scene();

	// add fog and light
	scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.475 );
	directionalLight.position.set( 100, 100, -100 );
	scene.add( directionalLight );
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.25 );
	hemiLight.color.setHSL( 0.58, 0.2, 0.9 );
	hemiLight.groundColor.setHSL( 9, 1, 0.9 );
	hemiLight.position.x = 500;
	scene.add( hemiLight );

	// add gradient skydome
	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0xff7ff ) },
		bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
		offset:		 { type: "f", value: 00 },
		exponent:	 { type: "f", value: 0.99 }
	}
	uniforms.topColor.value.copy( hemiLight.color );
	scene.fog.color.copy( uniforms.bottomColor.value );
	var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
	var sky = new THREE.Mesh( skyGeo, skyMat );
	sky.rotation.y = 0.4;
	scene.add( sky );

	// create text
	var text = '"The Library of Babel" (Spanish: La biblioteca de Babel) is a short story by Argentine author and librarian Jorge Luis Borges (1899–1986), conceiving of a universe in the form of a vast library containing all possible 410-page books of a certain format. The story was originally published in Spanish in Borgess 1941 collection of stories El Jardín de senderos que se bifurcan (The Garden of Forking Paths). That entire book was, in turn, included within his much-reprinted Ficciones (1944). Two English-language translations appeared approximately simultaneously in 1962, one by James E. Irby in a diverse collection of Borgess works titled Labyrinths and the other by Anthony Kerrigan as part of a collaborative translation of the entirety of Ficciones.'
	var text3d = new THREE.TextGeometry(text, {
		  // font: 'serif',  //change this
		 font:'helvetiker',
	  size: 1,
	  height: 0.1,
	  weight: 'normal'
	});
	var material3 = new THREE.MeshBasicMaterial({
	  color: 0xDADADA
	});
	var textMesh = new THREE.Mesh( text3d, material3 );
	textMesh.translateZ( 0 );
	textMesh.translateX( 0 );
	textMesh.rotation.x = 90 * (Math.PI / 180);
	textMesh.rotation.y = 30 * (Math.PI / 180);
	textMesh.translateZ(-100);
	textMesh.translateY(-10);
	textMesh.translateX(-50);

	// create hexgon
	hexagon =  Hexagon(120, 50, 0,0, 0xdadadF);
	
	// create and add hexagon/text group
	group = new THREE.Object3D();//create an empty container
	group.add( hexagon );//add a mesh with geometry to it
	group.add( textMesh );//add a mesh with geometry to it
	group.rotation.z = 0.523598776;
	scene.add(group);

	// skycube = new Skycube();
	// var geometry = new THREE.SphereGeometry( 100, 32, 16 );
	// load images for Skybox

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// skycube.cameraCube.aspect = window.innerWidth / window.innerHeight;
	// skycube.cameraCube.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color, 1 );

	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	render();
	crowd.play();
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// skycube.cameraCube.aspect = window.innerWidth / window.innerHeight;
	// skycube.cameraCube.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {

	var timer = 0.0001 * Date.now();
	renderer.render( scene, camera );
	    // crowd.play();
    crowd.volume(volume);

	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;
	// camera.lookAt( scene.position );
	// skycube.cameraCube.rotation.copy( camera.rotation );

	// // Do some optional calculations. This is only if you need to get the
	// // width of the generated text
	// textGeom.computeBoundingBox();
	// textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

	// renderer.render( skycube.sceneCube, skycube.cameraCube );
}

var material2 = new THREE.MeshBasicMaterial({
	color:0xfa1a1F
})

$(document).keydown(function(evt) {
    if (evt.keyCode == 32) {
      space = true;
      moveNext= true;
    }
});



  // revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;
var inc = 0;
// this function is executed on each animation frame
function animate(){
  	render();
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
    

    // if (timeDiff >= 700 && turning==true){
    // 	lastTime = time;
    // 	hexagon.rotation.z = turnInc * 1.04;
    // 	turnInc = (turnInc+1)%7;
    // }

    if (moveNext == true){
    	turning = false;
    	moveToNextRoom();
    }

    // camera.position.y += 0.01;
    animateTurn = function(){
		// rotate hexagon every 800 sec
		if ( inc < 1.04719755   ){
		// hexagon.rotation.z += 0.0698;
		// textMesh.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

			var axis = new THREE.Vector3( 0, 0, 1 );
			var angle = -0.05;
			var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			inc +=0.1;
			// lookAt.applyMatrix4( matrix );
			group.rotation.z +=0.1;		


		// lookAt.rotation.z += 0.0698;
		}
		camera.lookAt(lookAt);
		// camera.rotation.x = ( Math.PI / 90)

		if ( inc >= 1.0){
			// var axis = new THREE.Vector3( 0, 0, 1 );
			// var angle = -0.05;
			// var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			inc +=0.04719755;
			// lookAt.applyMatrix4( matrix );
			group.rotation.z =  1.04719755*side + 0.5 ;
			side = (side+1)%6;
			inc = 0;
			lastTime = time;  
			turning = false;

			// group.rotation.z +=0.05719755;		
		}

		// // camera.rotation.x +=0.001;
		// if (timeDiff >= 700){
		// lastTime = time;  
		// inc = 0; 
		// }
	}

	if (timeDiff >= 350 && moveNext==false)
		turning = true;

	if (turning == true)
		    animateTurn();


    // request new frame
    requestAnimationFrame(function(){
        animate();
    });
}



init();
animate();