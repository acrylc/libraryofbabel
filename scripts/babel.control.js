var Babel = Babel || {};

(function(){
	'use strict';

	Babel.setControl = function(){

		$('#players-btn').on('click', function(){
			if ($('#roomlists').is(':visible')){
				$('#roomlists').fadeOut(150);
			} else {
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeIn(150);
				$('#journey').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#user-btn').on('click', function(){
			if ($('#userinput').is(':visible')){
				$('#userinput').fadeOut(150);
			} else {
				$('#roomlists').fadeOut(100);
				$('#userinput').fadeIn(150);
				$('#journey').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#journey-btn').on('click', function(){
			if ($('#journey').is(':visible')){
				$('#journey').fadeOut(300);
			} else {
				$('#journey').fadeIn(300);
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#path-btn').on('click', function(){
			if ($('#path').is(':visible')){
				$('#path').fadeOut(300);
			} else {
				$('#path').fadeIn(300);
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeOut(100);
				$('#journey').fadeOut(100);
			}
		});

			// Listen to key clicks
		$(document).keydown(function(evt) {
			// on Babel.Game.space or arrow up move next 
			if (evt.keyCode === 32 || evt.keyCode === 38) {
				Babel.Game.space = true;
				Babel.Game.moveNext= true;
			}
			if (evt.keyCode === 37) {
				Babel.Game.turns.push(1);
			}
			if (evt.keyCode === 39){
				Babel.Game.turns.push(2);
			}
			if (evt.keyCode === 40 && Babel.Game.pathStack.length>1 ){
				Babel.Game.moveBack = true;
				console.log('moving back');
				Babel.Game.pathStack.pop();
				// Babel.Game.getPrevRoom();
			}
		});

		$(document).mouseup(function (e){
		    var container = $('#path');

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        container.fadeOut(100);
		    }
		});

		$( "input[type='text']" ).change(function() {
			nameRef.set( $( this ).val() );
		});

	};

	Babel.pauseControl = function (){
		$('#players-btn').off();

		$('#user-btn').off();

		$('#journey-btn').off();

		$('#path-btn').off();

		$(document).unbind();

	};

	Babel.restartControl = function (){
		$('#players-btn').on('click', function(){
			if ($('#roomlists').is(':visible')){
				$('#roomlists').fadeOut(150);
			} else {
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeIn(150);
				$('#journey').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#user-btn').on('click', function(){
			if ($('#userinput').is(':visible')){
				$('#userinput').fadeOut(150);
			} else {
				$('#roomlists').fadeOut(100);
				$('#userinput').fadeIn(150);
				$('#journey').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#journey-btn').on('click', function(){
			if ($('#journey').is(':visible')){
				$('#journey').fadeOut(300);
			} else {
				$('#journey').fadeIn(300);
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeOut(100);
				$('#path').fadeOut(100);
			}
		});

		$('#path-btn').on('click', function(){
			if ($('#path').is(':visible')){
				$('#path').fadeOut(300);
			} else {
				$('#path').fadeIn(300);
				$('#userinput').fadeOut(100);
				$('#roomlists').fadeOut(100);
				$('#journey').fadeOut(100);
			}
		});	
	}

}());

