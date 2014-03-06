moveStep = 2.5
steps = 110/moveStep
var d

initRoom = function(){

	str = 'http://en.wikipedia.org/w/api.php?action=query&format=json&rnnamespace=0&list=random&rnlimit=1'+"&callback=?"
	$.getJSON(str, function(data) {

		id = data['query']['random'][0].id
		title = data['query']['random'][0].title
		getRoom(id,title)	
	});
}


getRoom = function(id, title){


		$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&pageids="+id+"&generator=links&plnamespace=0&gpllimit=100&callback=?", function(data) {
	    console.log(data); d= data;
	    room = {};
	    pages = []
	    //get all pages
	    for (i in d['query']['pages']) pages.push( d['query']['pages'][i] )
	    //get 6 random ones
		stop  = Math.min(6, pages.length);
		console.log(pages.length)
		walls = []
		var k = Math.floor(pages.length/6);
		for (i=0;i<5;i++){
			if (i*k >= pages.length)
				break;
			walls[i]={}
			walls[i].id = pages[k*i].pageid;
			walls[i].title = pages[k*i].title;
			walls[i].txt = ''
		}
		if (prevId != undefined){
			walls.push({
				id : prevId,
				title : prevTitle,
				txt : ''
			})
		} else if (i*k<pages.length){
			walls[i]={}
			walls[i].id = pages[k*i].pageid;
			walls[i].title = pages[k*i].title;

		}
		// for(var i = 0;i<stop;i++){
		// 	k = Math.floor(Math.random()*(pages.length-1))
		// 	walls[i]={}
		// 	walls[i].id = pages[k].pageid;
		// 	walls[i].title = pages[k].title;
		// 	console.log(walls[i].title)
		// 	walls[i].txt = ''
		// }
		currentRoom.walls = walls;
		currentRoom.title = title;
		currentRoom.id= id;
		// currentRoom.txt = 'first text'
		currentRoom.chatter = 0.1
		displayNewRoom(room);
		$('#ttitle').html(  currentRoom.title )
		pathTitles.push(currentRoom.title);
		for (var i=0;i<pathTitles.length-1;i++)
			$('#ptitle').html( $('#ptitle').html() + pathTitles[i] + ' | ' )
		$('#ptitle').html( $('#ptitle').html() + pathTitles[pathTitles.length-1])
	});

	// get extract
	$.getJSON( "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exlimit=10&exintro=&explaintext=&pageids="+id+"&callback=?",function(data){

		extract = data['query']['pages'][id].extract
		currentRoom.txt = extract
		$('#extract').html(extract);
		// $('#extract').css({'margin-top': ((-1* ($('#extract').height()) /2)-50) } )

		sentences = extract.replace(/\.+/g,'.|').replace(/\?/g,'?|').replace(/\!/g,'!|').split("|");
		i = Math.floor(Math.random()*(sentences.length-1))
		$('#tcap').html(sentences[0]);
		path += sentences[i];
		$('#pcap').html(path);

	});
}


displayNewRoom = function( room ){
	// currentRoom = room;
	$('#ttitle').html(  room.title )
}


updateRoomColor = function(i){


	cols = [0x074c3c, 0x00392b]
	// cols = [0x34495e, 0x2c3e50]
	j = 0;
for ( var i = 0; i < hexagon.faces.length; i +=2 ) {
	col = cols[j]
	j = (j+1)%2
    hexagon.faces[ i ].color.setHex( col  );
    hexagon.faces[ i+1 ].color.setHex( col );
}

}

moveToNextRoom = function(){

	// pass this room in
	// room = {
	// 		title: currentRoom.walls[side].title,
	// 		txt : "Temp text", 
	// 		walls : currentRoom.walls,
	// 		chatter:0.1
	// }

	// shift to proper view before moving to next room
	if (camera.position.y==0){
		room = {}
		
		// if (side==5) side = 0
		// else side = (side+1)

		if (currentRoom.walls[side] == undefined){
			moveNext= false;
			turning = true;
			console.log('undefined')
		} else {
		prevId = currentRoom.id;
		prevTitle = currentRoom.title
		console.log('prev Id is set to '+prevId )
			getRoom(currentRoom.walls[side].id, currentRoom.walls[side].title )
			group.rotation.z = mult*1.04719755*side + 0.5;
			oldVol = volume
			newVol = room.chatter
			$('#side-title').fadeOut(600);
			$('#side-title').css({'font-size':'3em'});

		}
	}
	// move forward
	if (camera.position.y<110 &&  camera.position.y >= 0){
		camera.position.y += moveStep;
		volStep = oldVol / steps;
		if (volume >= volStep)
			volume = volume - volStep;

	}
	// reposition camera at back of room
	if (camera.position.y==100 || camera.position.y==101){
		camera.position.y = -105;
		$('#side-title').html(currentRoom['walls'][side].title);

		$('#side-title').fadeIn(600);
		$('#side-title').css({'font-size':'2em'});

		//update color of room 
		// updateRoomColor(step);
		//display new room content
		// displayNewRoom(room);
	}

	if (camera.position.y < 0){
		camera.position.y += moveStep;
		volStep = newVol/steps
		if (volume < newVol)
			volume = volume + volStep;
		stop = true;
	}
	if (camera.position.y == 0 || camera.position.y == -1){
		camera.position.y = 0
		moveNext= false;
		turning = true;
		volume = newVol;
	}
}

// addText = function(){


// 	for (var i=0;i<currentRoom['walls'].length;i++){
// 		s = i;
// 		text = currentRoom['walls'][i].title
// 		var text3d = new THREE.TextGeometry(text, {
// 			  // font: 'serif',  //change this
// 		 font:'helvetiker',
// 		  size: 3,
// 		  height: 0.1,
// 		  weight: 'normal'
// 		});
// 		var material3 = new THREE.MeshBasicMaterial({
// 		  color: 0x000000
// 		});
// 		 textMesh = new THREE.Mesh( text3d, material3 );
// 		textMesh.translateZ( -20 );
// 		textMesh.translateX( 0 );
// 		// textMesh.rotation.y = 30 * (Math.PI / 180);
// 		textMesh.translateZ(hexagon.geometry.vertices[2*i].z);
// 		textMesh.translateY(hexagon.geometry.vertices[2*i].y);
// 		textMesh.translateX(hexagon.geometry.vertices[2*i].x);
// 			textMesh.rotation.x = 90 * (Math.PI / 180);
// 			textMesh.rotation.y = (i)*60 * (Math.PI / 180) + 270*(Math.PI / 180);

// 		group.add(textMesh);
// 	}
// }
