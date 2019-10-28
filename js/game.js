import Board from './board';
import Player from './player';

const gameState = (function GameState() {
  let board = Board();
  const players = [];
  let currentPlayer = 0;

  const newGame = (player) => {
    board = Board();
    currentPlayer = player;
  };

  const setPlayer = (name, id) => {
    players[id] = Player(name, id);
  };

  const playMove = (move) => {
    if (board.validMove(move)) {
      board.setCell(move, currentPlayer);
      currentPlayer = 1 - currentPlayer;
      return true;
    }
    return false;
  };

  const getStatus = () => {
    switch (board.winner()) {
      case 0:
        return { status: 'win', player: players[0] };
      case 1:
        return { status: 'win', player: players[1] };
      case -1:
        return { status: 'draw' };
      default:
        return { status: 'playing' };
    }
  };

  const getBoardState = () => board.toString();

  return {
    setPlayer,
    playMove,
    getStatus,
    getBoardState,
    newGame,
  };
}());

export default gameState;
