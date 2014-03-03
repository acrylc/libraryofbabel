
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
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );

	// camera
	// var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1300);
	camera.position.y = 0;// -400;
	camera.position.z = -35;//400;
	camera.up = new THREE.Vector3(0,0,1);
	camera.position.x = 0;
	// camera.rotation.x = 40 * (Math.PI / 180);
	// scene
	lookAtX = 0;//52.2;//0;
	lookAtY = 100;//90;//0;
	lookAtZ = -20;//0;
	 lookAt = new THREE.Vector3 (lookAtX,lookAtY,lookAtZ);

// var axis = new THREE.Vector3( 0, 0, 1 );
// var angle = 0;
// var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );

// lookAt.applyMatrix4( matrix );

	camera.lookAt(lookAt);


	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );
moveToNextRoom = function(){

	// i = 0;
	// dist = 0;
	if (camera.position.y<110 &&  camera.position.y >= 0){
		camera.position.y += 2.5;
	}
	if (camera.position.y==110 || camera.position.y==111)
		camera.position.y = -105;
	if (camera.position.y < 0){
		camera.position.y += 2.5;
		stop = true;
	}
	if (camera.position.y == 0 || camera.position.y == -1){
		turning = true;
		camera.position.y = 0
		moveNext= false;
	}
}


// LIGHTS

				var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.475 );
				directionalLight.position.set( 100, 100, -100 );
				scene.add( directionalLight );


				var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.25 );
				hemiLight.color.setHSL( 0.59, 0.2, 0.9 );
				hemiLight.groundColor.setHSL( 9, 0.8, 0.7 );
				hemiLight.position.x = 500;
				scene.add( hemiLight );

				// SKYDOME

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
					// renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( scene.fog.color, 1 );
				// renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				// renderer.domElement.style.position = "relative";
				// container.appendChild( renderer.domElement );

	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	render();
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


var text3d = new THREE.TextGeometry('The Library of Babel', {
	  // font: 'serif',  //change this
	 font:'helvetiker',
  size: 5,
  height: 1,
  weight: 'normal'
});

var material3 = new THREE.MeshBasicMaterial({
  color: 0xffffff
});

var textMesh = new THREE.Mesh( text3d, material3 );
textMesh.translateZ( 0 );
textMesh.translateX( 0 );
textMesh.rotation.x = 90 * (Math.PI / 180);
textMesh.rotation.y = 30 * (Math.PI / 180);
textMesh.translateZ(-100);
textMesh.translateY(-10);
textMesh.translateX(-50);


hexagon =  Hexagon(120, 50, 0,0, 0xdadadF);
// hexagon2 =  Hexagon(120, 50, 240,0, 0xdadadF);
// hexagon2 =  Hexagon(120, 50, -240,0, 0xdadadF);
group = new THREE.Object3D();//create an empty container
group.add( hexagon );//add a mesh with geometry to it
// group.add( hexagon2 );//add a mesh with geometry to it
group.add( textMesh );//add a mesh with geometry to it
// group.rotation.y = ( Math.PI / 90)
group.rotation.z = 0.523598776;
scene.add(group);


	// camera.lookAt(scene.position);
	// scene.add(scene.position);

function render() {

	var timer = 0.0001 * Date.now();
	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;
	// camera.lookAt( scene.position );
	// skycube.cameraCube.rotation.copy( camera.rotation );



// // Do some optional calculations. This is only if you need to get the
// // width of the generated text
// textGeom.computeBoundingBox();
// textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

	// renderer.render( skycube.sceneCube, skycube.cameraCube );
	renderer.render( scene, camera );

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
		if ( inc < 1.04719755  ){
		// hexagon.rotation.z += 0.0698;
		// textMesh.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

			var axis = new THREE.Vector3( 0, 0, 1 );
			var angle = -0.05;
			var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			inc +=0.05;
			// lookAt.applyMatrix4( matrix );
			group.rotation.z +=0.05;		


		// lookAt.rotation.z += 0.0698;
		}
		camera.lookAt(lookAt);
		// camera.rotation.x = ( Math.PI / 90)

		if (inc == 1.0){
			// var axis = new THREE.Vector3( 0, 0, 1 );
			// var angle = -0.05;
			// var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			inc +=0.04719755;
			// lookAt.applyMatrix4( matrix );
			group.rotation.z +=0.05719755;		
		}

		// camera.rotation.x +=0.001;
		if (timeDiff >= 700){
		lastTime = time;  
		inc = 0; 
		}
	}

	if (turning == true)
			    animateTurn();


    // request new frame
    requestAnimationFrame(function(){
        animate();
    });
}

