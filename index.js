document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const modeSelector = document.getElementById('mode');
    const turnElement = document.getElementById('turn');
    const statusElement = document.getElementById('status');
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const modalElement = document.getElementById('modal');
    const modalMessageElement = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again');

    let board = ['', '', '', '', '', '', '', '', '','','', '', '', '', '', '', '', '', '','','', '', '', '', '', '', '', '', '','',];
    let currentPlayer = 'X';
    let gameActive = true;
    let playerMode = modeSelector.value; // Default: Player vs Player
    let playerXScore = 0;
    let playerOScore = 0;

    const winPatterns = [
        [0, 6, 12, 18, 24],
        [1, 7, 13, 19, 25],
        [6, 7, 8, 9, 10, 11],
        [2, 8, 14, 20, 26],
        [3, 9, 15, 21, 27],
        [4, 10, 16, 22, 28],
        [5, 11, 17, 23, 29],
        [0, 7, 14, 21, 28],
        [6, 13, 20, 27],
        [5, 10, 15, 20, 25],
        [4, 9, 14, 19, 24],
        [3, 8, 13, 18, 23],
        [0, 1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17],
        [18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29],
    ];

    const renderBoard = () => {
        boardElement.innerHTML = '';
        board.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (value === 'X' || value === 'O') {
                cell.textContent = value;
            }
            cell.addEventListener('click', () => handleCellClick(index));
            boardElement.appendChild(cell);
        });
        updateBoardColors();
    };

    const handleCellClick = (index) => {
        if (gameActive && board[index] === '') {
            board[index] = currentPlayer;
            renderBoard();

            if (checkWinner()) {
                endGame(`${currentPlayer} Wins!`);
            } else if (board.every(cell => cell !== '')) {
                endGame('Draw!');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurn();

				   if (currentPlayer === 'O') {
			 if (playerMode === 'pva'){
            makeAIMove();
			 }
			  if (playerMode === 'pvb'){
            makeAIMoveb();
			 }
			  if (playerMode === 'pvc'){
            makeAIMovec();
			 }
        }
            }
        }
    };

    const updateTurn = () => {
        turnElement.textContent = `Turn: Player ${currentPlayer}`;
    };

    const checkWinner = () => {
        for (const pattern of winPatterns) {
            const [a, b, c,d,e,f] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c,d,e] ) {
                highlightWinningCells(pattern);
                return board[a];
            
            
           }
    }
        return null;
    };

    const highlightWinningCells = (pattern) => {
        pattern.forEach((index) => {
            const cellElement = boardElement.children[index];
            cellElement.classList.add('winner');
        });
    };

    const endGame = (message) => {
        gameActive = false;
        statusElement.textContent = message;

        if (message.includes('Wins')) {
            currentPlayer === 'X' ? playerXScore++ : playerOScore++;
			if(playerXScore===5){
				showModal('Player X won the game');
				playerXScore=0;
				playerOScore=0;
			     resetGame();
				        updateScore();
		}
			else if(playerOScore===5){
				showModal('Player O won the game');
						playerXScore=0;
				playerOScore=0;
			     resetGame();
				        updateScore();
		}
		else{
            updateScore();
			showModal(message);
			}
        }else{
			    updateScore();
			showModal(message);
		}

        
    };

    const updateScore = () => {
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
        playerOScoreElement.textContent = `Player O: ${playerOScore}`;
    };

    const showModal = (message) => {
        modalMessageElement.textContent = message;
        modalElement.style.display = 'flex';
    };

    const hideModal = () => {
        modalElement.style.display = 'none';
    };

    const makeAIMove = () => {
        let bestMove;
            bestMove = getRandomMove();
  

        handleCellClick(bestMove);
    };
	
	
    const makeAIMoveb = () => {
        let bestMove;
let i=0;
        // Rastgele bir hamle yapılacak ilk tur
		if(i===0){
        if (board.filter(cell => cell !== '').length === 1) {
            bestMove = getRandomMove();
        } else {
            // İlerleyen turlarda stratejik hamle yapılacak
            bestMove = getBestMove();
        }
		i++;
		}else{
			   bestMove = getRandomMove();
			i=0;
		}
        handleCellClick(bestMove);
    };
	
	
    const makeAIMovec = () => {
        let bestMove;
            bestMove = getBestMove();
        handleCellClick(bestMove);
    };

    const getRandomMove = () => {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    };

    const getBestMove = () => {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 29; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -1,
            O: 1,
            tie: 0
        };

        const winner = checkWinner();
        if (winner !== null) {
            return scores[winner] / depth;
        }

        if (isTerminal()) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 29; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 29; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const updateBoardColors = () => {
        for (let i = 0; i < 29; i++) {
            const cellElement = boardElement.children[i];
            cellElement.classList.remove('winner');
        }
    };

    const isTerminal = () => {
        return checkWinner() !== null || board.every(cell => cell !== '');
    };

    modeSelector.addEventListener('change', () => {
        const previousMode = playerMode;
        playerMode = modeSelector.value;

        if (previousMode !== playerMode) {
            // Oyun modu değiştiğinde skorları sıfırla
            playerXScore = 0;
            playerOScore = 0;
            updateScore();
        }

        resetGame();
    });

    playAgainButton.addEventListener('click', () => {
        hideModal();
        resetGame();
    });

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', '','','', '', '', '', '', '', '', '', '','','', '', '', '', '', '', '', '', '','',];

        currentPlayer = 'X';
        gameActive = true;
        statusElement.textContent = '';
        renderBoard();

        if (currentPlayer === 'O') {
			 if (playerMode === 'pva'){
            makeAIMove();
			 }
			  if (playerMode === 'pvb'){
            makeAIMoveb();
			 }
			  if (playerMode === 'pvc'){
            makeAIMovec();
			 }
        }
    };

    resetGame();
});