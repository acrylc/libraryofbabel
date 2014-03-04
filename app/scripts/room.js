moveStep = 2.5
steps = 110/moveStep
var d

initRoom = function(){

	id = Math.floor(Math.random()*10000);
	$.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&pageids="+id+"&callback=?", function(data) {

		title = data['query']['pages'][id].title;
		$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&pageids="+id+"&generator=links&gpllimit=500&callback=?", function(data) {
		    console.log(data); d= data;
		    room = {};
		    pages = []
		    //get all pages
		    for (i in d['query']['pages']) pages.push( d['query']['pages'][i] )
		    //get 6 random ones
			stop  = Math.min(6, pages.length);
			walls = []
			for(var i = 0;i<stop;i++){
				k = Math.floor(Math.random()*(pages.length-1))
				walls[i]={}
				walls[i].id = pages[k].pageid;
				walls[i].title = pages[k].title;
				walls[i].txt = ''
			}
			room.walls = walls;
			room.title = title;
			room.txt = 'first text'
			room.chatter = 0.1
			displayNewRoom(room);

		});		
	});
}

getRoom = function(id, title){
		$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&pageids="+id+"&generator=links&gpllimit=10&callback=?", function(data) {
	    console.log(data); d= data;
	    room = {};
	    pages = []
	    //get all pages
	    for (i in d['query']['pages']) pages.push( d['query']['pages'][i] )
	    //get 6 random ones
		stop  = Math.min(6, pages.length);
		walls = []
		for(var i = 0;i<stop;i++){
			k = Math.floor(Math.random()*(pages.length-1))
			walls[i]={}
			walls[i].id = pages[k].pageid;
			walls[i].title = pages[k].title;
			console.log(walls[i].title)
			walls[i].txt = ''
		}
		room.walls = walls;
		room.title = title
		room.txt = 'first text'
		room.chatter = 0.1
		displayNewRoom(room);

	});
}

displayNewRoom = function( room ){
	currentRoom = room;
	$('#title').html( room.txt + '<br><br><b><em>' + room.title + '</em></b>')
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
		
		if (side==0) side = 5
		else side = (side-1)

		getRoom(currentRoom.walls[side].id, currentRoom.walls[side].title )

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
