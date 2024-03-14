const ball = document.getElementById('ball');

const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');

const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');


const player1ScoreLabel = document.getElementById('player1-score');
const player2ScoreLabel = document.getElementById('player2-score');

let urlSearchParam = new URLSearchParams(window.location.search)
let matchCode = urlSearchParam.get("match_code")
//let homeSignature = document.cookie.

let ballX = 620;
let ballY = 340;

let ballXSpeed = 5;
let ballYSpeed = 5;

let leftPaddleY = 300;
let rightPaddleY = 300;

let leftPaddleYStart = 300;
let rightPaddleYStart = 300;

let player1Score = 0;
let player2Score = 0;

let ballInPlay = false;

let ballColor = { r: 255, g: 153, b: 204 };

var defaultColor = '#efefef';

const endScore = parseInt(prompt('How many scores should the game end?'));

const leftPaddleColor = prompt("What color should the left paddle be?");
const rightPaddleColor = prompt("What color should the right paddle be?");

document.addEventListener('keydown', (e) => {
  if ((e.key === 'w' || e.key === 'W') && leftPaddleY > 0) {
    leftPaddleY -= 50;
  } else if ((e.key === 's' || e.key === 'S') && leftPaddleY < 600) {
    leftPaddleY += 50;
  } else if (e.key === 'ArrowUp' && rightPaddleY > 0) {
    rightPaddleY -= 50;
  } else if (e.key === 'ArrowDown' && rightPaddleY < 600) {
    rightPaddleY += 50;
  }
});

document.addEventListener('keyup', (e) => {
  if ((e.key === 'w' || e.key === 'W') && leftPaddleY > 0) {
    leftPaddleY -= 80;
  } else if ((e.key === 's' || e.key === 'S') && leftPaddleY < 600) {
    leftPaddleY += 80;
  } else if (e.key === 'ArrowUp' && rightPaddleY > 0) {
    rightPaddleY -= 80;
  } else if (e.key === 'ArrowDown' && rightPaddleY < 600) {
    rightPaddleY += 80;
  }
});

function scoreReset() {
  player1Score = 0;
  player2Score = 0;
  player1ScoreElement.textContent = '0';
  player2ScoreElement.textContent = '0';
}

function handleLose() {
  if (!endScore) {
    if (player1Score === 10 || player2Score === 10) {
      console.log(`player1 score: ${player1Score}, player2 score: ${player2Score}`);
      scoreReset();
      resetBall();
      ballColorReset();
      window.location.href = "finish-match.html";
    }
  }

  if (player1Score === endScore || player2Score === endScore) {
    console.log(`player1 score: ${player1Score}, player2 score: ${player2Score}`);
    scoreReset();
    resetBall();
    ballColorReset();
    //TODO: Submit match result here
    window.location.href = "finish-match.html";
  }
}

function updateGame() {
  ballX += ballXSpeed;
  ballY += ballYSpeed;

  handlePaddleColor();

  if (ballX <= 0 || ballX >= 1230) {
    if (ballX <= 0) {
      player2Score += 1;
      player2ScoreElement.textContent = player2Score;
      ballColorReset();
    }
    else {
      player1Score += 1;
      player1ScoreElement.textContent = player1Score;
      ballColorReset();
    }

    handleLose();
    resetBall();
    ballInPlay = false;
  }

  if (ballY <= 0 || ballY >= 680) {
    ballYSpeed = -ballYSpeed;
  }

  if (
    (ballX <= 40 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100) ||
    (ballX >= 1190 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100)
  ) {
    ballXSpeed *= 1.3;
    ballYSpeed *= 1.3;
    ballXSpeed = -ballXSpeed;
    changeBallColor();
  }

  leftPaddle.style.top = leftPaddleY + 'px';
  rightPaddle.style.top = rightPaddleY + 'px';

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';

  requestAnimationFrame(updateGame);
}

function resetBall() {
  ballX = 620;
  ballY = 340;

  ballXSpeed = 5;
  ballYSpeed = 5;

  ballInPlay = true;

  leftPaddleY = leftPaddleYStart;
  rightPaddleY = rightPaddleYStart;

  ballColor = { r: 255, g: 153, b: 204 };
  ball.style.backgroundColor = ballColor;
}

function handlePaddleColor() {
  leftPaddle.style.backgroundColor = leftPaddleColor || defaultColor;
  rightPaddle.style.backgroundColor = rightPaddleColor || defaultColor;
}

function changeBallColor() {
  ballColor.r = Math.max(ballColor.r - 20, 0);
  ballColor.g = Math.max(ballColor.g - 20, 0);
  ballColor.b = Math.max(ballColor.b - 20, 0);

  ball.style.backgroundColor = `rgb(${ballColor.r}, ${ballColor.g}, ${ballColor.b})`;
}

function ballColorReset() {
  ball.style.backgroundColor = defaultColor;
}

updateGame();
