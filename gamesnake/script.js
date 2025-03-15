const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const widthInBlocks = canvas.width / blockSize;
const heightInBlocks = canvas.height / blockSize;

let score = 0;

function drawBorder() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, blockSize);
    ctx.fillRect(0, canvas.height - blockSize, canvas.width, blockSize);
    ctx.fillRect(0, 0, blockSize, canvas.height);
    ctx.fillRect(canvas.width - blockSize, 0, blockSize, canvas.height);
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('分数: ' + score, blockSize, blockSize);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function Snake() {
    this.segments = [
        { x: 7, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 5 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';

    this.draw = function () {
        ctx.fillStyle = 'green';
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
        }
    };

    this.move = function () {
        let head = this.segments[0];
        let newHead;

        this.direction = this.nextDirection;

        switch (this.direction) {
            case 'right':
                newHead = { x: head.x + 1, y: head.y };
                break;
            case 'left':
                newHead = { x: head.x - 1, y: head.y };
                break;
            case 'up':
                newHead = { x: head.x, y: head.y - 1 };
                break;
            case 'down':
                newHead = { x: head.x, y: head.y + 1 };
                break;
        }

        this.segments.unshift(newHead);

        if (newHead.x === apple.position.x && newHead.y === apple.position.y) {
            score++;
            apple.move();
        } else {
            this.segments.pop();
        }
    };

    this.checkCollision = function () {
        let head = this.segments[0];
        let wallCollision =
            head.x === 0 ||
            head.x === widthInBlocks - 1 ||
            head.y === 0 ||
            head.y === heightInBlocks - 1;

        let selfCollision = false;
        for (let i = 1; i < this.segments.length; i++) {
            if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
                selfCollision = true;
                break;
            }
        }

        return wallCollision || selfCollision;
    };

    this.setDirection = function (newDirection) {
        if (
            (this.direction === 'right' && newDirection !== 'left') ||
            (this.direction === 'left' && newDirection !== 'right') ||
            (this.direction === 'up' && newDirection !== 'down') ||
            (this.direction === 'down' && newDirection !== 'up')
        ) {
            this.nextDirection = newDirection;
        }
    };
}

function Apple() {
    this.position = { x: 10, y: 10 };

    this.draw = function () {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x * blockSize, this.position.y * blockSize, blockSize, blockSize);
    };

    this.move = function () {
        let randomX = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        let randomY = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        this.position = { x: randomX, y: randomY };
    };
}

let snake = new Snake();
let apple = new Apple();

function gameLoop() {
    clearCanvas();
    drawBorder();
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();

    if (snake.checkCollision()) {
        alert('游戏结束！你的分数是: ' + score);
        document.location.reload();
    }

    setTimeout(gameLoop, 150);
}

document.addEventListener('keydown', function (event) {
    let key = event.key;
    switch (key) {
        case 'ArrowRight':
            snake.setDirection('right');
            break;
        case 'ArrowLeft':
            snake.setDirection('left');
            break;
        case 'ArrowUp':
            snake.setDirection('up');
            break;
        case 'ArrowDown':
            snake.setDirection('down');
            break;
    }
});

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    startButton.style.display = 'none';
    gameLoop();
});

const adContainer = document.getElementById('adContainer');
const skipButton = document.getElementById('skipButton');
const countdownElement = document.getElementById('countdown');

let countdown = 5;
countdownElement.textContent = `${countdown}`;

const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = `${countdown}`;

    if (countdown === 0) {
        clearInterval(countdownInterval);
        adContainer.style.display = 'none';
    }
}, 1000);

skipButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    adContainer.style.display = 'none';
});