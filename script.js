// Kirby Catcher Game — pure p5.js (no p5play dependency)
let kirbyImg, backImg;
let score = 0;
let gameOver = false;
let button;

// Catcher (Kirby)
let catcherX, catcherY, catcherW, catcherH;
const CATCHER_SPEED = 4;

// Falling star
let starX, starY, starVelX, starVelY;
let starSize = 30;

// Star pixel art colors
const b = [0, 0, 0];       // black
const y = [255, 220, 0];   // yellow
const o = [255, 160, 0];   // orange
const _ = null;             // transparent

const starPixels = [
  [_,_,_,_,_,_,b,b,b,_,_,_,_,_],
  [_,_,_,_,_,b,y,y,y,b,_,_,_,_],
  [_,_,_,_,_,b,y,y,y,b,_,_,_,_],
  [_,_,_,_,b,y,y,y,y,y,b,_,_,_],
  [b,b,b,b,b,y,y,y,y,y,b,b,b,b,b],
  [b,o,y,y,y,y,y,y,y,y,y,y,y,o,b],
  [_,b,o,y,y,b,y,y,y,b,y,y,o,b,_],
  [_,_,b,o,y,b,y,y,y,b,y,o,b,_,_],
  [_,_,_,b,o,b,y,y,y,b,o,b,_,_,_],
  [_,_,_,b,o,y,y,o,y,y,o,b,_,_,_],
  [_,_,b,o,y,y,o,b,o,y,y,o,b,_,_],
  [_,_,b,o,o,o,b,b,b,o,o,o,b,_,_],
  [_,b,o,o,b,b,_,_,_,b,b,o,o,b,_],
  [_,b,b,b,_,_,_,_,_,_,_,b,b,b,_],
];

let starGraphic;

function preload() {
  kirbyImg = loadImage('kirby.png');
  backImg = loadImage('pls.jpg');
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Catcher setup
  catcherW = kirbyImg.width * 0.05;
  catcherH = kirbyImg.height * 0.05;
  catcherX = 200;
  catcherY = 375;

  // Star setup
  resetStar(true);

  // Pre-render star pixel art into a graphic
  const pw = 4; // pixel width
  starGraphic = createGraphics(starPixels[0].length * pw, starPixels.length * pw);
  for (let row = 0; row < starPixels.length; row++) {
    for (let col = 0; col < starPixels[row].length; col++) {
      const c = starPixels[row][col];
      if (c) {
        starGraphic.fill(c[0], c[1], c[2]);
        starGraphic.noStroke();
        starGraphic.rect(col * pw, row * pw, pw, pw);
      }
    }
  }

  // Retry button
  button = createButton('Retry');
  button.hide();
  button.position(width / 2 - 25, height / 2 + 20);
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('padding', '10px 20px');
  button.style('border-radius', '5px');
  button.style('font-size', '16px');
  button.style('cursor', 'pointer');
  button.mousePressed(retryGame);
}

function resetStar(initial) {
  starX = initial ? 200 : random(30, 370);
  starY = 0;
  starVelX = random(-1.5, 1.5);
  starVelY = random(2, 4 + min(score * 0.3, 4));
}

function retryGame() {
  score = 0;
  gameOver = false;
  button.hide();
  resetStar(false);
}

function draw() {
//Press SPACE to pause/resume the game
let catcher, kirbyImg, backImg, gameSound;
let score = 0;
let health = 3;
let button;
let isPaused = false;
let gameOver = false;
let fallingObjects = [];
let lastSpawnTime = 0;
let spawnInterval = 2000; // Spawn new object every 2 seconds

function preload() {
  kirbyImg = loadImage('kirby.png');
  backImg = loadImage('pls.jpg');

  if (typeof loadSound === "function") {
    gameSound = loadSound('zelda.mp3');
  } else {
    console.log("p5.sound is not loaded, skipping sound.");
  }
}

function setup() {
  createCanvas(400, 400);

  if (typeof userStartAudio === "function") {
    userStartAudio().then(() => {
      if (gameSound) {
        gameSound.loop();
      }
    }).catch(err => {
      console.log("Audio blocked until user interaction:", err);
    });
  } else {
    console.log("p5.sound is not loaded, skipping audio start.");
  }

  let soundButton = createButton("Enable Sound");
  soundButton.position(10, 10);
  soundButton.mousePressed(() => {
    if (typeof userStartAudio === "function") {
      userStartAudio();
      if (gameSound) {
        gameSound.loop();
      }
      soundButton.remove();
    }
  });

  button = createButton('Retry');
  button.hide();
  // Use CSS fixed positioning so it's always centered in the viewport
  button.style('position', 'fixed');
  button.style('top', '50%');
  button.style('left', '50%');
  button.style('transform', 'translate(-50%, -50%)');
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('padding', '10px 20px');
  button.style('border-radius', '5px');
  button.style('font-size', '16px');
  button.style('cursor', 'pointer');
  button.style('z-index', '9999');
  button.mousePressed(buttonClicked);

  // Create Kirby catcher
  catcher = new Sprite();
  catcher.img = kirbyImg;
  catcher.scale = 0.05;
  catcher.collider = "k";
  catcher.pos.x = 200;
  catcher.pos.y = 378;
}

function createFallingObject(type) {
  let obj = new Sprite();
  obj.type = type;
  
  // Set sprite based on type
  switch(type) {
    case 'star':
      let starText = `
........bbb...
.....byyyb.....
.....byyyb.....
....byyyyyb....
bbbbbyyyyybbbbb
boyyyyyyyyyyyob
.boyybyyybyyob.
..boybyyybyob..
...bobyyybob...
...boyyoyyob...
..boyyoboyyob..
..booobbbooob..
.boobb...bboob.
.bbb.......bbb.`;
      obj.img = spriteArt(starText, 5);
      obj.points = 10;
      obj.damage = 0;
      break;
      
    case 'apple':
      let appleText = `
..bbbb..
.bbbbbbb.
.bbbkbbb.
.bkkkkkb.
.bkkkkkb.
.bkkkkkb.
.bbbkbbb.
.bbbbbbb.
..bbbb..`;
      obj.img = spriteArt(appleText, 5);
      obj.points = 100;
      obj.damage = 0;
      break;
      
    case 'donut':
      let donutText = `
..bbbb..
.bbbbbbb.
.bkbbkbb.
.bkbbkbb.
.bkbbkbb.
.bkbbkbb.
.bkbbkbb.
.bbbbbbb.
..bbbb..`;
      obj.img = spriteArt(donutText, 5);
      obj.points = 100;
      obj.damage = 0;
      break;
      
    case 'strawberry':
      let strawberryText = `
....b...
...bbb..
..bbkbb.
.bkkkkkb.
.bkkkkkb.
.bkkkkkb.
.bbbbbbb.
..bbbb..
...b...`;
      obj.img = spriteArt(strawberryText, 5);
      obj.points = 100;
      obj.damage = 0;
      break;
      
    case 'bomb':
      let bombText = `
...b...
..bbb..
.bbbbbb.
.bkkkkb.
.bkkkkb.
.bkkkkb.
.bbbbbb.
..bbb..
...b...`;
      obj.img = spriteArt(bombText, 5);
      obj.points = -50;
      obj.damage = 1;
      break;
  }
  
  obj.scale = 0.6;
  obj.pos.x = random(50, width - 50);
  obj.pos.y = -20;
  obj.vel = createVector(random(-1, 1), random(2, 4));
  obj.collider = "k";
  
  return obj;
}

function drawHeart(x, y, size) {
  push();
  fill(255, 0, 0);
  noStroke();
  let s = size;
  beginShape();
  vertex(x, y);
  bezierVertex(x - s / 2, y - s / 2, x - s, y + s / 3, x, y + s);
  bezierVertex(x + s, y + s / 3, x + s / 2, y - s / 2, x, y);
  endShape(CLOSE);
  
  // Black outline
  stroke(0);
  strokeWeight(1);
  noFill();
  beginShape();
  vertex(x, y);
  bezierVertex(x - s / 2, y - s / 2, x - s, y + s / 3, x, y + s);
  bezierVertex(x + s, y + s / 3, x + s / 2, y - s / 2, x, y);
  endShape(CLOSE);
  pop();
}

function buttonClicked() {
  score = max(0, score - 50); // Lose 50 points on retry
  health = 3;
  gameOver = false;
  button.hide();
  
  // Clear all falling objects
  fallingObjects.forEach(obj => obj.remove());
  fallingObjects = [];
  
  lastSpawnTime = millis();
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
    return false; // Prevent default space bar behavior
  }
}

/* DRAW LOOP REPEATS */
function draw() {
  background(229, 229, 229);
  image(backImg, 0, 0);

  // Draw UI
  fill(255, 255, 255);
  textSize(12);
  text("Move the \ncatcher with the \nleft and right \narrow keys to \ncatch the falling \nobjects.\n\nPress SPACE to \npause/resume.", width - 100, 20);
  
  // "Made by Shreyasi Kirti" at bottom right
  text("Made by \nShreyasi Kirti", width - 80, height - 20);

  // Draw score
  fill(0);
  textSize(12);
  text('Score = ' + score, 10, 10);
  text('Health = ' + health, 10, 45);
  text('Objects: ' + fallingObjects.length, 10, 60);

  // Draw health bar with hearts
  fill(255, 0, 0);
  for (let i = 0; i < health; i++) {
    drawHeart(20 + i * 25, 25, 8);
  }
  
  // Draw empty hearts for lost health
  stroke(0);
  strokeWeight(1);
  noFill();
  for (let i = health; i < 3; i++) {
    drawHeart(20 + i * 25, 25, 8);
  }

  // Pause overlay
  if (isPaused && !gameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("PAUSED", width / 2, height / 2);
    textSize(12);
    text("Press SPACE to resume", width / 2, height / 2 + 30);
    textAlign(LEFT, BASELINE);
    return;
  }

  // Game over screen
  if (gameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("GAME OVER", width / 2, height / 2 - 30);
    textSize(16);
    text("Final Score: " + score, width / 2, height / 2);
    text("You lost 50 points", width / 2, height / 2 + 20);
    textAlign(LEFT, BASELINE);
    button.show();
    return;
  }

  // Spawn new falling objects
  if (millis() - lastSpawnTime > spawnInterval) {
    let types = ['star', 'apple', 'donut', 'strawberry', 'bomb'];
    let weights = [0.3, 0.2, 0.2, 0.2, 0.1]; // Stars most common, bombs least common
    let type = weightedRandom(types, weights);
    
    let obj = createFallingObject(type);
    fallingObjects.push(obj);
    lastSpawnTime = millis();
  }

  // Update catcher movement
  if (keyIsDown(LEFT_ARROW)) {
    catcher.vel.x = -3;
  } else if (keyIsDown(RIGHT_ARROW)) {
    catcher.vel.x = 3;
  } else {
    catcher.vel.x = 0;
  }

  // Keep catcher in bounds
  if (catcher.x < 50) {
    catcher.x = 50;
  } else if (catcher.x > 350) {
    catcher.x = 350;
  }

  // Update falling objects
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    let obj = fallingObjects[i];
    
    // Check collision with catcher
    if (obj.collides(catcher)) {
      score += obj.points;
      health -= obj.damage;
      
      if (health <= 0) {
        gameOver = true;
      }
      
      obj.remove();
      fallingObjects.splice(i, 1);
    }
    // Check if object fell off screen
    else if (obj.y > height + 20) {
      obj.remove();
      fallingObjects.splice(i, 1);
    }
  }
}

function weightedRandom(items, weights) {
  let total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

//Code written by Shreyasi Kirti.
