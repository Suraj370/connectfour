// script.js
const boardElement = document.getElementById('board');
let gameState = Array(6).fill().map(() => Array(7).fill(null)); // 6 rows, 7 columns
let currentPlayer = 'red'; // Human starts as "red"

// Create the game board
for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.col = col;
        cell.addEventListener('click', () => {
            if (currentPlayer === 'red') {
                const col = parseInt(cell.dataset.col);
                const row = findAvailableRow(col);
                if (row !== -1) {
                    makeMove(row, col, 'red');
                    if (checkForWin('red')) {
                        alert('You win!');
                        resetGame();
                    } else if (isBoardFull()) {
                        alert('It\'s a draw!');
                        resetGame();
                    } else {
                        currentPlayer = 'yellow';
                        computerMove();
                    }
                }
            }
        });
        boardElement.appendChild(cell);
    }
}

// Make a move on the board
function makeMove(row, col, player) {
    gameState[row][col] = player;
    updateBoard();
}

// Update the visual board
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    gameState.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = cells[rowIndex * 7 + colIndex];
            cellElement.classList.remove('red', 'yellow');
            if (cell === 'red') {
                cellElement.classList.add('red');
            } else if (cell === 'yellow') {
                cellElement.classList.add('yellow');
            }
        });
    });
}

// Find the first available row in a column
function findAvailableRow(col) {
    for (let row = 5; row >= 0; row--) {
        if (!gameState[row][col]) {
            return row;
        }
    }
    return -1; // Column is full
}

// Computer's move using Minimax
function computerMove() {
    const bestMove = getBestMove(gameState);
    const row = findAvailableRow(bestMove);
    makeMove(row, bestMove, 'yellow');
    if (checkForWin('yellow')) {
        alert('Computer wins!');
        resetGame();
    } else if (isBoardFull()) {
        alert('It\'s a draw!');
        resetGame();
    } else {
        currentPlayer = 'red';
    }
}

// Minimax algorithm
function getBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let col = 0; col < 7; col++) {
        const row = findAvailableRow(col);
        if (row !== -1) {
            board[row][col] = 'yellow'; // Simulate computer's move
            const score = minimax(board, 4, false); // Depth of 4 for simplicity
            board[row][col] = null; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                bestMove = col;
            }
        }
    }

    return bestMove;
}

// Minimax function
// Minimax function with Alpha-Beta Pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
    // Base case: If depth is 0 or the game is over, return the heuristic value
    if (depth === 0 || checkForWin('red') || checkForWin('yellow') || isBoardFull()) {
        return evaluateBoard(board);
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let col = 0; col < 7; col++) {
            const row = findAvailableRow(col);
            if (row !== -1) {
                board[row][col] = 'yellow'; // Simulate computer's move
                const evaluation = minimax(board, depth - 1, alpha, beta, false);
                board[row][col] = null; // Undo the move
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break; // Beta prune
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let col = 0; col < 7; col++) {
            const row = findAvailableRow(col);
            if (row !== -1) {
                board[row][col] = 'red'; // Simulate human's move
                const evaluation = minimax(board, depth - 1, alpha, beta, true);
                board[row][col] = null; // Undo the move
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break; // Alpha prune
                }
            }
        }
        return minEval;
    }
}
// Evaluate the board (heuristic function)
function evaluateBoard(board) {
    let score = 0;

    // Evaluate rows
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            const slice = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
            score += evaluateSlice(slice);
        }
    }

    // Evaluate columns
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
            const slice = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
            score += evaluateSlice(slice);
        }
    }

    // Evaluate diagonals (positive slope)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const slice = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
            score += evaluateSlice(slice);
        }
    }

    // Evaluate diagonals (negative slope)
    for (let row = 3; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            const slice = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
            score += evaluateSlice(slice);
        }
    }

    return score;
}

// Evaluate a slice of 4 cells
function evaluateSlice(slice) {
    let score = 0;
    const computerCount = slice.filter(cell => cell === 'yellow').length;
    const humanCount = slice.filter(cell => cell === 'red').length;
    const emptyCount = slice.filter(cell => cell === null).length;

    if (computerCount === 4) score += 100;
    else if (computerCount === 3 && emptyCount === 1) score += 5;
    else if (computerCount === 2 && emptyCount === 2) score += 2;

    if (humanCount === 4) score -= 100;
    else if (humanCount === 3 && emptyCount === 1) score -= 5;
    else if (humanCount === 2 && emptyCount === 2) score -= 2;

    return score;
}

// Check for a win
function checkForWin(player) {
    // Check horizontal wins
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                gameState[row][col] === player &&
                gameState[row][col + 1] === player &&
                gameState[row][col + 2] === player &&
                gameState[row][col + 3] === player
            ) {
                return true; // Horizontal win
            }
        }
    }

    // Check vertical wins
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
            if (
                gameState[row][col] === player &&
                gameState[row + 1][col] === player &&
                gameState[row + 2][col] === player &&
                gameState[row + 3][col] === player
            ) {
                return true; // Vertical win
            }
        }
    }

    // Check diagonal wins (positive slope)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                gameState[row][col] === player &&
                gameState[row + 1][col + 1] === player &&
                gameState[row + 2][col + 2] === player &&
                gameState[row + 3][col + 3] === player
            ) {
                return true; // Diagonal win (positive slope)
            }
        }
    }

    // Check diagonal wins (negative slope)
    for (let row = 3; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                gameState[row][col] === player &&
                gameState[row - 1][col + 1] === player &&
                gameState[row - 2][col + 2] === player &&
                gameState[row - 3][col + 3] === player
            ) {
                return true; // Diagonal win (negative slope)
            }
        }
    }

    return false; // No win
}

// Check if the board is full
function isBoardFull() {
    return gameState.every(row => row.every(cell => cell !== null));
}

// Reset the game
function resetGame() {
    gameState = Array(6).fill().map(() => Array(7).fill(null));
    currentPlayer = 'red';
    updateBoard();
}