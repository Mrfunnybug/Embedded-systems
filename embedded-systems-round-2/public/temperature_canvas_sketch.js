var poop = [];
poop.push({x: 0, y: 0});
function setup() {
  cnv = createCanvas(displayWidth / 2, displayHeight / 5);
  cnv.parent("termo-container");
  $("#living-room-btn").click(drawPoint);
}
 
function draw() {
  background(255);
  noFill();
  stroke(0);
  beginShape();
  for (var i=0; i < poop.length; i++) {
    var P = poop[i];
    vertex(P.x, P.y);
    text(P.y.toFixed(2), P.x, P.y);
    //if (P.x<0)poop.pop(i);
    P.x--;
  }
  endShape();  
}
 
function drawPoint() {
  var t = random(0, height-20);
  var P = new Points(width, t );
  poop.push(P);
}

var Points = function()
{
    var x;
    var y;

    var constructor = function Points(x, y)
    {
        this.x = x;
        this.y = y;
    };

    return constructor;
}();
