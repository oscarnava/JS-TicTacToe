export default function Board(cells = new Array(9).fill(null)) {
  const checkIfWinner = player => (
    (cells[0] === player && cells[1] === player && cells[2] === player)
    || (cells[3] === player && cells[4] === player && cells[5] === player)
    || (cells[6] === player && cells[7] === player && cells[8] === player)
    || (cells[0] === player && cells[3] === player && cells[6] === player)
    || (cells[1] === player && cells[4] === player && cells[7] === player)
    || (cells[2] === player && cells[5] === player && cells[8] === player)
    || (cells[0] === player && cells[4] === player && cells[8] === player)
    || (cells[2] === player && cells[4] === player && cells[6] === player)
  );

  const validMove = move => (move >= 1) && (move <= 9) && (cells[move - 1] === null);

  const getValidMoves = () => cells
    .reduce((acc, cell, index) => (cell === null ? [...acc, index + 1] : acc), []);

  const setCell = (pos, value) => {
    cells[pos - 1] = value;
  };

  const winner = () => {
    if (checkIfWinner(0)) {
      return 0;
    }
    if (checkIfWinner(1)) {
      return 1;
    }
    if (!cells.includes(null)) {
      return -1;
    }
    return null;
  };

  const toString = () => cells.map(cell => (cell === null ? ' ' : ['X', 'O'][cell]));

  const clone = () => Board([...cells]);

  return {
    validMove,
    getValidMoves,
    setCell,
    winner,
    toString,
    clone,
  };
}
