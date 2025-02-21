const BOARD_SIZE = 15;
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const undoButton = document.getElementById('undo-button');
const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
let currentPlayer = 1;
let gameOver = false;
let moveHistory = [];

function initBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleClick(i, j));
            boardElement.appendChild(cell);
        }
    }
    updateStatus();
    undoButton.addEventListener('click', undoMove);
}

function handleClick(row, col) {
    if (gameOver || board[row][col] !== 0) return;

    board[row][col] = currentPlayer;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(currentPlayer === 1 ? 'black' : 'white');

    moveHistory.push({ row, col, player: currentPlayer });

    if (checkWin(row, col)) {
        gameOver = true;
        statusElement.textContent = `${currentPlayer === 1 ? '黑棋' : '白棋'} 获胜！`;
    } else if (isBoardFull()) {
        gameOver = true;
        statusElement.textContent = '平局！';
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
    }
}

function checkWin(row, col) {
    const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

function isBoardFull() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function updateStatus() {
    statusElement.textContent = `${currentPlayer === 1 ? '黑棋' : '白棋'} 落子`;
}

function undoMove() {
    if (gameOver || moveHistory.length === 0) return;
    const lastMove = moveHistory.pop();
    const { row, col, player } = lastMove;

    board[row][col] = 0;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.remove(player === 1 ? 'black' : 'white');

    currentPlayer = player;
    gameOver = false;
    updateStatus();
}

initBoard();