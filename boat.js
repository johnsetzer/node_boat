var Spark = require("spark-io");
var five = require("johnny-five");
var keypress = require("keypress");

keypress(process.stdin);

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});
var propellers, rudder;

board.on("ready", function() {

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  //global
  propellers = new five.Servo.Continuous("D0").stop();
  //console.log('HI', propellers)

  rudder = new five.Servo("D1").stop();

  this.repl.inject({
    rudder: rudder,
    propellers: propellers
  });

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  var START_SPEED = 90; // 0 = full reverse, 90 = stopped, 180 = full ahead
  var SPEED_STEP = 15;
  var speed = START_SPEED;

  var RUDDER_START = 90; // centered
  var RUDDER_STEP = 10;
  var rudderAngle = RUDDER_START;

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    rudder.to(rudderAngle); 

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } 
    else if (key.name === "up") {
      speed += SPEED_STEP;
      propellers.to(speed);
      console.log('speed', speed);
    } 
    else if (key.name === "down") {
      speed -= SPEED_STEP;
      propellers.to(speed);
      console.log('speed', speed);
    } 
    else if (key.name === "left") {
      rudderAngle += RUDDER_STEP;
      rudder.to(rudderAngle);
      console.log('rudder', rudderAngle);
    }
    else if (key.name === "right") {
      rudderAngle -= RUDDER_STEP;
      rudder.to(rudderAngle);
      console.log('rudder', rudderAngle);
    } 
    else if (key.name === "space") {
      console.log("Stopping");
      propellers.stop();
      rudder.to(RUDDER_START);
    }
    
  });
});