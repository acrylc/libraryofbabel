
function Skycube(){

// var cameraCube, sceneCube;

	this.cameraCube = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
	this.sceneCube = new THREE.Scene();
	var urlPrefix	= "images/";
	var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
				urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
				urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );

	// Skybox
	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} ),

	mesh = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), material );
	this.sceneCube.add( mesh );
}