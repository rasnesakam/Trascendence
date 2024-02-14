var canvas = document.querySelector('.game-container');
var ctx = canvas.getContext('2d');

var ball = document.querySelector('.ball');
var paddle1 = document.querySelector('.player-bar-1');
var paddle2 = document.querySelector('.player-bar-2');

var ballSpeedX = 2;
var ballSpeedY = 2;

function update() {
    var ballRect = ball.getBoundingClientRect();
    var paddle1Rect = paddle1.getBoundingClientRect();
    var paddle2Rect = paddle2.getBoundingClientRect();

    if (ballRect.left < paddle1Rect.right || ballRect.right > paddle2Rect.left) {
        ballSpeedX *= -1;
    }

    if (ballRect.top < 0 || ballRect.bottom > canvas.height) {
        ballSpeedY *= -1;
    }

    ball.style.left = ball.offsetLeft + ballSpeedX + 'px';
    ball.style.top = ball.offsetTop + ballSpeedY + 'px';

    requestAnimationFrame(update);
}

update();

document.addEventListener('keydown', function(event) {
    var paddleSpeed = 5;

    if (event.key === 'w') {
        paddle1.style.top = paddle1.offsetTop - paddleSpeed + 'px';
    } else if (event.key === 's') {
        paddle1.style.top = paddle1.offsetTop + paddleSpeed + 'px';
    }

    if (event.key === 'ArrowUp') {
        paddle2.style.top = paddle2.offsetTop - paddleSpeed + 'px';
    } else if (event.key === 'ArrowDown') {
        paddle2.style.top = paddle2.offsetTop + paddleSpeed + 'px';
    }
});
