var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
  bgReady = true;
};
bgImage.src = "https://raw.githubusercontent.com/lostdecade/simple_canvas_game/master/images/background.png"

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
  heroReady = true;
};
heroImage.src = "https://raw.githubusercontent.com/lostdecade/simple_canvas_game/master/images/hero.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
  monsterReady = true;
};
monsterImage.src = "https://raw.githubusercontent.com/lostdecade/simple_canvas_game/master/images/monster.png";

//Game objects

var hero = {
  speed: 256,
  x: 0,
  y: 0
};
var monster = {
  x: 0,
  y: 0
};
var monstersCaught = 0;

var keysDown = {};
addEventListener("keydown", function(e) {
  keysDown[e.keyCode] = true
}, false);
addEventListener("keyup", function(e) {
  delete keysDown[e.keyCode];
}, false);

//Reset game
var reset = function() {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  monster.x = 32 + (Math.random() * (canvas.width - 96));
  monster.y = 32 + (Math.random() * (canvas.height - 96));
};

var update = function(modifier) {
  if (38 in keysDown) { //player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) { //player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { //player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) { //player holding right
    hero.x += hero.speed * modifier;
  }
  //edge detection
  if (hero.x >= canvas.width - heroImage.width - 32) {
    hero.x = canvas.width - heroImage.width - 32;
  } else if (hero.x <= 32) {
    hero.x = 32;
  }
  if (hero.y >= canvas.height - heroImage.height) {
    hero.y = canvas.height - heroImage.height - 32;
  } else if (hero.y <= 32) {
    hero.y = 32;
  }
  // Are they touching?
  if (
    hero.x <= (monster.x + 32) && monster.x <= (hero.x + 32) && hero.y <= (monster.y + 32) && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
};

//draw everything
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function() {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Let's play this game!
var then = Date.now();
reset();
main();