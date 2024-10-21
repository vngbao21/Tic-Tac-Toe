import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  const isBoardFull = squares.every((square) => square !== null); // Check board is full ?
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = (isBoardFull) ? 'The game is a draw!' : 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // For a 3x3 board
  const boardSize = 3; 
  const renderSquare = (i) => (
    <Square value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningSquares.includes(i)} />
  );

  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      squaresInRow.push(renderSquare(row * boardSize + col));
    }
    rows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // State for toggle sorting
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {

    let description;
    const { location } = step;
    const col = location % 3 + 1;
    const row = Math.floor(location / 3) + 1;

    if (move > 0) {
      description = 'Go to move #' + move + ' (' + row + ', ' + col + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {
          currentMove === move ? (description) : (<button onClick={() => jumpTo(move)}>{description}</button>)
        }
      </li>
    );
  });

   // Toggle sorting
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] }; // Return the winning squares
    }
  }
  return { winner: null, winningSquares: [] }; // No winner
}
