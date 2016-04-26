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
        console.log(ui.value);
      }
    });

    $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );

    socket.on('fan', function(temperature) {
      $("#termometer").val(temperature + "°C");
    })



    $("#living-room-btn").click(changeBtnState);
    socket.on('photoresistor', changeBtnState);

    function changeBtnState() {
        var btnClass = $("#living-room-btn").attr('class');
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
        $("#living-room-btn").removeClass(oldBtnClass);
        $("#living-room-btn").addClass(newBtnClass);
        $("#living-room-btn").text("Turn " + text);
        socket.emit('living-room-light', state);
        console.log(state);
        $("#living-room-light").val(state);
    }
  });
