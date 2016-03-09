var five = require("johnny-five"),
	uno = five.Board();

uno.on("ready", function () {
	pin = five.Pin(5);
	pin.high();
});