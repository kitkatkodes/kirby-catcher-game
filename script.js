//Move the catcher with the left and right arrow keys to catch the falling objects.
let catcher, fallingObject, star, kirbyImg, backImg, gameSound;
let score = 0;
let button;

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
  button.position(width / 2 - button.width / 2, height / 2 - button.height / 2);
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('padding', '10px');
  button.style('border-radius', '5px');
  button.mousePressed(buttonClicked);

  // Fix: use new Sprite() not new p5.Sprite() (p5play v3 API)
  catcher = new Sprite();
  catcher.img = kirbyImg;
  catcher.scale = 0.05;
  catcher.collider = "k";
  catcher.pos.x = 200;
  catcher.pos.y = 378;

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

  // Fix: use new Sprite() not new p5.Sprite()
  star = new Sprite();
  star.img = spriteArt(starText, 5);
  star.scale = 0.6;
  star.vel = createVector(1, 3);
}

function buttonClicked() {
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

  fill(255, 255, 255);
  textSize(12);
  text("Move the \ncatcher with the \nleft and right \narrow keys to \ncatch the falling \nobjects.", width - 100, 20);
  text("Game by- \nShreyasi Kirti", 300, 370);

  if (star.y >= 400) {
    star.y = 0;
    score = score - 1;
    star.x = random(width);
    star.vel.y = random(1, 5);

    if (score <= -1) {
      star.pos.x = 200;
      star.pos.y = 150;
      star.vel = createVector(0, 0);
      button.show();
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    catcher.vel.x = -3;
  } else if (keyIsDown(RIGHT_ARROW)) {
    catcher.vel.x = 3;
  } else {
    catcher.vel.x = 0;
  }

  if (catcher.x < 50) {
    catcher.x = 50;
  } else if (catcher.x > 350) {
    catcher.x = 350;
  }

  if (star.collides(catcher)) {
    star.y = 0;
    star.x = random(width);
    star.vel.y = random(1, 5);
    score = score + 1;
  }

  fill(0);
  textSize(12);
  text('Score = ' + score, 10, 10);
}

//Code written by Shreyasi Kirti.
