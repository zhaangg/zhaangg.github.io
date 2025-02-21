const BOARD_SIZE = 4;
let board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
let score = 0;
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

function initGame() {
    gameBoard.innerHTML = '';
    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    score = 0;
    scoreElement.textContent = score;

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}-${j}`;
            gameBoard.appendChild(cell);
        }
    }

    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ i, j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { i, j } = emptyCells[randomIndex];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = board[i][j];
            cell.textContent = value === 0 ? '' : value;
            cell.style.backgroundColor = getCellColor(value);
        }
    }
    scoreElement.textContent = score;

    if (isGameOver()) {
        const shouldRestart = confirm('游戏结束！你的得分是: ' + score + '，是否重新开始游戏？');
        if (shouldRestart) {
            initGame();
        }
    }
}

function getCellColor(value) {
    switch (value) {
        case 0: return 'rgba(238, 228, 218, 0.35)';
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

function mergeRow(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveRow(row) {
    const nonZero = row.filter(cell => cell !== 0);
    const zeros = Array(BOARD_SIZE - nonZero.length).fill(0);
    return [...nonZero, ...zeros];
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const oldRow = [...board[i]];
        board[i] = moveRow(mergeRow(moveRow(board[i])));
        if (oldRow.join() !== board[i].join()) {
            moved = true;
        }
    }
    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const oldRow = [...board[i]];
        board[i] = moveRow(mergeRow(moveRow(board[i].reverse()))).reverse();
        if (oldRow.join() !== board[i].join()) {
            moved = true;
        }
    }
    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < BOARD_SIZE; j++) {
        const column = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            column.push(board[i][j]);
        }
        const oldColumn = [...column];
        const newColumn = moveRow(mergeRow(moveRow(column)));
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i][j] = newColumn[i];
        }
        if (oldColumn.join() !== newColumn.join()) {
            moved = true;
        }
    }
    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < BOARD_SIZE; j++) {
        const column = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            column.push(board[i][j]);
        }
        const oldColumn = [...column];
        const newColumn = moveRow(mergeRow(moveRow(column.reverse()))).reverse();
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i][j] = newColumn[i];
        }
        if (oldColumn.join() !== newColumn.join()) {
            moved = true;
        }
    }
    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function isGameOver() {
    // 检查是否有空单元格
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (i > 0 && board[i][j] === board[i - 1][j]) {
                return false;
            }
            if (i < BOARD_SIZE - 1 && board[i][j] === board[i + 1][j]) {
                return false;
            }
            if (j > 0 && board[i][j] === board[i][j - 1]) {
                return false;
            }
            if (j < BOARD_SIZE - 1 && board[i][j] === board[i][j + 1]) {
                return false;
            }
        }
    }

    return true;
}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
    }
});

initGame();