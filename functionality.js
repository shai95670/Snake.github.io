import Food from './food.js';
import BodyPart from './bodyPart.js';
// initial variable declarations
const canvas2dObj = document.getElementById('canvas').getContext('2d');
canvas2dObj.font = '20px calibri';
const WIDTH = canvas2dObj.WIDTH;
const HEIGHT = canvas2dObj.HEIGHT;
let snakeList, direction, eaten, timer, fps, unEatenFoodList;
let points = 0;
let gameRunning = false;

//instantiating the objects
const snakeBodyPart = new BodyPart();
const food = new Food();

// Drawing functions
function drawSnake() {
  canvas2dObj.save();
  for (let i = 0; i < snakeList.length; i++) {
    if (i === 0) { // draw the head of the snake
      canvas2dObj.fillStyle = 'black';
      canvas2dObj.fillRect(snakeList[i].x,
        snakeList[i].y,
        snakeList[i].width,
        snakeList[i].height);
    } else { // draw the rest of the snakes body
      canvas2dObj.fillStyle = snakeList[i].color;
      canvas2dObj.fillRect(snakeList[i].x,
        snakeList[i].y,
        snakeList[i].width,
        snakeList[i].height);
    }
  }
  canvas2dObj.restore();
};

// abstract the method
function drawFood() {
  canvas2dObj.save();
  canvas2dObj.fillStyle = food.color;
  canvas2dObj.fillRect(unEatenFoodList[0].x, unEatenFoodList[0].y, food.width, food.height);
  canvas2dObj.restore();
}

function updateSnakeList() {
  for (var i = snakeList.length - 1; i >= 0; i--) {
    if (direction == 0) {
      if (i == 0) {
        snakeList[i].x -= snakeList[i].speedX;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 1) {
      if (i == 0) { 
        snakeList[i].y -= snakeList[i].speedY;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 2) {
      if (i == 0) { 
        snakeList[i].x += snakeList[i].speedX;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 3) {
      if (i == 0) { 
        snakeList[i].y += snakeList[i].speedY;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    }
  }
}

// Create a function for randomized x and y food positions
// logical problem 
// should uupdate the food position only when the food is
// eaten
function updateFoodPosition() {
  if(eaten === true) {
    let posX = Math.floor(Math.random() * 450) + 30;
    let posY = Math.floor(Math.random() * 450) + 30;
    unEatenFoodList.push(new Food(posX, posY));
  }
  eaten = false;
}

// updates the snakes speed
function updateSnakeSpeed(){
  timer++;
  if (timer === 1000) {
    snakeBodyPart.speedX = snakeBodyPart.speedX + 4;
    snakeBodyPart.speedY = snakeBodyPart.speedY + 4;
    timer = 0;
  }
};

// change to WIDTH VALUES
// returns boolean true if a wall was encounterd
function checkWallCollision() {
  if (snakeList[0].x === 0 || snakeList[0].y === 0 ||
      snakeList[0].x === 500 || snakeList[0].y === 500) {
    return true;
  }
}

// main body collison function tester
function BodyCollision() {
  let firstPart = true;
  let firstBodyPart;
  for (let bodyPart in snakeList) {
    if (firstPart) {
        firstPart = false
        firstBodyPart = bodyPart
        continue;
    }  
    return ((Math.abs(firstBodyPart.x - bodyPart.x) < 5) &&
            (Math.abs(firstBodyPart.y - bodyPart.y) < 5))
  }
}   

// food collison tester return a boolean value of true
function testFoodCollision(snakeHead, unEatenFood) {
  return ((snakeHead.x <= unEatenFood.x + food.width) &&
          (unEatenFood.x <= snakeHead.x + snakeBodyPart.width) &&
          (snakeHead.y <= unEatenFood.y + food.height) &&
          (unEatenFood.y <= snakeHead.y + snakeBodyPart.height));
}

function updateScoreBoard(){
  points += 50;
  document.getElementById('scoreBoard').innerText = 'Points: ' + points;
};

function cleanGameScreen() {
  canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT); // wipe the canvas
};

// sets the game over screen
function setGameOver(fps) {
  cleanGameScreen();
  canvas2dObj.fillText('Game Over\nTry Again Y/N?', 140, 140);
  clearInterval(fps);
};

function createNewSnakePart() {
    let NewX;
    let NewY;

    if (direction === 0) {
      NewX = snakeList[0].x - 10;
      NewY = snakeList[0].y;
    } else if (direction === 1) {
      NewX = snakeList[0].x;
      NewY = snakeList[0].y - 10;
    } else if (direction === 2) {
      NewX = snakeList[0].x + 10;
      NewY = snakeList[0].y;
    } else if (direction === 3) {
      NewX = snakeList[0].x;
      NewY = snakeList[0].y + 10;
    }

    snakeList.unshift(new BodyPart(NewX, NewY));
}



//updates the game object positions on the canvas
function MainGameLoop() {
  cleanGameScreen();
  updateFoodPosition();
  drawFood();
  drawSnake();

  updateSnakeSpeed();
  
  if (testFoodCollision(snakeList[0], unEatenFoodList[0])) {
    unEatenFoodList = []; //empty the food list
    eaten = true;
    createNewSnakePart();
    // upate the score board if the snake ate the food
    updateScoreBoard();
  }

  if(BodyCollision() || checkWallCollision()) {
    setGameOver(fps);
  }
  updateSnakeList();
}

//Player game inputs, key strokes
document.onkeydown = function(event) {
  if (event.keyCode === 65 && direction != 2) {
    direction = 0; // int values too ambiguous, change them to strings, ie 'left', 'right'
  } else if (event.keyCode === 87 && direction != 3) {
    direction = 1;
  } else if (event.keyCode === 68 && direction != 0) {
    direction = 2;
  } else if (event.keyCode === 83 && direction != 1) {
    direction = 3;
  } else if (event.keyCode === 89) {
    startGame();
  } else if (event.keyCode === 80) {
    if (gameRunning === false) {
      cleanGameScreen(); // wipe the canvas
      startGame();
    } else if (event.keyCode === 78) {
      LoadInitialGamePage();
    }
  }
};

function initializeScoreBoard(){
  points = 0;
  document.getElementById('scoreBoard').innerText = 'Points: ' + points;
}

const startGame = () => {
  snakeList = [
    new BodyPart(220, 200),
    new BodyPart(210, 200),
    new BodyPart(200, 200)
  ];
  initializeScoreBoard()
  direction = 99;
  unEatenFoodList = [];
  eaten = true;
  gameRunning = true;
  timer = 0;
  fps = setInterval(MainGameLoop, 50); // 164 fps
};

// initial game page
function LoadInitialGamePage() {
  canvas2dObj.save();
  cleanGameScreen();
  canvas2dObj.font = '40px Calibri';
  canvas2dObj.fillStyle = '#00cc00';
  canvas2dObj.fillText('Snake, Click P to play', 100, 170);
  canvas2dObj.restore();
}

LoadInitialGamePage();