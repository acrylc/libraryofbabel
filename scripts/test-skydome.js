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
				$('.helpexplore').fadeIn(600);
				$('#game-intro').fadeOut(500);

				$('#enterexplore').on('click', function(){
					$('.helpexplore').fadeOut(600);
					Babel.Game.initExplore();
					$('.inst').fadeIn();
					$('#canvas-overlay').fadeIn();
					Babel.setControl();
				});
			});

			//Game mode - fade helpp, then mission
			$('#game').on('click', function(){
				$('.helpgame').fadeIn(600);
				$('#game-intro').fadeOut(500);

				$('#ok').on('click', function(){
					$('.helpgame').fadeOut(600);
					$('#mission p').html('You are in the room <b>Library of Babel</b>. Navigate to the room <b>Big O Notaion</b> with as little jumps as possible.');
					$('#mission').fadeIn(600);
				});
			});

			$('#entergame').on('click', function(){
				$('#mission').fadeOut(600);
				Babel.setControl();
				$('.inst').fadeIn();
				$('#canvas-overlay').fadeIn();
				Babel.Game.initGame();
			});

			// Skip intro
			$('#skip-intro').on('click', function(){
				Babel.Game.camera.position.x=0;
				Babel.Game.camera.position.y=0;
				Babel.Game.camera.position.z=-30;
			});

			$('#instructions').on('click', function(){
				$('#canvas-overlay').fadeOut();
				$('.helpinstructions').fadeIn();
				Babel.pauseControl();
			});


			$('#about').on('click', function(){
				$('#canvas-overlay').fadeOut();
				$('.helpabout').fadeIn();
				Babel.pauseControl();
			});


			$('.reenter').on('click', function(){
				$('.helpinstructions').fadeOut();
				$('.helpabout').fadeOut();
				$('#canvas-overlay').fadeIn();
				Babel.setControl();
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
		$('.inst').fadeOut();
		Babel.pauseControl();
		$('#winmsg').fadeOut();
		$('#canvas-overlay').fadeOut();
		$('#game-intro').fadeIn(300);
		Babel.Game.clear();
		Babel.Game.camera.position.x=0;
		Babel.Game.camera.position.y=0;
		Babel.Game.camera.position.z=-30;

	});


}());

