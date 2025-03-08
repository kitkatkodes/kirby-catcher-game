//Move the catcher with the left and right arrow keys to catch the falling objects. 

let catcher, fallingObject, star, kirbyImg, gameSound;
let score = 0;
let button;

function preload() {
  // Preload images or sounds here
  kirbyImg = loadImage('kirby.png');  // ✅ Corrected path for GitHub Pages
  backImg = loadImage('pls.jpg');  

  // ✅ Fix: Check if p5.sound is loaded before using loadSound
  if (typeof loadSound === "function") {
    gameSound = loadSound('zelda.mp3');
  } else {
    console.log("p5.sound is not loaded, skipping sound.");
  }
}

function setup() {
  createCanvas(400, 400);

  // ✅ Fix: Ensure userStartAudio() exists before calling it
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

  // Create a manual start button if audio is blocked
  let soundButton = createButton("Enable Sound");
  soundButton.position(10, 10);
  soundButton.mousePressed(() => {
    if (typeof userStartAudio === "function") {
      userStartAudio();
      if (gameSound) {
        gameSound.loop();
      }
      soundButton.remove(); // Remove button after enabling sound
    }
  });

  //##
  button = createButton('Retry');

  // Hide the button
  button.hide();

  // Position the button
  button.position(width / 2 - button.width / 2, height / 2 - button.height / 2);

  // Styling the button
  button.style('background-color', '#4CAF50');  // Green background
  button.style('color', 'white');               // White text
  button.style('padding', '10px');              // Added padding
  button.style('border-radius', '5px');     

  /// added a call back for button
  button.mousePressed(buttonClicked);

  catcher = new Sprite();
  catcher.img = kirbyImg;
  catcher.scale = 0.05;
  catcher.collider = "k";
  catcher.pos.x = 200;
  catcher.pos.y = 378;
  
  starText = `
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

  star = new Sprite();
  star.img = spriteArt(starText, 5);
  star.scale = 0.6;
  star.vel = createVector(1, 3);
}

function buttonClicked() {
  //console.log("Button pressed")
  score = 0;
  button.hide();
  star.pos.x = 200;
  star.pos.y = 20;
  star.vel = createVector(1, 3);
}

/* DRAW LOOP REPEATS */
function draw() {
  background(229, 229, 229);
  image(backImg, 0, 0);

  // Draw directions to screen
  fill(0);
  fill(255, 255, 255);
  textSize(12);
  
  text("Move the \ncatcher with the \nleft and right \narrow keys to \ncatch the falling \nobjects.", width - 100, 20);
  text("Game by- \nShreyasi Kirti", 300, 370);

  // If fallingObject reaches bottom, move back to random position at top
  if (star.y >= 400) {
    star.y = 0;
    score = score - 1;
    star.x = random(width);
    star.vel.y = random(1, 5);
    if (score <= -1) {
      //console.log("YOU LOST!");
      star.pos.x = 200;
      star.pos.y = 150;
      star.vel = createVector(0, 0);
      button.show();
    }
  }

  // Move catcher
  if (keyIsDown(LEFT_ARROW)) {
    catcher.vel.x = -3;
  } else if (keyIsDown(RIGHT_ARROW)) {
    catcher.vel.x = 3;
  } else {
    catcher.vel.x = 0;
  }

  // Stop catcher at edges of screen
  if (catcher.x < 50) {
    catcher.x = 50;
  } else if (catcher.x > 350) {
    catcher.x = 350;
  }

  // If fallingObject collides with catcher, move back to random position at top
  if (star.collides(catcher)) {
    star.y = 0;
    star.x = random(width);
    star.vel.y = random(1, 5);
    star.direction = "down";
    score = score + 1;
  }

  // Show score at top left part of screen
  textSize(12);
  text('Score = ' + score, 10, 10);
}

//Code written by Shreyasi K.

