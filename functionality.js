// initial variable declarations
const canvas2dObj = document.getElementById('canvas').getContext('2d');
const canvas = document.getElementById('canvas');
const WIDTH = 500;
const HEIGHT = 500;
let snakeList;
let direction;
let eaten;
let points = 0;
let gameRunning = false;
let timer;
canvas2dObj.font = '20px calibri';

//Snake factory function
// change to new class syntax 
function createSnakeBody() {
  return {
    width: 20,
    height: 20,
    color: 'green',
    speedX: 5,
    speedY: 5,
  };
}

//food factory objects
function createFood() {
  return {
    width: 20,
    height: 20,
    color: 'red',
  };
}

//instantiating the objects
const snakeBody = createSnakeBody();
const food = createFood();

// Drawing functions
function drawSnake() {
  canvas2dObj.save();
  for (var i = 0; i < snakeList.length; i++) {
    if (i == 0) { // draw the head of the snake
      canvas2dObj.fillStyle = 'black';
      canvas2dObj.fillRect(snakeList[i].x,
        snakeList[i].y,
        snakeBody.width,
        snakeBody.height);
    } else { // draw the rest of the snakes body
      canvas2dObj.fillStyle = snakeBody.color;
      canvas2dObj.fillRect(snakeList[i].x,
        snakeList[i].y,
        snakeBody.width,
        snakeBody.height);
    }
  }

  canvas2dObj.restore();
};

// abstract the method
function drawFood() {
  canvas2dObj.save();
  canvas2dObj.fillStyle = food.color;
  canvas2dObj.fillRect(foodList[0].x, foodList[0].y, food.width, food.height);
  canvas2dObj.restore();
}

function updateSnakeList() {
  for (var i = snakeList.length - 1; i >= 0; i--) {
    if (direction == 0) {
      if (i == 0) { // if the snakes head
        snakeList[i].x = snakeList[i].x - snakeBody.speedX;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 1) {
      if (i == 0) { // if the snakes head
        snakeList[i].y = snakeList[i].y - snakeBody.speedY;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 2) {
      if (i == 0) { // if the snakes head
        snakeList[i].x = snakeList[i].x + snakeBody.speedX;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 3) {
      if (i == 0) { // if the snakes head
        snakeList[i].y = snakeList[i].y + snakeBody.speedY;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    }
  }
}

function updateFoodPosition() {
  while (eaten === true) {
    let posX = Math.floor(Math.random() * 450) + 30;
    let posY = Math.floor(Math.random() * 450) + 30;
    foodList[0] = {
      x: posX,
      y: posY,
    };
    eaten = false;
  }
}

// updates the snakes speed
const updateSnakeSpeed = () => {
  snakeBody.speedX = snakeBody.speedX + 4;
  snakeBody.speedY = snakeBody.speedY + 4;
};

// change to WIDTH VALUES
// returns boolean true if a wall was encounterd
function checkPosition() {
  if (snakeList[0].x === 0 || snakeList[0].y === 0 ||
    snakeList[0].x === 500 || snakeList[0].y === 500) {
    return true;
  }
}

// body collision tester, return true if detected
function testBodyCollision(snakeHead, snakeBodyParts) {

  return ((Math.abs(snakeHead.x - snakeBodyParts.x) < 5) &&
    (Math.abs(snakeHead.y - snakeBodyParts.y) < 5));

}

// main body collison function tester
BodyCollision = function() {
  for (var index in snakeList) {
    if (index == 0) {
      continue;
    }

    if (testBodyCollision(snakeList[0], snakeList[index]) === true) {
      setGameOver();
      points = 0;
      document.getElementById('scoreBoard').innerText = 'Points: ' + points;
    }
  }
};

// food collison tester return a boolean value of true
function testCollision(snakeB, foodI) {
  return ((snakeB.x <= foodI.x + food.width) &&
    (foodI.x <= snakeB.x + snakeBody.width) &&
    (snakeB.y <= foodI.y + food.height) &&
    (foodI.y <= snakeB.y + snakeBody.height));
}

const updateScoreBoard = () => {
  points += 50;
  document.getElementById('scoreBoard').innerText = 'Points: ' + points;
};

// sets the game over screen
const setGameOver = () => {
  canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT);
  canvas2dObj.fillText('Game Over\nTry Again Y/N?', 140, 140);
  clearInterval(fps);
};

//updates the game object positions on the canvas
function updatePositions() {
  canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT); // wipe the canvas
  updateFoodPosition();
  drawFood();
  drawSnake();

  // update timer every second, untill it reaches 1000, then execute update
  timer++;
  if (timer === 1000) {
    updateSnakeSpeed();
    timer = 0;
  }

  if (testCollision(snakeList[0], foodList[0]) === true) {
    foodList = [];
    eaten = true;
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

    snakeList.unshift({
      x: NewX,
      y: NewY,
    });

    // upate the score board if the snake ate the food
    updateScoreBoard();
  }

  if (checkPosition() === true) {
    setGameOver();
    points = 0;
    document.getElementById('scoreBoard').innerText = 'Points: ' + points;
  }

  BodyCollision();
  updateSnakeList();
}

//Player game inputs, key strokes
document.onkeydown = function(event) {
  if (event.keyCode === 65 && direction != 2) {
    direction = 0;
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
      canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT); // wipe the canvas
      startGame();
    } else if (event.keyCode === 78) {
      LoadInitialGamePage();
    }
  }
};

const startGame = () => {

    snakeList = [{
      x: 220,
      y: 200,
    },
    {
      x: 210,
      y: 200,
    },
    {
      x: 200,
      y: 200,
    },
  ];
  direction = 99;
  foodList = [];
  eaten = true;
  gameRunning = true;
  timer = 0;
  let fps = setInterval(updatePositions, 50); // 164 fps
};

// initial game page
function LoadInitialGamePage() {
  canvas2dObj.save();
  canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT); // wipe the canvas
  canvas2dObj.font = '40px Calibri';
  canvas2dObj.fillStyle = '#00cc00';
  canvas2dObj.fillText('Snake, Click P to play', 100, 170);
  canvas2dObj.restore();
}

LoadInitialGamePage();
