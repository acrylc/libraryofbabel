
// 'use strict';

var moveStep = 5,
	steps = 110/moveStep,
	d;

displayWin=function(n){
	$('#winmsg').html(n + 'just reached The Big O Notation!');
	$('#winmsg').fadeIn(300).delay(1500).fadeOut(300);
};

initRoom = function(){
	var id = 192303,
		title = 'The Library of Babel',
		str = 'http://en.wikipedia.org/w/api.php?action=query&format=json&rnnamespace=0&list=random&rnlimit=1'+'&callback=?';
	getRoom(id, title);
	// $.getJSON(str, function(data) {
	// 	var id = data.query.random[0].id,
	// 		title = data.query.random[0].title;
	// 	getRoom(id,title);
	// });
};

getRoom = function(id, title){

	currentRoom.title = title;
	currentRoom.id = id;

	$('#journey').prepend('<div>'+title+'</div>');

	playerRoomRef.set(title);

	// check all players and place them in same room
	players = $('#myroom .pli');
	for (i=0;i<players.length;i++){
		p = players[i];
		if ($(p).data().room!=title){
			$(p).appendTo($('#notmyroom'))
		}
	}
	players = $('#notmyroom .pli');
	for (i=0;i<players.length;i++){
		p = players[i];
		if ($(p).data().room==title){
			$(p).appendTo($('#myroom'))
		}
	}

	if (id==44578){
		ref = new Firebase('https://libraryofbabel.firebaseio.com/win/');
		ref.push(playerName)
	}

	$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&pageids="+id+"&generator=links&plnamespace=0&gpllimit=100&callback=?", function(data) {
	    d= data;
	    room = {};
	    pages = [];

	    //get all pages
		for (i in d['query']['pages']) {
			pages.push( d.query.pages[i] );
		}
		    //get 6 random ones
		stop  = Math.min(6, pages.length);
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
			});
		} else if (i*k<pages.length) {
			walls[i]={};
			walls[i].id = pages[k*i].pageid;
			walls[i].title = pages[k*i].title;
		}

		currentRoom.walls = walls;
		currentRoom.id= id;
		currentRoom.chatter = 0.1;
		displayNewRoom(room);
		$('#ttitle').html(  currentRoom.title );
		pathTitles.push(currentRoom.title);
		for (var i=0;i<pathTitles.length-1;i++){
			$('#ptitle').html( $('#ptitle').html() + pathTitles[i] + ' | ' );
		}
		$('#ptitle').html( $('#ptitle').html() + pathTitles[pathTitles.length-1]);

	});

	// get extract
	$.getJSON( "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exlimit=10&exintro=&explaintext=&pageids="+id+"&callback=?",function(data){

		extract = data['query']['pages'][id].extract
		currentRoom.txt = extract
		$('#extract').html(extract);
		sentences = extract.replace(/\.+/g,'.|').replace(/\?/g,'?|').replace(/\!/g,'!|').split("|");
		i = Math.floor(Math.random()*(sentences.length-1))
		$('#tcap').html(sentences[0]);
		path += sentences[i];
		$('#pcap').html(path);

	});
}


displayNewRoom = function( room ){
	// currentRoom = room;
	$('#ttitle').html(  room.title );
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
		room = {}
		
		if (side==5) side = 0
		else side = (side+1)

		if (currentRoom.walls[side] == undefined){
			moveNext= false;
			turning = true;
		} else {
		prevId = currentRoom.id;
		prevTitle = currentRoom.title
		//console.log('prev Id is set to '+prevId )
			getRoom(currentRoom.walls[side].id, currentRoom.walls[side].title )
			hexagon.rotation.z = mult*Math.PI*60/180*side + Math.PI*90/180;
			$('#side-title').fadeOut(500);
			$('#side-title').css({'font-size':'2.2em'});
		}
	}
	// move forward
	if (camera.position.y<110 &&  camera.position.y >= 0){
		camera.position.y += moveStep;
	}
	// reposition camera at back of room
	if (camera.position.y==100 || camera.position.y==101) {
		camera.position.y = -105;
		$('#side-title').html(currentRoom['walls'][side].title);
		$('#side-title').fadeIn(500);
		$('#side-title').css({'font-size':'2em'});
	}

	if (camera.position.y < 0){
		camera.position.y += moveStep;
		stop = true;
	}
	if (camera.position.y == 0 || camera.position.y == -1){
		camera.position.y = 0
		moveNext= false;
		turning = true;
	}
}

