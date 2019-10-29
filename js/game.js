import Board from './board';
import Player from './player';
import AI from './ai';

const gameState = (function GameState(board = Board(), players = [], currentPlayer = 0) {
  const newGame = (player = 0) => {
    board = Board();
    currentPlayer = player;
  };

  const setPlayer = (name, id, isAI = false) => {
    players[id] = isAI ? AI(name, id) : Player(name, id);
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

  const clone = () => {
    return GameState(board.clone(), [...players], currentPlayer);
  };

  const getValidMoves = () => board.getValidMoves();

  const nextPlayerTurn = (makeMove) => {
    players[currentPlayer].playMove(gameState, makeMove);
  };

  return {
    setPlayer,
    playMove,
    getStatus,
    getBoardState,
    newGame,
    clone,
    getValidMoves,
    nextPlayerTurn,
  };
}());

export default gameState;
