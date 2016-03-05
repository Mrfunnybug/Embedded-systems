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

var living_room_light = 0;

var photoresistor_pin;

arduino.on("ready", function() {
	
	//Initialize pushbutton for living room at digital input 2
	living_room_button = five.Button(2);

	// Pin 3 is used to set living room light, analog input A0 is used to check light intensity from a photoresistor
	//this.pinMode(13, five.Pin.OUTPUT);
	//this.pinMode(0, five.Pin.ANALOG);
	photoresistor_pin = new five.Pin("A0");
	living_room_light_pin = new five.Pin("13");

	photoresistor_pin.read( function (error, voltage) {
		if(voltage < 425 && living_room_light == 0) {
			living_room_light =1;
			living_room_light_pin.high();
		}
		else if(voltage >= 425 && living_room_light == 1) {
			living_room_light = 0;
			living_room_light_pin.low();
		}
	});

});