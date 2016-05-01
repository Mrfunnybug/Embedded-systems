$(function() {
  var socket = io.connect("http://localhost:3000");
    // Slider with jQuery UI
    $( "#slider-range-max" ).slider({
      range: "max",
      min: 0,
      max: 255,
      value: 0,
      slide: function( event, ui ) {
        // Assign the slider value to the dimmable-led input
        $( "#amount" ).val( ui.value );
        // Send the event to the server with the name and value of it
        socket.emit('dimmable-led', ui.value);
        console.log("Slider value: " + ui.value);
      }
    });

    $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );

    // Gets a change whenever the temperature sensor changes and sets it to its element
    socket.on('temperature', function(temperature) {
      $("#termometer").val(temperature + "°C");
    })


    // Both this and the next ( $("#other-rooms-btn").click() ) change the calling action button state and emit the event via socket
    $("#living-room-btn").click(function() {
      changeBtnState("#living-room-btn", "#living-room-light");
      socket.emit('living-room-light', $("#living-room-light").val());
      console.log($("#living-room-btn").val());
    });

    $("#other-rooms-btn").click(function() {
      changeBtnState("#other-rooms-btn", "#other-rooms-lights");
      socket.emit('other-rooms-lights', $("#other-rooms-lights").val());
      console.log($("#other-rooms-btn").val());
    });


    // Checks for events sent from arduino to change the living room or every other rooms because of a pushbutton or photoresistor
    socket.on('living-room-pushbutton', changeBtnState("#living-room-btn", "#living-room-light"));
    socket.on('photoresistor-change', changeBtnState("#living-room-btn", "#living-room-light"));
    socket.on('other-rooms-change', changeBtnState("#other-rooms-btn", "#other-rooms-lights"))

    // One function to rule them all, well, the UI buttons...
    // btn: the button id to change ------ input: the input id to change
    function changeBtnState(btn, input) {
        var btnClass = $(btn).attr('class');
        var text, state, newBtnClass, oldBtnClass;
        if(btnClass === "btn btn-success") {
          oldBtnClass = 'btn-success';
          newBtnClass = 'btn-danger';
          text = 'off';
          state = "On";
        } else if(btnClass === "btn btn-danger") {
          oldBtnClass = 'btn-danger';
          newBtnClass = 'btn-success';
          text = 'on';
          state = "Off";
        }
        $(btn).removeClass(oldBtnClass);
        $(btn).addClass(newBtnClass);
        $(btn).text("Turn " + text);
        console.log(btn + " is " + state);
        $(input).val(state);
    }
  });
