// 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// 七种经典方块形状
const SHAPES = [
  [[1,1,1,1]], // I型
  [[1,1,1],[0,1,0]], // T型
  [[1,1,1],[1,0,0]], // L型
  [[1,1,1],[0,0,1]], // J型
  [[1,1],[1,1]], // O型
  [[1,1,0],[0,1,1]], // S型
  [[0,1,1],[1,1,0]] // Z型
];

class Tetris {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.score = 0;
    this.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    this.currentPiece = null;
    this.gameOver = false;

    this.init();
  }

  init() {
    this.spawnNewPiece();
    document.addEventListener('keydown', (e) => this.handleInput(e));
    this.gameLoop();
  }

  spawnNewPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.currentPiece = {
      shape,
      x: Math.floor(COLS/2) - Math.floor(shape[0].length/2),
      y: 0,
      color: `hsl(${Math.random()*360}, 70%, 60%)`
    };
  }

  drawBlock(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
  }

  drawBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制当前方块
    this.currentPiece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if(value) {
          this.drawBlock(
            this.currentPiece.x + dx,
            this.currentPiece.y + dy,
            this.currentPiece.color
          );
        }
      });
    });

    // 绘制已固定方块
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value) {
          this.drawBlock(x, y, value);
        }
      });
    });
  }

  collisionCheck(dx, dy, shape = this.currentPiece.shape) {
    return shape.some((row, y) =>
      row.some((value, x) => {
        const newX = this.currentPiece.x + x + dx;
        const newY = this.currentPiece.y + y + dy;
        return value && (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && this.board[newY]?.[newX])
        );
      })
    );
  }

  rotatePiece() {
    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    );
    if(!this.collisionCheck(0, 0, rotated)) {
      this.currentPiece.shape = rotated;
    }
  }

  fixPiece() {
    this.currentPiece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if(value) {
          const y = this.currentPiece.y + dy;
          const x = this.currentPiece.x + dx;
          if(y >= 0) this.board[y][x] = this.currentPiece.color;
        }
      });
    });
    this.clearLines();
    if(this.currentPiece.y === 0) {
      this.gameOver = true;
      document.getElementById('game-over').classList.remove('hidden');
      return;
    }
    this.spawnNewPiece();
  }

  clearLines() {
    let linesCleared = 0;
    
    for(let y = ROWS - 1; y >= 0; y--) {
      if(this.board[y].every(cell => cell)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // 重新检查当前行
      }
    }

    if(linesCleared > 0) {
      this.score += linesCleared * 100;
      document.getElementById('score').textContent = this.score;
    }
  }

  handleInput(e) {
    if(this.gameOver) return;

    switch(e.key) {
      case 'ArrowLeft':
        if(!this.collisionCheck(-1, 0)) this.currentPiece.x--;
        break;
      case 'ArrowRight':
        if(!this.collisionCheck(1, 0)) this.currentPiece.x++;
        break;
      case 'ArrowDown': {
        const now = Date.now();
        if (!this.lastArrowDown || now - this.lastArrowDown > 100) {
          if(!this.collisionCheck(0, 1)) this.currentPiece.y++;
          this.lastArrowDown = now;
        }
        break;
      }
        break;
      case 'ArrowUp':
        this.rotatePiece();
        break;
    }
  }

  gameLoop() {
    if(this.gameOver) return;

    this.drawBoard();
    const FALL_INTERVAL = 1000;
    let now = Date.now();
    this.lastTime = this.lastTime || now;
    let delta = now - this.lastTime;

    if (delta > FALL_INTERVAL) {
      if (!this.collisionCheck(0, 1)) {
        this.currentPiece.y++;
      } else {
        this.fixPiece();
      }
      this.lastTime = now;
    }

    if (!this.gameOver) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
}

// 启动游戏
new Tetris();