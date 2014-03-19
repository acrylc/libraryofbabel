
// Return a hexagon mesh with radius r and depth d
var Hexagon = function(r,d, cx, cy, THREE){

	'use strict';

	var colors = [0xe74c3c, 0xc0392b],
		hexagon = new THREE.Geometry(),
		material,
		plane,
		j = 0,
		i = 0;

	hexagon.vertices.push( new THREE.Vector3( cx+r*0.87, cy+r*0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0.87, cy+r*0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0, cy+r*1 , 0 ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0, cy+r*1 , -d ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*-0.87, cy+r*0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*-0.87, cy+r*0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*-0.87, cy+r*-0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*-0.87, cy+r*-0.5, -d ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0, cy+r*-1 , 0 ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0, cy+r*-1 , -d ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*0.87, cy+r*-0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3(  cx+r*0.87, cy+r*-0.5, -d ) );

	// Fill faces of hexagon
	for (i=0;i<9;i+=2){
		hexagon.faces.push( new THREE.Face3( i+0, i+1, i+2 ) );
		hexagon.faces.push( new THREE.Face3( i+2, i+1, i+3 ) );
	}
	hexagon.faces.push( new THREE.Face3( 10, 11, 0 ) );
	hexagon.faces.push( new THREE.Face3( 1, 11, 0 ) );

	for (i=0; i<hexagon.faces.length; i+=2) {
		var color = colors[ j ];
		j = (j + 1) % 2;
	    hexagon.faces[i].color.setHex(color);
	    hexagon.faces[i+1].color.setHex(color);
	}

	// Set material given a color, I set trasparency to 0.2
	material = new THREE.MeshBasicMaterial({
		vertexColors: THREE.FaceColors,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.9
	});

	// Return the mesh
	plane = new THREE.Mesh(hexagon, material);
	plane.doubleSided = true;
	plane.material.side = THREE.DoubleSide;

	return plane;
};
