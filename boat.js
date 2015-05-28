var Spark = require("spark-io");
var five = require("johnny-five");
var keypress = require("keypress");


console.log(process.env.SPARK_TOKEN);
console.log(process.env.SPARK_DEVICE_ID);


keypress(process.stdin);

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});
var rightProp, leftProp, rudder, rightSpeed, leftSpeed;

board.on("ready", function() {

  console.log("Boat Mode: Use Up, Down, Right, and Left arrows.");
  console.log("Tank Mode: i, o, k, l.");
  console.log("Space to stop.");
  console.log("q to quit.");

  rightProp = new five.Servo.Continuous("D0").stop();
  leftProp = new five.Servo.Continuous("D1").stop();
  rudder = new five.Servo("A0").stop();

  this.repl.inject({
    rudder: rudder,
    rightProp: rightProp,
    leftProp: leftProp
  });

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  var START_SPEED = 90; // 0 = full reverse, 90 = stopped, 180 = full ahead
  var SPEED_STEP = 15;
  rightSpeed = START_SPEED;
  leftSpeed = START_SPEED;

  var RUDDER_START = 90; // centered
  var RUDDER_STEP = 10;
  rudderAngle = RUDDER_START;

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    rudder.to(rudderAngle); 

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    }
    else if (key.name === "space") {
      console.log("Stopping");
      rightSpeed = START_SPEED;
      leftSpeed = START_SPEED;
      rudderAngle = RUDDER_START;
      
      rightProp.to(rightSpeed);
      leftProp.to(leftSpeed);
      rudder.to(rudderAngle);
    }

    // Boat Mode
    else if (key.name === "up") {
      rightSpeed += SPEED_STEP;
      rightSpeed = Math.min(rightSpeed, 180);
      rightProp.to(rightSpeed);
      
      leftSpeed -= SPEED_STEP;
      leftSpeed = Math.max(leftSpeed, 0);
      leftProp.to(leftSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    } 
    else if (key.name === "down") {
      rightSpeed -= SPEED_STEP;
      rightSpeed = Math.max(rightSpeed, 0);
      rightProp.to(rightSpeed);

      leftSpeed += SPEED_STEP;
      leftSpeed = Math.min(leftSpeed, 180);
      leftProp.to(leftSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    } 
    else if (key.name === "left") {
      rudderAngle += RUDDER_STEP;
      rudderAngle = Math.min(rudderAngle, 180);
      rudder.to(rudderAngle);
      console.log('rudder', rudderAngle);
    }
    else if (key.name === "right") {
      rudderAngle -= RUDDER_STEP;
      rudderAngle = Math.max(rudderAngle, 0);
      rudder.to(rudderAngle);
      console.log('rudder', rudderAngle);
    } 
    
    // Tank Mode
    else if (key.name === "i") {
      leftSpeed += SPEED_STEP;
      leftSpeed = Math.min(leftSpeed, 180);
      leftProp.to(leftSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    }
    else if (key.name === "k") {
      leftSpeed -= SPEED_STEP;
      leftSpeed = Math.max(leftSpeed, 0);
      leftProp.to(leftSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    }
    else if (key.name === "o") {
      rightSpeed -= SPEED_STEP;
      rightSpeed = Math.max(rightSpeed, 0);
      rightProp.to(rightSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    } 
    else if (key.name === "l") {
      rightSpeed += SPEED_STEP;
      rightSpeed = Math.min(rightSpeed, 180);
      rightProp.to(rightSpeed);
      console.log('speed', rightSpeed, leftSpeed);
    }
    
  });
});