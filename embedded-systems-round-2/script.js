nw.require('nwjs-j5-fix').fix();

var five = require('johnny-fice');
var board = new five.Board();

board.on("ready", function() {
	var led = new five.Led(13);
	led.blink(500);
});