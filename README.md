# Connect Four Game

## Overview
Connect Four is a classic two-player strategy game in which players take turns dropping colored discs into a vertical grid. The objective is to be the first to align four of their discs either horizontally, vertically, or diagonally.

This project implements a Connect Four game with an AI opponent using the Minimax algorithm and Alpha-Beta pruning for optimization.

## How to Play
1. The game is played on a 7-column by 6-row board.
2. Players take turns dropping their pieces into a column of their choice.
3. The piece falls to the lowest available space in the column.
4. The game ends when a player connects four pieces in a row, column, or diagonal, or when the board is full (resulting in a draw).

## Minimax Algorithm
The Minimax algorithm is used to determine the best move for the AI player. It evaluates all possible moves and assigns scores based on the likelihood of winning or losing. 

### Steps:
1. Generate all possible moves from the current board state.
2. Simulate each move and recursively evaluate future board states.
3. Assign scores to terminal states (win, lose, or draw).
4. Choose the move that maximizes the AI’s chance of winning while minimizing the opponent’s advantage.

### Minimax Implementation
```javascript
function minimax(board, depth, alpha, beta, isMaximizing) {
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
```

## Alpha-Beta Pruning
Alpha-Beta Pruning is an optimization of the Minimax algorithm that reduces the number of nodes evaluated by eliminating branches that won’t be chosen.

### How it Works:
1. Alpha represents the best value the maximizing player (AI) can guarantee.
2. Beta represents the best value the minimizing player (opponent) can guarantee.
3. If the AI finds a move better than Beta, it stops evaluating that branch (pruning).
4. If the opponent finds a move worse than Alpha, it stops evaluating that branch.

This significantly improves efficiency, allowing deeper searches in the same time frame.



