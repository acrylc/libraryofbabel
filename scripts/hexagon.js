
// Return a hexagon mesh with radius r and depth d

Hexagon = function(r,d, cx, cy, color){

	// Hexagon geometry
	this.hexagon = new THREE.Geometry();
	hexagon.vertices.push( new THREE.Vector3( cx+r*0.87, cy+r*0.5, 0 ) );
	hexagon.vertices.push( new THREE.Vector3( cx+r*0.87, cy+r*0.5, -d ) );

	// hexagon.vertices.push( new THREE.Vector3( (cx+r*0.87 + cx+r*0)/3, (cy+r*0.5)/3, 0 ) );
	// hexagon.vertices.push( new THREE.Vector3( (cx+r*0.87 + cx+r*0)/3, (cy+r*0.5)/3, -d ) );

	// hexagon.vertices.push( new THREE.Vector3( (cx+r*0.87 + cx+r*0)/3, cy+r*0.5, 0 ) );
	// hexagon.vertices.push( new THREE.Vector3( (cx+r*0.87 + cx+r*0)/3, cy+r*0.5, -d/2 ) );



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

	cols = [0xe74c3c, 0xc0392b]
	// cols = [0x34495e, 0x2c3e50]
	j = 0;
for ( var i = 0; i < hexagon.faces.length; i +=2 ) {
	col = cols[j]
	j = (j+1)%2
    hexagon.faces[ i ].color.setHex( col  );
    hexagon.faces[ i+1 ].color.setHex( col );
}


	// Set material given a color, I set trasparency to 0.2
	var material = new THREE.MeshBasicMaterial({
		// color:color,
		vertexColors: THREE.FaceColors,
		shading: THREE.FlatShading,
		transparent: true, opacity: 0.9
	})

	// Return teh mesh
	var plane = new THREE.Mesh(hexagon, material);
	plane.doubleSided = true;
	plane.material.side = THREE.DoubleSide;
	
	return plane;
}