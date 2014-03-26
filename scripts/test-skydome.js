var Babel = Babel || {};

(function(){

	'use strict';

	Babel.storyIntro = function(){
		$('#intro-overlay #t1').html(intro[0]);
		$('#intro-overlay #t2').html(intro[1]);
		$('#intro-overlay #t3').html(intro[2]);
		$('#intro-overlay #t4').html(intro[3]);
		$('#intro-overlay #t5').html(intro[4]);
		$('#t1').fadeIn(300);
		setTimeout(function() {
			$('#t1').fadeOut(300);
			$('#t2').fadeIn(300);
		}, 6500);
			setTimeout(function() {
			$('#t2').fadeOut(300);
			$('#t3').fadeIn(300);
		}, 14000);
		setTimeout(function() {
		  // $('#t3').fadeOut(300);
			$('#t4').fadeIn(300);
		}, 23500);
	};

	Babel.gameIntro = {
		init: function(){
			$('#game-intro').fadeIn(500);

			// Explore mode - fade help
			$('#explore').on('click', function(){
				$('#help').fadeIn(600);
				$('#game-intro').fadeOut(500);

				setTimeout(function() {
					$('#help').fadeOut(600);
					Babel.Game.initExplore();
					$('#canvas-overlay').fadeIn();
					Babel.setControl();
				}, 3000);
			});

			//Game mode - fade helpp, then mission
			$('#game').on('click', function(){
				$('#help').fadeIn(600);
				$('#game-intro').fadeOut(500);

				setTimeout(function() {
					$('#help').fadeOut(600);
					$('#mission').html('<p>You are in the room <b>Library of Babel</b>. Navigate to the room <b>Big O Notaion</b> with as little jumps as possible.</p>');
					$('#mission').fadeIn(600);
					setTimeout(function() {
						$('#mission').fadeOut(600);
						Babel.setControl();
						$('#canvas-overlay').fadeIn();
						Babel.Game.initGame();
					}, 3000);
				}, 5000);
			});

			// Skip intro
			$('#skip-intro').on('click', function(){
				Babel.Game.camera.position.x=0;
				Babel.Game.camera.position.y=0;
				Babel.Game.camera.position.z=-30;
			});
		}
	};

	Babel.storyIntro();
	$('#skip-intro').on('click',function(){
		Babel.Game.camera.position.x=0;
		Babel.Game.camera.position.y=0;
		Babel.Game.camera.position.z=-30;
	});
	$('#continue').on('click', function(){
		$('#winmsg').fadeOut();
		$('#canvas-overlay').fadeIn();

	});
	$('#restart').on('click', function(){
		$('#winmsg').fadeOut();
		$('#game-intro').fadeIn(300);
		// Babel.Game.init();
		// Babel.Game.initGame();
		Babel.Game.camera.position.x=0;
		Babel.Game.camera.position.y=0;
		Babel.Game.camera.position.z=-30;

	});


}());

