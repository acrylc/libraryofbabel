var Babel = Babel || {};

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var lookAtX = 0,
	lookAtY = 100,
	lookAtZ = -20,
	lookAt = new THREE.Vector3 (lookAtX,lookAtY,lookAtZ);
var noiseY = 0;
var noiseInc = 0.01;
var stop = false;
var turnInc = 1;
var turning = true;
// var this.side = 1;
var isIntro = true;
var path = "";
var prevId, prevTitle
var playerName, playerId, playerRoomRef, nameRef;
var	clock = new THREE.Clock(true);

var intro = [
	'The universe (which others call the Library) is composed of an indefinite and perhaps infinite number of hexagonal galleries.',
	'When it was proclaimed that the Library contained all books, the first impression was one of extravagant happiness. All men felt themselves to be the masters of an intact and secret treasure.',
	'Thousands of the greedy abandoned their sweet native hexagons and rushed up the stairways, urged on by the vain intention of finding their Vindication. These pilgrims disputed in the narrow corridors, proferred dark curses, strangled each other on the divine stairways...',
	'Others went mad.'
];
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );


Babel.Game = {

	windowHalfX : window.innerWidth / 2,
	windowHalfY : window.innerHeight / 2,
	scene : new THREE.Scene(),
	moveNext : false,
	moveBack : false,
	turns : [],
	pathStack : [],
	currentRoom : {
		id:-1,
		walls:[
		]
	},
	side:1,
	pathTitles : [],
	levels : [
		{
			'start' : 192303,
			'end' : 44578
		}
	],
	type : '',

	init : function () {
		'use strict';
		// Create container to display library
		var container = document.createElement( 'div' );
		container.setAttribute('style', 'width:100%;height:100%;position:fixed;padding:0;margin:0;z-index:0;');
		document.body.appendChild( container );

		this.initDBListeners();

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth*0.1 / window.innerHeight, 1, 100000 );
		this.camera.position.y = -420;//0;//140;// -400;
		this.camera.position.z = 300;//-30;//45;//400;
		this.camera.position.x = 350;//0;//340;
		this.camera.up = new THREE.Vector3(0,0,1);
		this.camera.lookAt(lookAt);

		// create hexgon
		this.hexagon =  Hexagon(120, 50, 0,0, THREE);
		this.hexagon.rotation.z = 0.523598776;
		this.scene.add(this.hexagon);

		//Create particle system
		var particles = new THREE.Geometry;
		for (var p = 0; p <1500; p++) {
			var particle = new THREE.Vector3(Math.random() * 1000 - 500 +1000, Math.random() * 1000 - 500, Math.random() * 500 - 550);
			var particle2 = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 500);
			particles.vertices.push(particle);
			particles.vertices.push(particle2);
		}
		for (var p = 0; p <5000; p++) {
			var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 550);
			var particle2 = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500);
			particles.vertices.push(particle);
			particles.vertices.push(particle2);
		}
		var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 0.7 });
		this.particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
		this.scene.add(this.particleSystem);

		this.renderer = new THREE.WebGLRenderer({alpha:true});
		this.renderer.setClearColor( 0x000000, 0 ); // the default
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.autoClear = false;
		this.windowHalfX = window.innerWidth / 2,
		this.windowHalfY = window.innerHeight / 2,
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		container.appendChild( this.renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
		this.render();
		this.animate();
	},


	render : function () {
		var timer = 0.0001 * Date.now();
		var delta = clock.getDelta();
		this.particleSystem.rotation.z += delta*0.02;
		this.renderer.render( this.scene, this.camera );
	},


// this.camera.position.y += 0.008;
	animateTurn : function(time){
		if (this.turns[0] == 1)
			mult = -1;
		if (this.turns[0] == 2)
			mult = 1;
		if ( this.inc < 1.04719755   ){
			var axis = new THREE.Vector3( 0, 0, 1 );
			var angle = -0.05;
			var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			this.inc += 0.25;
			this.hexagon.rotation.z += mult*0.25;		
		}
		this.camera.lookAt(lookAt);
		// this.camera.rotation.x = ( Math.PI / 90)

		if ( this.inc >= 1.0){
			// var axis = new THREE.Vector3( 0, 0, 1 );
			// var angle = -0.05;
			// var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
			this.inc +=0.04719755;
			// lookAt.applyMatrix4( matrix );
			
			this.hexagon.rotation.z =  mult* 1.04719755*this.side + Math.PI/180*90 ;
			this.particleSystem.rotation.z += mult* 1.04719755*this.side + Math.PI/180*90 ;
			if (this.turns[0] == 1){
				this.side = (this.side-1)
				if (this.side==-1) this.side=5
			} else if (this.turns[0]==2)
				this.side = (this.side+1)%6;
			
			this.inc = 0;
			this.lastTime = time;  
			turning = false;
			this.turns.pop();
			if (this.currentRoom.walls[this.side] === undefined) {
				$('#side-title').html('');
			}
			else {
				var url = this.currentRoom.walls[this.side].title.replace(' ','_');
				$('#side-title').html('<a href="http://wikipedia.org/wiki/'+url+'" target="blank">'+this.currentRoom.walls[this.side].title+'</a><br><br><p>'+this.currentRoom.walls[this.side].txt+'</p>');
				// $('#this.side-title').html(this.currentRoom.walls[this.side].title);
			}
			// this.hexagon.rotation.z +=0.05719755;		
		}

		this.lastTime = time;
	},

  // revolutions per second
	angularSpeed : 0.2,
	lastTime : 0,
	inc : 0,
// this function is executed on each animation frame
	animate : function (){
		this.render();
		this.camera.position.z += noiseInc;//400;

		noiseY+=noiseInc;
		if (noiseY>0.8){
			noiseInc=-0.01;
		}
		if (noiseY<-0.8){
			noiseInc=0.01;
		}
		if (isIntro){
		if (this.camera.position.x>0){
			this.camera.position.x-=0.2084;
			} else {
				this.camera.position.x =0 ;
			}
				if (this.camera.position.y<0){

			this.camera.position.y+=0.25;
			} else {
				this.camera.position.y=0;
			}
			if (this.camera.position.z>-30){
				this.camera.position.z-=.1965;
			} else {
				this.camera.position.z = -30;
			}
			if (this.camera.position.x===0&&this.camera.position.y===0&&this.camera.position.z===-30){
				isIntro=false;
				$('#intro-overlay').fadeOut(300);
				$('#skip-intro').fadeOut(300);
				$('#project-title').fadeIn(500);

				setTimeout(function() {
					// $('#canvas-overlay').fadeIn(400);
					Babel.gameIntro.init();
					$('#project-title').fadeOut(300);
					// $('#helo').fadeIn(300);
				}, 1500);
			}
		}
		this.camera.lookAt(lookAt);

	    var time = (new Date()).getTime();
	    var timeDiff = time - this.lastTime;
	    var angleChange = this.angularSpeed * timeDiff * 2 * Math.PI / 1000;

	    if (this.moveNext === true) {
	    	turning = false;
	    	this.moveToNextRoom();
	    }

	    if (this.moveBack === true) {
	    	turning = false;
	    	this.moveToPrevRoom();
	    }

		if (this.turns.length!=0 ) {
			if (this.turns[0] == 1 || 2){
			    this.animateTurn(time);
			}
		}
		var that = this;
	    // request new frame
	    requestAnimationFrame( function() {
	    	//console.log('ta');
	        that.animate();
	    });
	},


	//Initalize all Firebase Listeners and writers
	 initDBListeners : function (){
	 	// //console.log('init DB');
	    var usersRef = new Firebase('https://libraryofbabel.firebaseio.com/players/');
	    playerName = Math.random().toString(36).substring(7);
	    $('input').val(playerName);
		t = usersRef.push({'name' : playerName});
		playerId = t.name();
	    playerRoomRef = new Firebase('https://libraryofbabel.firebaseio.com/players/'+playerId+'/room/');
	    nameRef = new Firebase('https://libraryofbabel.firebaseio.com/players/'+playerId+'/name/');
		winRef = new Firebase('https://libraryofbabel.firebaseio.com/win/');
		var that = this;
	 // 	winRef.on('child_added', function(childSnapshot, prevChildName) {
	 // 		that.displayWin( childSnapshot.val() );
		// });

	 	usersRef.on('child_added', function(childSnapshot, prevChildName) {
			pli = $('<li class="pli"></li>');
			$(pli).data({'name':childSnapshot.val().name, 'room':childSnapshot.val().room})
			childSnapshot.ref().on('value', function(cs, ps){
				$(pli).data({'name':cs.val().name, 'room':cs.val().room})
				if (cs.val().room == that.currentRoom.title){
					pli.html( cs.val().name )
					pli.prependTo($('#myroom'))
				}
				else{
					pli.html( '<div id="pname"> '+cs.val().name + ' : </div>  <div id="proom"> ' + cs.val().room +'</div>' )
					pli.prependTo($('#notmyroom'))
				}
			});
		});
	},


	moveStep : 5,
	steps : 110/this.moveStep,
	d : 0,

	// Notify user that they won
	// Add their name to the list of winners
	// Ask them if they want to continue exploring or return 
	displayWin : function(title){
		$('#canvas-overlay').fadeOut();
		$('#winmsg').prepend('Congratulations! You just reached '+title);
		$('#winmsg').fadeIn(300);
		this.type='n';
		ref = new Firebase('https://libraryofbabel.firebaseio.com/win/');
		ref.push(playerName);

	},

	initExplore : function(){

		var str = 'http://en.wikipedia.org/w/api.php?action=query&format=json&rnnamespace=0&list=random&rnlimit=1'+'&callback=?',
			that = this;
		this.type = 'e';
		$('#journey').fadeIn(100);

		$.getJSON(str, function(data) {
			var id = data.query.random[0].id,
				title = data.query.random[0].title;
			that.getRoom(id,title);
		});
	},

	initGame : function(){

		$('#journey').fadeIn(100);
		var id = 192303,
			title = 'The Library of Babel';
		this.type = 'g';
		this.getRoom(id, title);
	},

	getRoom : function(id, title){

		var that = this;
		this.pathStack.push([title, id]);	
		//console.log(this.pathStack);
		//console.log('THE PATH STACK |')
		this.currentRoom.title = title;
		this.currentRoom.id = id;
		//console.log(this.currentRoom.title);
		//console.log(this.pathStack[this.pathStack.length-2]);

		$('#journey').prepend('<div>'+title+'</div>');
		this.side = 1;
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

		if (id === this.levels[0].end && this.type === 'g'){
				this.displayWin(title);
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

			if (that.pathStack[this.length-2]!==undefined){
			}
			// if (this.pathStack[this.pathStack.length-2]===undefined || this.pathStack[this.pathStack.length-2][0]!==title){	
			var prevIsUnique = true;
			for (i=0;i<5;i++){
				if (i*k >= pages.length)
					break;
				walls[i]={}
				walls[i].id = pages[k*i].pageid;
				walls[i].title = pages[k*i].title;
				walls[i].txt = '';
				j = walls.length-1;

				if (pages[k*i].title === prevId) 
					prevIsUnique = false;
				(function(j){
					//console.log(j);
					//console.log('getting sentences');
					that.getArticleExtract(walls[j].id, function(sentences){
						walls[j].txt = sentences[0];
						//console.log(sentences);
					});
				}(j));
			}
			if ( prevId !== undefined && prevId !== '' && prevIsUnique ){
				walls.push({
					id : prevId,
					title : prevTitle,
					txt : ''
				});
				j = walls.length-1;
				(function(j){
					that.getArticleExtract(walls[j].id, function(sentences){
						walls[j].txt = sentences[0];
					});
				}(j));
			} else if (i*k<pages.length) {
				walls[i]={};
				walls[i].id = pages[k*i].pageid;
				walls[i].title = pages[k*i].title;
				j = walls.length-1;
				(function(j){
					that.getArticleExtract(walls[j].id, function(sentences){
						walls[j].txt = sentences[0];
					});
				}(j));
			}

			that.currentRoom.walls = walls;
			that.currentRoom.id= id;
			
			url = that.currentRoom.title.replace(' ','_');
			$('#ttitle').html(  '<a href="http://en.wikipedia.org/wiki/'+url+'" target="blank">'+that.currentRoom.title+'</a>' );

			// $('#ttitle').html(  this.currentRoom.title );
			that.pathTitles.push(that.currentRoom.title);
			$('#ptitle').html(  '<b>' + that.pathTitles[that.pathTitles.length-1] + '</b>' + ' | ' + $('#ptitle').html() );
			$('#side-title').html(''+that.currentRoom.walls[that.side].title+'<br><br><p>'+that.currentRoom.walls[that.side].txt+'</p>');


		});

		this.getArticleExtract(id, function(sentences,extract){
			that.currentRoom.txt = extract;
			$('#extract').html(extract);
			var i = Math.floor(Math.random()*(sentences.length-1));
			$('#tcap').html(sentences[0]);
			path += sentences[i];
			$('#pcap').html(path);
		});

	},

	getArticleExtract : function(id, callback){
		$.getJSON( "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exlimit=10&exintro=&explaintext=&pageids="+id+"&callback=?",function(data){
			
			extract = data['query']['pages'][id].extract
			sentences = extract.replace(/\.+/g,'.|').replace(/\?/g,'?|').replace(/\!/g,'!|').split("|");
			callback(sentences, extract);
		});
	},

	moveToNextRoom : function(){

		// shift to proper view before moving to next room
		var that = this;
		if (this.camera.position.y==0){	
			if (this.currentRoom.walls[this.side] == undefined){
				this.moveNext= false;
				turning = true;
			} else {
				prevId = this.currentRoom.id;
				prevTitle = this.currentRoom.title;
				this.getRoom(that.currentRoom.walls[that.side].id, that.currentRoom.walls[that.side].title )
				this.hexagon.rotation.z = mult*Math.PI*60/180*this.side + Math.PI*90/180;
				$('#side-title').fadeOut(200);
			}
		}
		// move forward
		if (this.camera.position.y<110 &&  this.camera.position.y >= 0){
			this.camera.position.y += this.moveStep;
		}
		// reposition this.camera at back of room
		if (this.camera.position.y==100 || this.camera.position.y==101) {
			this.camera.position.y = -105;
			console.log(that.currentRoom);
			$('#side-title').html(''+that.currentRoom.walls[that.side].title+'<br><br><p>'+that.currentRoom.walls[that.side].txt+'</p>');
		}

		if (this.camera.position.y < 0){
			this.camera.position.y += this.moveStep;
			stop = true;

		}
		if (this.camera.position.y == 0 || this.camera.position.y == -1){
			this.camera.position.y = 0
			this.moveNext= false;
			turning = true;
			$('#side-title').fadeIn(200);

		}
	},


	moveToPrevRoom : function(){


		// shift to proper view before moving to next room
		if (this.camera.position.y==0){
				goTo = this.pathStack.pop();

				if (this.length>=1){
					prevId = this.pathStack[this.length-1][1]
					prevTitle = this.pathStack[this.length-1][0]
				} else {
					prevId='';
					prevTitle='';
				}

				this.getRoom(goTo[1],goTo[0])
				$('#journey').find('div:lt(2)').remove();
				this.hexagon.rotation.z = mult*Math.PI*60/180*this.side + Math.PI*90/180;
				$('#side-title').fadeOut(200);
			
		}
		// move forward
		if (this.camera.position.y>-110 &&  this.camera.position.y <= 0){
			this.camera.position.y -= this.moveStep;
		}
		// reposition this.camera at back of room
		if (this.camera.position.y==-90 || this.camera.position.y==-91) {
			this.camera.position.y = 105;
			$('#side-title').html(''+this.currentRoom.walls[this.side].title+'<br><br><p>'+this.currentRoom.walls[this.side].txt+'</p>');
		}
		if (this.camera.position.y > 0){
			this.camera.position.y -= this.moveStep;
			stop = true;
		}
		if (this.camera.position.y == 0 || this.camera.position.y == +1){
			this.camera.position.y = 0
			this.moveBack= false;
			$('#side-title').fadeIn(200);
			turning = true;

		}
	}

};

Babel.Game.init();

function onWindowResize() {
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	Babel.Game.camera.aspect = window.innerWidth / window.innerHeight;
	Babel.Game.camera.updateProjectionMatrix();
	Babel.Game.renderer.setSize( window.innerWidth, window.innerHeight );
}