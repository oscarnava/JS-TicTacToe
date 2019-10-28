const Board = function Board() {
  const cells = new Array(9);

  const checkIfWinner = (player) => (
    (cells[0] === player && cells[1] === player && cells[2] === player)
    || (cells[3] === player && cells[4] === player && cells[5] === player)
    || (cells[6] === player && cells[7] === player && cells[8] === player)
    || (cells[0] === player && cells[3] === player && cells[6] === player)
    || (cells[1] === player && cells[4] === player && cells[7] === player)
    || (cells[2] === player && cells[5] === player && cells[8] === player)
    || (cells[0] === player && cells[4] === player && cells[8] === player)
    || (cells[2] === player && cells[4] === player && cells[6] === player)
  );

  const validMove = (move) => (move >= 1) && (move <= 9) && (cells[move - 1] === undefined);

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
    if (!cells.includes()) {
      return -1;
    }
    return null;
  };

  const toString = () => {
    cells.map((cell) => (cell === undefined ? ' ' : ['X', 'O'][cell]));
  };

  return {
    validMove,
    setCell,
    winner,
    toString,
  };
};
