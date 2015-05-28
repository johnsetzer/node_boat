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
var servo;

board.on("ready", function() {

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  //global
  servo = new five.Servo.Continuous("D0").stop();
  //console.log('HI', servo)

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  var speed = 90;
  var step = 15;

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      speed += step;
      servo.to(speed);
    } else if (key.name === "down") {
      console.log("CCW");
      speed -= step;
      servo.to(speed);
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
    }
    console.log('Speed', speed);
  });
});