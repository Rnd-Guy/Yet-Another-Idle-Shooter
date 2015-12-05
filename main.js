
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

//this ensures the image is loaded before attempting to draw the image. otherwise error may occur.

var playerImgReady = false;
var playerImage = new Image();
playerImage.onload = function() {
	playerImgReady = true;
};
playerImage.src = "player test.png";


//player bullets
var bulletImgReady = false;
var bulletImage = new Image();
bulletImage.onload = function() {
	bulletImgReady = true;
};
bulletImage.src = "bullet test.png";


//test asset
var cursorImgReady = false;
var cursorImage = new Image();
cursorImage.onload = function() {
	cursorImgReady = true;
};
cursorImage.src = "cursorTest.png";

//button background
var emptyButtonReady = false;
var emptyButtonImage = new Image();
emptyButtonImage.onload = function() {
    emptyButtonReady = true;
};
emptyButtonImage.src = "emptyButton.png";

var emptyButtonHoverReady = false;
var emptyButtonHoverImage = new Image();
emptyButtonHoverImage.onload = function() {
	emptyButtonHoverReady = true;
};
emptyButtonHoverImage.src = "emptyButtonHover.png";

var emptyButtonPressedReady = false;
var emptyButtonPressedImage = new Image();
emptyButtonPressedImage.onload = function() {
	emptyButtonPressedReady = true;
};
emptyButtonPressedImage.src = "emptyButtonHover.png";




//enemy assets
//enemy bullets
var enemyImgReady = false;
var enemyImage = new Image();
enemyImage.onload = function() {
	enemyImgReady = true;
};
enemyImage.src = "Enemy test.png";



//background
var titleScreenReady = false;
var titleScreenImage = new Image();
titleScreenImage.onload = function() {
	titleScreenReady = true;
};
titleScreenImage.src = "title screen.png";

//levels




//objects
//player object
var player = {
	//x: playingField.x + playingField.width/2,
	//y: playingField.y + playingField.height - 40,
	x: 200,
	y: 200,
	shotType: 1,
	speed:200,
	width:7,
	height:7,
	hp:1000,
	shotDelay:250,
	shotTimer:0,
	
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
function Bullet(x,y,speed,x2,y2,w,h,friendly,dmg) { 
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.speed = speed;
	this.dmg = dmg;
	this.friendly = friendly; // friendly = 1 means it doesn't dmg the player. friendly = 0 means it's hostile
	this.offScreen = false;
	this.destroyed = false;
	if (y2 > 10000) { //set y2 > 10000 to determine shottype 1,
		this.dir = arguments[3];
	}
	else {
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


//bullet array
var bulletArray = [];

var enemyArray = [];


/** enemy constructor
 * Enemies will have a spawn coordinate x,y
 * They will have a shooting pattern 
 * They will have a moving pattern
 * Moving pattern: x,y,time, where time is relative time in ms after previous path is met.
 * 		eg pathVec = [0,0,3000,500,0,1000] means move to x=0, y=0, arriving there after 3 seconds, then move to (500,0) and reach there in 1 second.
 * Shooting pattern: x,y,spd,dir,time or x,y,spd,x2,y2,time [time = time after spawn or time after stage start]
 *
 *
 *
 */
function Enemy(x,y,width,height,hp,pathVec,shootVec) {
	this.x = x;
	this.y = y;
	this.initialX = x;
	this.initialY = y;
	this.offScreen = false;
	this.destroyed = false;
	
	// hitbox
	this.width = width;
	this.height = height;
	this.hp = hp;
	
	// [EDIT]
	this.shootOffsetX = 16;
	this.shootOffsetY = 28;
	
	this.path = pathVec;
	this.shoot = shootVec;
	
	this.pathNo = 0;
	this.shootNo = 0;
	this.timeSpawn = Date.now();
	this.timeNow = Date.now();
	this.speed = 0; //to be changed
	this.dir = 0; //maybe
	this.timeAlive = 0;
	this.timePath = 0;
	this.timeShoot = 0;
	
	//each step, want to move along the path, arriving at the destination at the specified time
	
	//each step want to check for bullets to shoot as well.
	
	this.update2 = function(deltaTime) {
		
		this.timeAlive += 15;
		this.timePath += 15;
		this.timeShoot += 15;
		
		// movement
		// x,y,time to get to said x and y, x2, y2, time to get to said x2 and y2...
		
		if (3*this.pathNo < this.path.length && this.timePath > this.path[3*this.pathNo + 2]) {
			do {
				this.timePath -= this.path[3*this.pathNo + 2];
				this.initialX = this.path[3*this.pathNo];
				this.initialY = this.path[3*this.pathNo + 1];
				++this.pathNo;
			} while (3*this.pathNo < this.path.length && this.timePath > this.path[3*this.pathNo + 2]);
		}
		this.x = ((this.timePath/this.path[3*this.pathNo + 2]) * this.path[3*this.pathNo]) + ((1 - (this.timePath/this.path[3*this.pathNo + 2])) * this.initialX);
		this.y = ((this.timePath/this.path[3*this.pathNo + 2]) * this.path[3*this.pathNo + 1]) + ((1 - (this.timePath/this.path[3*this.pathNo + 2])) * this.initialY);
			
		if (3*this.pathNo >= this.path.length) {
			this.destroyed = true;
		}
		
		
		//shooting
		// bullet constructor
		// Bullet(x,y,spd,dir,width,height,friendly,dmg)
		// Bullet(x,y,spd,x2,y2,width,height,friendly,dmg)
		// for the vector, have (bulletType,x,y,spd,bulletType1,bulletType2,width,height,friendly,dmg,timeAfterSpawn)
		// 		where bulletType = 1 means using constructor 1 (bulletType1 = dir, bulletType2 is unused),
		//			  bulletType = 2 means using constructor 2 (bulletType1 = x2, bulletType2 = y2)
		// 		and timeAfterSpawn is the time in ms when to shoot said bullet after enemy has spawned.
		while (11*this.shootNo < this.shoot.length && this.timeShoot > this.shoot[11*this.shootNo+10]) {
			if (this.shoot[11*this.shootNo] == 1) //shot type 1: x,y,spd,dir
			{
				//temp
				if (this.shoot[11*this.shootNo + 1] == "x") {
					this.shoot[11*this.shootNo + 1] = this.x + this.shootOffsetX;
				}
				if (this.shoot[11*this.shootNo + 2] == "y") {
					this.shoot[11*this.shootNo + 2] = this.y + this.shootOffsetY;
				}
				if (this.shoot[11*this.shootNo + 4] == "player.x") {
					this.shoot[11*this.shootNo + 4] = player.x;
				}
				if (this.shoot[11*this.shootNo + 5] == "player.y") {
					this.shoot[11*this.shootNo + 5] = player.y;
				}
				bulletArray.push(new Bullet(this.shoot[11*this.shootNo+1],this.shoot[11*this.shootNo+2],this.shoot[11*this.shootNo+3],this.shoot[11*this.shootNo+4],12345,this.shoot[11*this.shootNo+6],this.shoot[11*this.shootNo+7],this.shoot[11*this.shootNo+8],this.shoot[11*this.shootNo+9]));
			}
			if (this.shoot[11*this.shootNo] == 2) // shot type 2: x,y,spd,x2,y2
			{
				//temp
				if (this.shoot[11*this.shootNo + 1] == "x") {
					this.shoot[11*this.shootNo + 1] = this.x + this.shootOffsetX;
				}
				if (this.shoot[11*this.shootNo + 2] == "y") {
					this.shoot[11*this.shootNo + 2] = this.y + this.shootOffsetY;
				}
				if (this.shoot[11*this.shootNo + 4] == "player.x") {
					this.shoot[11*this.shootNo + 4] = player.x;
				}
				if (this.shoot[11*this.shootNo + 5] == "player.y") {
					this.shoot[11*this.shootNo + 5] = player.y;
				}
				bulletArray.push(new Bullet(this.shoot[11*this.shootNo+1],this.shoot[11*this.shootNo+2],this.shoot[11*this.shootNo+3],this.shoot[11*this.shootNo+4],this.shoot[11*this.shootNo+5],this.shoot[11*this.shootNo+6],this.shoot[11*this.shootNo+7],this.shoot[11*this.shootNo+8],this.shoot[11*this.shootNo+9]));
			}
			++this.shootNo;
		}
	}
	
}


function bulletCollision() {
	for (var i = 0; i<bulletArray.length; ++i) {
		//friendly bullet collision with enemy
		if (bulletArray[i].friendly == true) {
			for (var j = 0; j<enemyArray.length; ++j) {
				if (enemyArray[j].x < bulletArray[i].x + bulletArray[i].width &&
					enemyArray[j].x + enemyArray[j].width > bulletArray[i].x &&
					enemyArray[j].y < bulletArray[i].y + bulletArray[i].height &&
					enemyArray[j].y + enemyArray[j].height > bulletArray[i].y) {
					
					bulletArray[i].destroyed = true;
					enemyArray[j].hp -= bulletArray[i].dmg;
					if (enemyArray[j].hp <= 0) {
						enemyArray[j].destroyed = true;
					}
				}
			}
		}
		
		// enemy bullet collision with player
		if (bulletArray[i].friendly == false) {
			if (player.x < bulletArray[i].x + bulletArray[i].width &&
				player.x + player.width > bulletArray[i].x &&
				player.y < bulletArray[i].y + bulletArray[i].height &&
				player.y + player.height > bulletArray[i].y) {
				
				player.hp -= bulletArray[i].dmg;
				bulletArray[i].destroyed = true;
				//something here for when player hp < 0 [EDIT]
			}
		}
	}
}











//game field????????
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



// keyboard input (makes it slightly simpler) 
// A
var keyboardA = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// B
var keyboardB = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// C
var keyboardC = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// D
var keyboardD = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// E
var keyboardE = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// F
var keyboardF = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// G
var keyboardG = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// H
var keyboardH = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// I
var keyboardI = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// J
var keyboardJ = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// K
var keyboardK = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// L
var keyboardL = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// M
var keyboardM = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// N
var keyboardN = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// O
var keyboardO = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// P
var keyboardP = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// Q
var keyboardQ = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// R
var keyboardR = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// S
var keyboardS = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// T
var keyboardT = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// U
var keyboardU = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// V
var keyboardV = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// W
var keyboardW = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// X
var keyboardX = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// Y
var keyboardY = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// Z
var keyboardZ = function() {
	if (65 in keysDown) {
		return true;
	}
	else {
		return false;
	}
}
// Up arrow
var keyboardUp = function() {
	if (38 in keysDown) {
		return true;
	}
	else {
		return false;
	}
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
	
	
  //if (38 in keysDown) { //player holding up
  if (keyboardUp()) {
    player.y -= player.speed * modifier;
  }
  if (40 in keysDown) { //player holding down
    player.y += player.speed * modifier;
  }
  if (37 in keysDown) { //player holding left
    player.x -= player.speed * modifier;
  }
  if (39 in keysDown) { //player holding right
    player.x += player.speed * modifier;
  }
  /*
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
  */
  if (32 in keysDown) {
	//bulletArray.push(new Bullet(shooterX,shooterY,20,cursorX,cursorY));
	player.shotTimer += 1000*modifier;
	if (player.shotTimer > player.shotDelay) {
		bulletArray.push(new Bullet(player.x,player.y,20,90,22135,6,6,1,20));
		player.shotTimer -= player.shotDelay;
	}
	
  }
  /*
  if (90 in keysDown) {
	  for (var i = 0; i<enemyArray.length; ++i) {
		enemyArray[i].update(modifier*1000);
	  
	}
  }
  */
  
  for (var i = 0; i < enemyArray.length; ++i) {
	  enemyArray[i].update2(modifier*1000);
  }
  for (var i = 0; i < bulletArray.length; ++i) {
	   bulletArray[i].update();
  }
 
  
  
  //bullet collision
  bulletCollision();
  
  //edge detection [put in keyboard input]
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

var render = function() {
	if (bulletImgReady) {
		var i = 0;
		while (i < bulletArray.length) {
			
			if (bulletArray[i].offScreen == true || bulletArray[i].destroyed == true) {
				bulletArray.splice(i,1);
			}
			else {
				ctx.drawImage(bulletImage,bulletArray[i].x,bulletArray[i].y);
				++i;
			}
		}
	}
	
	if (enemyImgReady) {
		var i = 0;
		while (i < enemyArray.length) {
			
			if (enemyArray[i].offScreen == true || enemyArray[i].destroyed == true) {
				enemyArray.splice(i,1);
			}
			else {
				ctx.drawImage(enemyImage,enemyArray[i].x,enemyArray[i].y);
				++i;
			}
		}
	}
	
	
	
	if (playerImgReady) {
		ctx.drawImage(playerImage,player.x,player.y);
	}

	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("enemies onscreen: "+ enemyArray.length,32,112);
	ctx.fillText("bullets onscreen: " + bulletArray.length,32,132);
	ctx.fillText("Time Elapsed: " + timeElapsed,32,152);
	ctx.fillText("tempTimer: " + tempTimer,32,172);
}


//stages?
//stage 1?

//function Enemy(x,y,width,height,hp,pathVec,shootVec)
// pathVec: x,y,time to get to x and y
// shootVec: (bulletType,x,y,spd,bulletType1,bulletType2,width,height,friendly,dmg,timeAfterSpawn)
// bulletType = 1 is dir, bulletType = 2 is x2,y2
//test enemy path and shot

var testPathVec = [0,0,1000,
				   500,100,4000,
				   100,100,4000,
				   300,0,6000,
				   500,0,1000,
				   500,300,1000,
				   0,0,1000];
//var testShootVec = [1,this.x,this.y,100,270,34234,6,6,0,20,1000,1,this.x,this.y,100,270,34234,6,6,0,20,2000,1,this.x,this.y,100,270,34234,6,6,0,20,3000,
//					1,this.x,this.y,100,270,34234,6,6,0,20,4000,1,this.x,this.y,100,270,34234,6,6,0,20,5000,1,this.x,this.y,100,270,34234,6,6,0,20,6000];

var testShootVec = [1,"x","y",1,270,34234,6,6,false,20,1000,
					1,"x","y",1,270,34234,6,6,false,20,2000,
					1,"x","y",1,270,34234,6,6,false,20,3000,
					1,"x","y",1,270,34234,6,6,false,20,4000,
					1,"x","y",1,270,34234,6,6,false,20,6000,
					2,"x","y",1,"player.x","player.y",6,6,false,20,9000,
					2,"x","y",1,"player.x","player.y",6,6,false,20,12000,
					2,"x","y",1,0,400,6,6,false,20,14000,
					2,"x","y",1,300,400,6,6,false,20,14000,
					2,"x","y",1,600,400,6,6,false,20,14000,
					2,"x","y",1,"player.x","player.y",6,6,false,20,15000,
					2,"x","y",1,"player.x","player.y",6,6,false,20,15500,
					2,"x","y",1,"player.x","player.y",6,6,false,20,16000];

var gameState = "test";

function stage1(deltaTime) {
	//how to define a stage?
	timeElapsed += deltaTime;
	//[EDIT]
	//if (90 in keysDown) {
		tempTimer += 1000 * deltaTime;
	//}
	// tempTimer += 1000 * deltaTime;
	
	if (tempTimer > 5000) {
		enemyArray.push(new Enemy(0,0,32,28,100,testPathVec,testShootVec));
		tempTimer -= 5000;
	}
	
}





//main loop
var main = function() {
  var now = Date.now();
  var delta = now - then;
  
  update(delta / 1000);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  render();
  
  //if (gameState == "test") {
	  stage1(delta/1000);
  //}
  
  
  
  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
  
};


//Game start
var then = Date.now();
var timeElapsed = 0;
var tempTimer = 0;
main();





/*
plan
Currently have triangle that shoots
need enemies.

1. Make enemy ships. done
2. Make enemy shoot. done
3. Bullet collision.

How to do bullet collision?
Have a vector storing all enemies.
Have a function for each enemy that determines if bullet hits the enemy. 
         -hard part
		-hitboxes
		-enemy hitboxes not too difficult, collide with anywhere on body = hit!
		-player hitbox little more difficult, unless small triangle. then should be fine.

*/







