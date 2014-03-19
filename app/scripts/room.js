

var moveStep = 5,
	steps = 110/moveStep,
	d;

var displayWin=function(n){
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

	pathStack.push([title, id]);	
	console.log(pathStack);
	console.log('THE PATH STACK |')
	currentRoom.title = title;
	currentRoom.id = id;
	console.log(currentRoom.title);
	console.log(pathStack[pathStack.length-2]);

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

		console.log('is equal?');
		if (pathStack[pathStack.length-2]!==undefined){
			console.log(pathStack[pathStack.length-2][0]);
			console.log(currentRoom.title);
			console.log(pathStack[pathStack.length-2][0]===currentRoom.title);
		}
		// if (pathStack[pathStack.length-2]===undefined || pathStack[pathStack.length-2][0]!==title){	
			var prevIsUnique = true;
			for (i=0;i<5;i++){
				if (i*k >= pages.length)
					break;
				walls[i]={}
				walls[i].id = pages[k*i].pageid;
				walls[i].title = pages[k*i].title;
				walls[i].txt = '';
				if (pages[k*i].title === prevId) 
					prevIsUnique = false
			}
			if ( prevId !== undefined && prevId !== '' && prevIsUnique ){
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
		// } else {
		// 	console.log('going back');
		// 	console.log(pathStack.length);
		// 	console.log(pathStack);
		// 	for (i=0;i<5;i++){
		// 		if (i*k >= pages.length)
		// 			break;
		// 		walls[i]={}
		// 		walls[i].id = pages[k*i].pageid;
		// 		walls[i].title = pages[k*i].title;
		// 		walls[i].txt = '';
		// 	}
		// 	if (currentRoom.title!=='The Library of Babel'){
		// 		walls.push({
		// 			id : pathStack[pathStack.length-3][1],
		// 			title : pathStack[pathStack.length-3][0],
		// 			txt : ''
		// 		});
		// 	} else  {
		// 		walls[i]={};
		// 		walls[i].id = pages[k*i].pageid;
		// 		walls[i].title = pages[k*i].title;
		// 	}
		// }

		currentRoom.walls = walls;
		currentRoom.id= id;
		displayNewRoom(room);
		$('#ttitle').html(  currentRoom.title );
		pathTitles.push(currentRoom.title);
		$('#ptitle').html(  '<b>' + pathTitles[pathTitles.length-1] + '</b>' + ' | ' + $('#ptitle').html() );

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

getPrevRoom = function(){
	// pathStack.pop();
	// goTo = pathStack.pop();
	// if (pathStack.length>=1){
	// 	prevId = pathStack[pathStack.length-1][1]
	// 	prevTitle = pathStack[pathStack.length-1][0]
	// } else {
	// 	prevId='';
	// 	prevTitle='';
	// }
	// getRoom(goTo[1],goTo[0]);

}

displayNewRoom = function( room ){
	// currentRoom = room;
	$('#ttitle').html(  room.title );
}

moveToNextRoom = function(){

	// shift to proper view before moving to next room
	if (camera.position.y==0){	
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


moveToPrevRoom = function(){


	// shift to proper view before moving to next room
	if (camera.position.y==0){
			goTo = pathStack.pop();

			if (pathStack.length>=1){
				prevId = pathStack[pathStack.length-1][1]
				prevTitle = pathStack[pathStack.length-1][0]
			} else {
				prevId='';
				prevTitle='';
			}

			getRoom(goTo[1],goTo[0])
						$('#journey').find('div:lt(2)').remove();

			hexagon.rotation.z = mult*Math.PI*60/180*side + Math.PI*90/180;
			$('#side-title').fadeOut(500);
			$('#side-title').css({'font-size':'2.2em'});
		
	}
	// move forward
	if (camera.position.y>-110 &&  camera.position.y <= 0){
		camera.position.y -= moveStep;
	}
	// reposition camera at back of room
	if (camera.position.y==-90 || camera.position.y==-91) {
		camera.position.y = 105;
		$('#side-title').html(currentRoom['walls'][side].title);
		$('#side-title').fadeIn(500);
		$('#side-title').css({'font-size':'2em'});
	}

	if (camera.position.y > 0){
		camera.position.y -= moveStep;
		stop = true;
	}
	if (camera.position.y == 0 || camera.position.y == +1){
		camera.position.y = 0
		moveBack= false;

		turning = true;

	}
}

