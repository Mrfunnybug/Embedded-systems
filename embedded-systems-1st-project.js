/*
	Home automation with the following characteristics:
		1.- It has 3 rooms, one living room, dining room, kitchen, bathroom, and a backyard
		2.- The living room light must be activated both manually or automatic with the use of a photoresistor
		3.- Every other rooms lights are controlled manually with a button
		4.- It has a ventilation system using lm35 and a dc motor
		5.- Backyard's light is controlled manually with a pushbutton and is an AC bulb
		
	This project can get improved but for time rank just the mentioned characteristics will be covered
*/

var five = require("johnny-five"),
	arduino = five.Board();

var living_room_light = false, other_rooms_light = false;

var living_room_button, other_rooms_light_button;

var living_room_light_pin, other_rooms_light_pin;

var photoresistor_pin;

arduino.on("ready", function() {
	
	//Initialize pushbutton for living room at digital input 2
	living_room_button = five.Button(2);

	// Pin 3 is used to set living room light, analog input A0 is used to check light intensity from a photoresistor
	photoresistor_pin = new five.Pin("A0");
	living_room_light_pin = new five.Pin(13);

	// Check if photoresistor gets less than a half of light available and change living room light if applicable
	photoresistor_pin.read( function (error, voltage) {
		if(voltage < 425 && !living_room_light) {
			living_room_light = !living_room_light;
			living_room_light_pin.high();
			console.log("Living room on by photoresistor");
		}
	});

	// Changes living room light when pushbutton is pushed
	living_room_button.on("release", function () {
		living_room_light = !living_room_light;
		if(living_room_light) {
			living_room_light_pin.high();
			console.log("Living room on manually");
		}
		else {
			living_room_light_pin.low();
			console.log("Living room off manually");
		}
	});


	other_rooms_light_button = five.Button(4);

	other_rooms_light_pin = new five.Pin(12);
	other_rooms_light_button.on("release", function () {
		other_rooms_light = !other_rooms_light;
		if(other_rooms_light) {
			other_rooms_light_pin.high();
			console.log("Other rooms lights are on");
		}
		else {
			other_rooms_light_pin.low();
			console.log("Other rooms lights are off");
		}
	});


});
