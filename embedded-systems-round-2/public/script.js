$(function() {
    $( "#slider-range-max" ).slider({
      range: "max",
      min: 0,
      max: 255,
      value: 0,
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
    });
    $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );

    $("#living-room-btn").click(function() {
      var btnClass = $(this).attr('class');
      if(btnClass === "btn btn-success") {
        $(this).removeClass('btn-success');
        $(this).addClass('btn-danger');
        $(this).text("Turn off");
        state = "On";
      } else if(btnClass === "btn btn-danger") {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        $(this).text("Turn on");
        state = "Off";
      }
      $("#living-room-light").val(state);
    });
  });
