const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;

const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;

let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "40px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Background
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Center line
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 2, i, 4, 18, "#fff3");
    }

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

    // Ball
    drawCircle(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, "#0ff");

    // Scores
    drawText(playerScore, canvas.width/4, 50, "#fff");
    drawText(aiScore, 3*canvas.width/4 - 35, 50, "#fff");
}

function collision(px, py, pw, ph, bx, by, bs) {
    return (
        px < bx + bs &&
        px + pw > bx &&
        py < by + bs &&
        py + ph > by
    );
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision (player)
    if (collision(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add a little "spin" depending on where it hits the paddle
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        let angle = collidePoint * Math.PI/4;
        let direction = 1;
        ballSpeedX = direction * 6 * Math.cos(angle);
        ballSpeedY = 6 * Math.sin(angle);
    }

    // Right paddle collision (AI)
    if (collision(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        let angle = collidePoint * Math.PI/4;
        let direction = -1;
        ballSpeedX = direction * 6 * Math.cos(angle);
        ballSpeedY = 6 * Math.sin(angle);
    }

    // Score
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement (basic AI)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE/2 - 10) {
        aiY += 5;
    } else if (aiCenter > ballY + BALL_SIZE/2 + 10) {
        aiY -= 5;
    }
    // Clamp AI paddle position
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for player paddle
canvas.addEventListener("mousemove", function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start the game
gameLoop();