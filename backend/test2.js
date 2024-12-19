var state = 'ready';

var ball = createSprite(159, 10, 15, 15);
ball.draw = makeDrawBall(ball);
ball.setCollider('circle');

var pin;
var pins = createGroup();
for (var row = 0; row < 5; row++) {
  var cols = row % 2 === 0 ? 10 : 9;
  for (var col = 0; col < cols; col++) {
    pin = createSprite((row % 2 === 0 ? 65 : 80) + col * 30, 100 + row * 30, 5, 5);
    pin.shapeColor = 'red';
    pin.draw = makeDrawCircle(pin);
    pin.setCollider('circle');
    pin.restitution = 0.80;
    pins.add(pin);
  }
}

var wall;
var walls = createGroup();
wall = createSprite(15, 150, 3, 300);
wall.rotation = -8;
wall.restitution = 0.9;
walls.add(wall);
wall = createSprite(385, 150, 3, 300);
wall.rotation = 8;
wall.restitution = 0.9;
walls.add(wall);

var bumper;
var bumpers = createGroup();
for (var i = 0; i < 5; i++) {
  bumper = createSprite(75 + i * 250 / 4, 300, 30, 30);
  bumper.shapeColor = 'blue';
  bumper.rotation = i * 40 / 5 + 45 - 16;
  bumper.restitution = 1.2;
  bumpers.add(bumper);
}

function makeDrawBall(sprite) {
  return function drawBall() {
    fill('#ddd');
    ellipse(sprite.x, sprite.y, sprite.width, sprite.height);
    noStroke();
    fill('white');
    ellipse(sprite.x + 3, sprite.y - 3, sprite.width / 3, sprite.height / 3);
  };
}

function makeDrawCircle(sprite) {
  return function drawCircle() {
    stroke('black');
    fill(sprite.shapeColor);
    ellipse(sprite.x, sprite.y, sprite.width, sprite.height);
  }
}

function draw() {
  // Reset activated bumpers
  for (var i = 0; i < bumpers.length; i++) {
    bumpers[i].shapeColor = '#0000ff';
    bumpers[i].scale = 1;
  }
  
  if (state === 'ready') {
    ball.x = Game.mouseX;
    if (mouseDown(LEFT)) {
      state = 'playing';
    }
  } else {
    // Collide ball vs obstacles
    ball.bounceOff(pins);
    ball.bounceOff(walls);
    ball.bounceOff(bumpers, function (ball, bumper) {
      bumper.shapeColor = '#aaaaff';
      bumper.scale = 1.1;
    });
    
    // Apply gravity
    ball.velocityY += 0.3;
    
    if (ball.y > Game.height + 50) {
      ball.y = 10;
      ball.velocityX = 0;
      ball.velocityY = 0;
      state = 'ready';
    }
  }
  
  background("white");
  drawSprites();
}