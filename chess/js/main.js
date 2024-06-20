
let board;
let game = new Chess();
let nodesCounter = 0;
//"7k/P4p2/7p/1K1p4/1P1P4/2P5/8/8 w - - 1 57"

/////////////////////////////////////// Interface Bindings   /////////////////////////////////////////////////////

const historyContainer = document.getElementById('log-container');
const turnLabel = document.getElementById('turn-label');
const endTitleLabel = document.getElementById('end-label');
const restartBtn = document.getElementById('restart-btn');
const fenInput = document.getElementById('fen-input');
const loadButton = document.getElementById('load-button');
const endContent = document.getElementById('end-content');

restartBtn.addEventListener('click', restartBtnClicked);
loadButton.addEventListener('click', loadButtonClicked);

function getActiveDepth() {
    const radios = document.getElementsByName('depth');

    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return +radios[i].value;
            break;
        }
    }
}

function openModal() {
    window.location.hash = 'openModal';
}


/////////////////////////////////////// Interface Updates    /////////////////////////////////////////////////////

function restartBtnClicked() {
    game = new Chess();

    historyContainer.innerHTML = '';

    updateBoard();
}

function loadButtonClicked() {
    game = new Chess(fenInput.value);
    historyContainer.innerHTML = '';
    updateBoard();

    if (game.turn() == 'b') {
        AIMove();
    }
}

function updateBoard() {
    board.position(game.fen());
    fenInput.value = game.fen();
}

function handleGameOver() {
    if (!game.game_over()) {
        return;
    }

    let turn = game.turn();

    if (game.in_checkmate()) {
        if (turn === 'w') {
            endTitleLabel.innerHTML = 'You Lose';
            endContent.innerHTML = 'The AI has you in a Checkmate.'
        }else {
            endTitleLabel.innerHTML = 'You Win';
            endContent.innerHTML = 'Congratulations, you managed to checkmate the AI.'
        }
    }

    if (game.in_draw()) {
        endTitleLabel.innerHTML = 'Draw';
        endContent.innerHTML = 'The game finished in a draw.'
    }

    if (game.in_stalemate()) {
        endTitleLabel.innerHTML = 'Draw';
        endContent.innerHTML = 'A Stalemate has been reached.'
    }

    openModal();
}

function updateUIAfterMove(move) {
    
    const description = document.createElement('div');
    description.innerHTML = descriptionFromMove(move);
    historyContainer.appendChild(description);

    updateBoard();

    if (game.game_over()) {
        handleGameOver();
    }
}

/////////////////////////////////////// AI                   /////////////////////////////////////////////////////

function minMaxStart(depth, game) {
    nodesCounter = 1;
    if (depth <= 0) {
        return evaluateBoard(game.board());
    }
    const moves = game.ugly_moves();
    shuffle(moves);
    let bestScore = Infinity;
    let bestMove = moves[0];
    let alpha = -Infinity;
    let beta = Infinity;

    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        game.ugly_move(move);
        let score = minMax(depth - 1, alpha, beta, game, false);
        game.undo();

        alpha = Math.min(alpha, score);

        if (score < bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    console.log('Analyzed', nodesCounter, 'Nodes');
    return bestMove;
}

function minMax(depth, alpha, beta, game, isAI) {
    nodesCounter++;
    if (depth <= 0) {
        return evaluateBoard(game.board());
    }

    const moves = game.ugly_moves();
    let bestScore = isAI ? Infinity : -Infinity;

    for (let i = 0; i < moves.length; i++) {
        move = moves[i];

        game.ugly_move(move);
        let score = minMax(depth - 1, alpha, beta, game, !isAI);
        game.undo();

        if (isAI) {
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
        } else {
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
        }

        if (beta <= alpha) {
            break;
        }
    };

    return bestScore;
}


function AIMove() {
    if (!game.game_over()) {
        turnLabel.innerHTML = "The PC is Thinking...";
        setTimeout(() => {
            let bestMove = minMaxStart(getActiveDepth(), game);
            
            let move = game.ugly_move(bestMove);
            updateUIAfterMove(move);

            turnLabel.innerHTML = "Your Turn";
        }, 400);
    }
}

/////////////////////////////////////// Logic                /////////////////////////////////////////////////////



// do not pick up pieces if the game is over
// only pick up pieces for the side to move
function onDragStart(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b')) {
    return false;
  }
};

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  // illegal move
  if (move === null) return 'snapback';

  // Legal move
  updateUIAfterMove(move);

  // Computer turn
  AIMove();
};



const cfg = {
  draggable: true,
  dropOffBoard: 'snapback', // this is the default
  position: game.fen(),
  onDragStart: onDragStart,
  onDrop: onDrop
};

board = ChessBoard('board', cfg);
updateBoard();

/////////////////////////////////////// Heuristics             /////////////////////////////////////////////////////
const PAWN = game.PAWN;
const BISHOP = game.BISHOP;
const KNIGHT = game.KNIGHT;
const ROOK = game.ROOK;
const QUEEN = game.QUEEN;
const KING = game.KING;

const PIECE_VAL = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000
};

const PAWN_WHITE_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
];
const PAWN_BLACK_TABLE = reverseArray(PAWN_WHITE_TABLE);

const KNIGHT_WHITE_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
];
const KNIGHT_BLACK_TABLE = reverseArray(KNIGHT_WHITE_TABLE);

const BISHOP_WHITE_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
];
const BISHOP_BLACK_TABLE = reverseArray(BISHOP_WHITE_TABLE);

const ROOK_WHITE_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];
const ROOK_BLACK_TABLE = reverseArray(ROOK_WHITE_TABLE);

const QUEEN_WHITE_TABLE = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
];
const QUEEN_BLACK_TABLE = reverseArray(QUEEN_WHITE_TABLE);

const KING_WHITE_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
];
const KING_BLACK_TABLE = reverseArray(KING_WHITE_TABLE);


const WHITE_TABLES = {
    p: PAWN_WHITE_TABLE,
    n: KNIGHT_WHITE_TABLE,
    b: BISHOP_WHITE_TABLE,
    r: ROOK_WHITE_TABLE,
    q: QUEEN_WHITE_TABLE,
    k: KING_WHITE_TABLE
};

const BLACK_TABLES = {
    p: PAWN_BLACK_TABLE,
    n: KNIGHT_BLACK_TABLE,
    b: BISHOP_BLACK_TABLE,
    r: ROOK_BLACK_TABLE,
    q: QUEEN_BLACK_TABLE,
    k: KING_BLACK_TABLE
};


/////////////////////////////////////// Helpers                /////////////////////////////////////////////////////

function reverseArray(arr) {
    return arr.slice().reverse();
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function evaluateBoard(board) {
    let score = 0;

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            score = score + evaluatePiece(board[r][c], r, c);
        }
    }

    return score;
}

function evaluatePiece(piece, row, col) {
    if (piece === null) {
        return 0;
    }
    
    const mod = piece.color == 'w' ? 1 : -1;
    const placeIndex = row * 8 + col;
    const placeMod = piece.color == 'w'
                        ? WHITE_TABLES[piece.type][placeIndex]
                        : BLACK_TABLES[piece.type][placeIndex];

    return (PIECE_VAL[piece.type] + placeMod) * mod;
}


function descriptionFromMove(move) {
    return `${move.color === 'w' ? 'You' : 'AI'} Moved: ${move.san}`;
}
