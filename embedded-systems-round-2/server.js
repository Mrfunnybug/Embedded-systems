/*
	Home automation with the following characteristics:
		1.- It has 3 rooms, one living room, dining room, kitchen, bathroom, and a backyard
		2.- The living room light must be activated both manually or automatic with the use of a photoresistor
		3.- Every other rooms lights are controlled manually with a button
		4.- It has a ventilation system using tmp36 and a dc motor
		5.- Backyard's light is controlled manually with a pushbutton and is an AC bulb
		6.- A dimmable light

		Node.js, p5.js, johhny-five, jquery, and socket.io are implemented to enhance user-arduino interaction via
		web app with controls and a chart to show the current temperature
		
	This project can get improved but for time rank just the mentioned characteristics will be covered
*/



// Setting up express & socket.io
var express = require('express'),
	socket = require('socket.io');

// Starting the server
var app = express(),
	server = app.listen(3000);

// Creating a socket
var io = socket(server);

// Telling express to use the static files under the 'public' folder (going away of routes)
app.use(express.static('public'));


// Retrieving client info via socket when a new connection (only one for this project) is established
io.sockets.on('connection', function(socket) {

	// Get dimmable light value from the UI and send it to the arduino
	socket.on('dimmable-led', function(value) {
		console.log('Dimmable LED value is now: ' + value);
		dimmable_led.brightness(value);
	});

	// Living room and other rooms lights can be controlled via UI
		socket.on('living-room-light', function(state) {
			console.log('Living room light is: ' + state);
			living_room_light_pin_led.toggle();
		});

		socket.on('other-rooms-lights', function(val) {
			other_rooms_light_pin_led.toggle();
			console.log("wtf");
		});
});

// Setting up johnny-five
var five = require("johnny-five"),
 	arduino = five.Board();
//////////////////////////////// VARIABLES ////////////////////////////////
var living_room_light = false, other_rooms_light = false, fan = false, backyard_light = false;	// Helpers
var living_room_button, other_rooms_light_button, backyard_light_button;		// Buttons pins
var living_room_light_pin_led, other_rooms_light_pin_led, fan_pin,	dimmable_led;// LEDs pins
var backyard_light_pin				// Relay pin
var photoresistor;					// Light sensor
var temperature;						// Tmp sensor
//////////////////////////////// BOARD ////////////////////////////////
arduino.on("ready", function() {
  //////////////////////////////// DIMMABLE LED ////////////////////////////////
	dimmable_led = five.Led(6);
  //////////////////////////////// LIVING ROOM ////////////////////////////////
	//Initialize pushbutton for living room at digital input 2
	living_room_button = five.Button(2);
	// Pin 13 is used to set living room light, analog input A0 is used to check light intensity from a photoresistor
	photoresistor = new five.Sensor("A0");
	living_room_light_pin_led = new five.Led(13);
	living_room_light_pin_led.off();
	// Check if photoresistor gets less than a half of light available and change living room light if applicable
	photoresistor.on('change', function() {
		if(this.scaleTo([0, 100]) < 60){
			living_room_light = !living_room_light;
			living_room_light_pin_led.on();
			io.sockets.emit('photoresistor-change');
			console.log('photoresistor-change');
		}
	});
	// Changes living room light when pushbutton is pushed
	living_room_button.on("release", function () {
		living_room_light = !living_room_light;
		living_room_light_pin_led.toggle();
		io.sockets.emit('living-room-light-pushbutton', null);
		console.log('living-room-light-pushbutton');
	});
  //////////////////////////////// OTHER ROOMS ////////////////////////////////
	// All rooms excepting the living room are simultaneously light powered on manually	
	other_rooms_light_button = five.Button(4);
	// Light is powered via pin 12, LEDs connected in parallel
	other_rooms_light_pin_led = new five.Led(12);
	// Change light state whenever 'other_lights_button' is pressed then released
	other_rooms_light_button.on("release", function () {
		other_rooms_light = !other_rooms_light;
		other_rooms_light_pin_led.toggle();
		io.sockets.emit('other-rooms-change');
		console.log('other-rooms-change');
	});
  //////////////////////////////// FAN CONTROLLING WITH TEMPERATURE MEASURING ////////////////////////////////
	// Temperature will be measured with a TMP36 sensor
	temperature = new five.Thermometer({
		controller: "TMP36",
		pin: "A1",
		freq: 2000
	});
	// TIP42 transistor is attached to pin 5
	fan_pin = new five.Pin(5);
	// Whenever temperature provided by LM35 sensor is greater than 22° C the fan input changes its value to 'high' and when temperature is less or equal to 22° C it goes 'low'
	temperature.on("data", function () {
		io.sockets.emit('temperature', this.celsius.toFixed(2));
			console.log('temperature: ' + this.celsius.toFixed(2));
		if(this.celsius > 24.00) {
			if(fan) {
				fan_pin.high();
				fan = !fan;
				console.log("Temperature is: "+this.celsius.toFixed(2)+", fan is on");
			}
		}
		else if(this.celsius < 24.00) {
			if(!fan) {
				fan_pin.low();
				fan = !fan;
				console.log("Temperature is: "+this.celsius.toFixed(2)+", fan is off");
			}
		}
	});
  //////////////////////////////// BACKYARD LIGHT ////////////////////////////////
	backyard_light_button = new five.Button(8);
	// Relay to toggle the backyard light is attached to pin 9
	backyard_light_pin = new five.Pin(9);
	// Check any pushbutton event to toggle the light
	backyard_light_button.on("release", function() {
		backyard_light = !backyard_light;
		if(backyard_light) {
			backyard_light_pin.high();
			console.log("Backyard light is on");
			io.sockets.emit('backyard-light-change', 1);
		}
		else {
			backyard_light_pin.low();
			console.log("Backyard light is off");
			io.sockets.emit('backyard-light-change', 0);
		}
	});
  //////////////////////////////// IR ////////////////////////////////
});
