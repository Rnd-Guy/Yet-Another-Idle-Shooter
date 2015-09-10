


//Start of my actual game################################################################################################
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var canvasWidth = 600;
var canvasHeight = 400;



var playingField = {
	x: 300,
	y: 10,
	width: 500,
	height: 600
}



//assets##########################
//player assets

/*
var playerImgReady = false;
var playerImage = new Image();
playerImage.onload = function() {
  playerImgReady = true;
};
playerImage.src = "https://raw.githubusercontent.com/lostdecade/simple_canvas_game/master/images/hero.png";
*/


//player bullets
var bulletImgReady = false;
var bulletImage = new Image();
bulletImage.onload = function() {
	bulletImgReady = true;
};
bulletImage.src = "bullet test.png";

var cursorImgReady = false;
var cursorImage = new Image();
cursorImage.onload = function() {
	cursorImgReady = true;
};
cursorImage.src = "cursorTest.png";

//enemy assets
//enemy bullets


//background
//levels




//objects
//player object
var player = {
	x: playingField.x + playingField.width/2,
	y: playingField.y + playingField.height - 40
	
}

//bullet object


//required functions
function degToRad(deg) {
	return (deg/180)*Math.PI;
}
function radToDeg(rad) {
	return (rad/Math.PI)*180;
}
function getDir(x,y,x2,y2) {
	if (x == x2 && y == y2) {
		console.log("Error, getDir: x == x2 and y == y2. Defaulting dir to 0");
		return 0;
	}
	if (x == x2 && y2 > y) {
		return 270;
	}
	if (x == x2 && y2 < y) {
		return 90;
	}
	if (y == y2 && x2 > x) {
		return 0;
	}
	if (y == y2 && x2 < x) {
		return 180;
	}
	//remember y goes from top to bottom
	if (x2 > x && y2 < y) { //quadrant 1
		return radToDeg(Math.atan((y-y2)/(x2-x)));
	}
	if (x2 < x && y2 < y) { //quadrant 2
		return 180 - radToDeg(Math.atan((y-y2)/(x-x2)));
	}
	if (x2 < x && y2  > y) { //quadrant 3
		return 180 + radToDeg(Math.atan((y2-y)/(x-x2)));
	}
	if (x2 > x && y2 > y) { //quadrant 4
		return 360 - radToDeg(Math.atan((y2-y)/(x2-x)));
	}
}

//bullet constructor
/* Two constructors:
 * bullet(x,y,speed,dir)
 * bullet(x,y,speed,x2,y2)
*/
function Bullet(x,y,speed,x2,y2) { 
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.offScreen = false;
	if (arguments.length == 4) {
		this.dir = arguments[3];
	}
	if (arguments.length == 5) {
		this.dir = getDir(x,y,arguments[3],arguments[4]);
	}
	this.update = function() {
		this.x += speed * Math.cos(degToRad(this.dir));
		this.y -= speed * Math.sin(degToRad(this.dir));//neg y is up
		if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
			this.offScreen = true;
		}
	}
}

var cursorX = 50;
var cursorY = 50;

var shooterX = 100;
var shooterY = 100;


//bullet array
var bulletArray = [];


ctx.rect(playingField.x, playingField.y, playingField.width, playingField.height);
ctx.stroke();


//input
var keysDown = {};
addEventListener("keydown", function(e) {
  keysDown[e.keyCode] = true
}, false);
addEventListener("keyup", function(e) {
  delete keysDown[e.keyCode];
}, false);


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


//update function
var update = function(modifier) {
	//keycodes (http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
	//a = 65
	//z = 90
	//w = 87
	//a = 65
	//s = 83
	//d = 68
	//space = 32

	
  if (38 in keysDown) { //player holding up
    //player.y -= player.speed * modifier;
	cursorY -= 200 * modifier;
  }
  if (40 in keysDown) { //player holding down
    //player.y += player.speed * modifier;
	cursorY += 200 * modifier;
  }
  if (37 in keysDown) { //player holding left
    //player.x -= player.speed * modifier;
	cursorX -= 200 * modifier;
  }
  if (39 in keysDown) { //player holding right
    //player.x += player.speed * modifier;
	cursorX += 200 * modifier;
  }
  
  if (87 in keysDown) { //player holding w
	  shooterY -= 200 * modifier;
  }
  if (83 in keysDown) {
	  shooterY += 200 * modifier;
  }
  if (65 in keysDown) {
	  shooterX -= 200 * modifier;
  }
  if (68 in keysDown) {
	  shooterX += 200 * modifier;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  if (32 in keysDown) {
	bulletArray.push(new Bullet(shooterX,shooterY,20,cursorX,cursorY));
  }
  //edge detection
  /*
  if (player.x >= canvas.width - playerImage.width - 32) {
    player.x = canvas.width - playerImage.width - 32;
  } else if (player.x <= 32) {
    player.x = 32;
  }
  if (player.y >= canvas.height - playerImage.height) {
    player.y = canvas.height - playerImage.height - 32;
  } else if (player.y <= 32) {
    player.y = 32;
  }
  // Are they touching?
  if (
    player.x <= (monster.x + 32) && monster.x <= (player.x + 32) && player.y <= (monster.y + 32) && monster.y <= (player.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
  */
};



/*
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

*/

var render = function() {
	if (bulletImgReady) {
		var i = 0;
		while (i < bulletArray.length) {
			bulletArray[i].update();
			if (bulletArray[i].offScreen == true) {
				bulletArray.splice(i,1);
			}
			else {
				ctx.drawImage(bulletImage,bulletArray[i].x,bulletArray[i].y);
				++i;
			}
		}
		
		
		//for (i = 0; i < bulletArray.length; ++i) {
		//	bulletArray[i].update();
		//	ctx.drawImage(bulletImage,bulletArray[i].x,bulletArray[i].y);
		//}
	}
	if (cursorImgReady) {
		ctx.drawImage(cursorImage,cursorX,cursorY);
		ctx.drawImage(cursorImage,shooterX,shooterY);
	}
	
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Direction : " + getDir(shooterX,shooterY,cursorX,cursorY),32,32);
	ctx.fillText("shooterX: " + shooterX,32,52);
	ctx.fillText("shooterY: " + shooterY,32,72);
	ctx.fillText("cursorX: " + cursorX,32,92);
	ctx.fillText("cursorY: " + cursorY,32,112);
	ctx.fillText("bullets onscreen: " + bulletArray.length,32,132);
}


//main loop
var main = function() {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
  
};


//Game start
var then = Date.now();
main();
















