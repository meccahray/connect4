const board = document.getElementById('board');
const status = document.getElementById('status');
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gamecont');
const restartBtn = document.getElementById('restart-btn');
const ROWS = 6;
const COLS = 7;
let boardState;
let playersQueue;

let bgm, clickSFX;

function createBoard() {
    boardState = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    board.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function startGame(mode) {
    playersQueue = mode === '2' ? ['One', 'Two'] : ['Ray', 'Jona', 'Adlie']; /* Gumana ka na plis */
    menu.style.display = 'none';
    status.style.display = 'block';
    board.style.display = 'grid';
    gameContainer.style.display = 'block';
    restartBtn.style.display = 'block';
    status.textContent = `Player ${playersQueue[0]}'s turn`;
    createBoard();

    bgm = new Audio("assets/audio/bgm.mp3");
    bgm.loop = true;
    bgm.play();
    bgm.volume = 0.5;
    clickSFX = new Audio("assets/audio/sound.mp3");
}

function stopBGM() {
    bgm.pause();
    bgm.currentTime = 0;
}

function playClickSFX() {
    clickSFX.play();
}

function getCurrentPlayer() {
    return playersQueue[0];
}

function nextPlayer() {
    const currentPlayer = playersQueue.shift();
    playersQueue.push(currentPlayer);
    status.textContent = `Player ${playersQueue[0]}'s turn `;
}

function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col, 10);

    playClickSFX();

    for (let row = ROWS - 1; row >= 0; row--) {
        if (!boardState[row][col]) {
            boardState[row][col] = getCurrentPlayer();
            updateBoard();

            if (checkWin(row, col)) {
                status.textContent = `Player ${getCurrentPlayer()} wins!`;
                board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
                stopBGM();
                return;
            }

            if (tabla()) {
                stopBGM();
                return;
            }

            nextPlayer();
            return;
        }
    }

    coltext();
}

function updateBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.remove('red', 'yellow', 'blue');
            if (boardState[row][col]) {
                cell.classList.add(boardState[row][col]);
            }
        }
    }
}

restartBtn.addEventListener('click', () => {
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
    stopBGM();
});

document.getElementById('two-player-btn').addEventListener('click', () => startGame('2'));
document.getElementById('three-player-btn').addEventListener('click', () => startGame('3'));

function checkWin(row, col) {
    const directions = [
        { r: 1, c: 0 },  // Vertical na chik
        { r: 0, c: 1 },  // Horizontal na chik
        { r: 1, c: 1 },  // Diagonal (/) na chik
        { r: 1, c: -1 }   // Diagonal (\) na chik
    ];
    /*GUMANA KA PLIS */
    const currentPlayer = boardState[row][col];

    for (let direction of directions) {
        let count = 1;

        let r = row + direction.r;
        let c = col + direction.c;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === currentPlayer) {
            count++;
            r += direction.r;
            c += direction.c;
        }
        r = row - direction.r;
        c = col - direction.c;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === currentPlayer) {
            count++;
            r -= direction.r;
            c -= direction.c;
        }

        if (count >= 4) {
            highlightWinningCells(row, col, direction, currentPlayer);
            return true;
        }
    }

    return false;
}

function highlightWinningCells(row, col, direction, player) {
    const cells = [];
    const currentPlayer = player;

    let r = row;
    let c = col;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === currentPlayer) {
        cells.push([r, c]);
        r += direction.r;
        c += direction.c;
    }
    r = row - direction.r;
    c = col - direction.c;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === currentPlayer) {
        cells.push([r, c]);
        r -= direction.r;
        c -= direction.c;
    }

    cells.forEach(([r, c]) => {
        const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.classList.add('highlight');
    });
}

function tabla() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!boardState[row][col]) {
                return false;
            }
        }
    }

    status.textContent = "DRAW!";
    board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    stopBGM();
    return true;
}

function coltext() {
    setTimeout(function () {
        status.textContent = `COLUMN IS FULL!`;

        setTimeout(function () {
            status.textContent = `Player ${playersQueue[0]}'s turn (${playersQueue[0]})`;
        }, 2000);
    },);
}
