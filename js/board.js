/* eslint-disable no-bitwise */
export default function Board(cells = new Array(9).fill(0)) {
  const checkIfWinner = () => {
    const [a, b, c, d, e, f, g, h, i] = cells;
    return (a & b & c)
        || (d & e & f)
        || (g & h & i)
        || (a & d & g)
        || (b & e & h)
        || (c & f & i)
        || (a & e & i)
        || (c & e & g);
  };

  const validMove = (move) => (move >= 1) && (move <= 9) && !cells[move - 1];

  const getValidMoves = () => cells
    .reduce((acc, cell, index) => (cell ? acc : acc.concat(index + 1)), []);

  const setCell = (pos, value) => { cells[pos - 1] = value + 1; };

  const winner = () => {
    const winr = checkIfWinner();
    if (winr) {
      return winr - 1;
    }
    if (!cells.includes(0)) {
      return -1;
    }
    return null;
  };

  const toString = () => cells.map((cell) => [' ', 'X', 'O'][cell]);

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
