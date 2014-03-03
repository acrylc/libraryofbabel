      // revolutions per second
      var angularSpeed = 0.2; 
      var lastTime = 0;
 
      // this function is executed on each animation frame
      function animate(){
        // update
        var time = (new Date()).getTime();

        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
        // plane.rotation.z += 0.523598776;
                if ( timeDiff < 150 && (timeDiff%1) ==0 ){

                 plane.rotation.z += 0.12;
             }
      // camera.rotation.x +=0.001;


        // lastTime = time;

        if (timeDiff >= 700){
        lastTime = time;
         // plane.rotation.z += 1.04719755;


 		}
 	// 	if (camera.position.z>-25){
 	// 		camera.position.z-=10;
 	// 	}
 	// 	if (camera.position.z <= 00 && lookAtX < 50 )
 	// 		lookAtX += 1;

 	// 	if (camera.position.z <= 00 && lookAtZ > -25 )
 	// 		lookAtZ -= 1;
 	// 	               // camera.position.z +=5;
  // camera.lookAt(new THREE.Vector3 (lookAtX,0,lookAtZ));

        // render
        renderer.setClearColor( 0xF5F5F5, 1 );

        renderer.render(scene, camera);

        // request new frame
        requestAnimationFrame(function(){
            animate();
        });
      }

      // renderer
var renderer = new THREE.WebGLRenderer( { alpha: true } );
      renderer.setClearColor( 0xffffff, 1 );

      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
 
      // camera
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1300);
      camera.position.y = 0;// -400;
      camera.position.z = -25;//400;
      camera.up = new THREE.Vector3(0,0,1);
camera.position.x = -30;
      camera.rotation.x = 40 * (Math.PI / 180);
      // scene
      var scene = new THREE.Scene();
      lookAtX = 150;//0;
      lookAtZ = -25;//0;
  camera.lookAt(new THREE.Vector3 (lookAtX,0,lookAtZ));
  // camera.lookAt(scene.position);
scene.add(scene.position);
      // plane

	var hexagon = new THREE.Geometry();

	r = 120;
	d = 50;
	hexagon.vertices.push( new THREE.Vector3( r*0.87, r*0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3( r*0.87, r*0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3( r*0, r*1 , 0 ) );
	hexagon.vertices.push( new THREE.Vector3( r*0, r*1 , -d ) );
	hexagon.vertices.push( new THREE.Vector3(  r*-0.87, r*0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  r*-0.87, r*0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3(  r*-0.87, r*-0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  r*-0.87, r*-0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3( r*0, r*-1 , 0 ) );
	hexagon.vertices.push( new THREE.Vector3( r*0, r*-1 , -d ) );
	hexagon.vertices.push( new THREE.Vector3(  r*0.87, r*-0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  r*0.87, r*-0.5, -d ) );

	for (i=0;i<9;i+=2){
		hexagon.faces.push( new THREE.Face3( i+0, i+1, i+2 ) );
		hexagon.faces.push( new THREE.Face3( i+2, i+1, i+3 ) );
	}
		hexagon.faces.push( new THREE.Face3( 10, 11, 0 ) );
		hexagon.faces.push( new THREE.Face3( 1, 11, 0 ) );


	// hexagon.computeBoundingSphere();


	var material = new THREE.MeshBasicMaterial({
		color:0x1a1a1F,
		shading: THREE.FlatShading,
		transparent: true, opacity: 0.8

	})

      var plane = new THREE.Mesh(hexagon, material);
      // plane.overdraw = true;
      // plane.color.setHex( 0xffffff );
 plane.doubleSided = true;

plane.material.side = THREE.DoubleSide
      scene.add(plane);
 	var material2 = new THREE.MeshBasicMaterial({
		color:0xfa1a1F
	})
 
      // lastTime = 0;
      // start animation
      animate();