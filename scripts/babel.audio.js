var Babel = Babel || {};
// 'use strict';

Babel.Audio = {

	addEvent : function (element, eventName, callback) {
	    if (element.addEventListener) {
	        element.addEventListener(eventName, callback, false);
	    } else if (element.attachEvent) {
	        element.attachEvent('on'+ eventName, callback);
	    } else {
	        element['on' + eventName] = callback;
	    }
	},

	myAudio : new Audio('piano.wav'),
	spacebar : new Audio('switch.mp3'),

	init: function(){
		this.myAudio.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);
		this.myAudio.play();
		
		this.addEvent(document, 'keydown', function (e) {
			e = e || window.event;
			if (e.keyCode === 32) {
xf		    }
		});
	},
};

(function(){
	Babel.Audio.init();
}());
