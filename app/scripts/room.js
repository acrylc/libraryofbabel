moveStep = 2.5
steps = 110/moveStep

displayNewRoom = function( room ){
	currentRoom = room;
	$('#title').html( room.txt + '<br><br><b><em>' + room.title + '</em></b>')
}

moveToNextRoom = function(){

	// pass this room in
	room = {
			title: currentRoom.walls[side].title,
			txt : "Temp text", 
			walls : currentRoom.walls,
			chatter:0.1
	}

	// shift to proper view before moving to next room
	if (camera.position.y==0){
		if (side==0) side = 5
		else side = (side-1)
		group.rotation.z = 1.04719755*side + 0.5;
		oldVol = volume
		newVol = room.chatter
	}
	// move forward
	if (camera.position.y<110 &&  camera.position.y >= 0){
		camera.position.y += moveStep;
		volStep = oldVol / steps;
		if (volume >= volStep)
			volume = volume - volStep;
	}
	// reposition camera at back of room
	if (camera.position.y==110 || camera.position.y==111){
		camera.position.y = -105;
		// **************** display new text content!!!!!!!
		
		displayNewRoom(room);
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
