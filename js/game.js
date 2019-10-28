const gameState = (function GameState() {
  const board = Board();
  const players = [];
  let currentPlayer = 0;

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

  const getWinner = () => {
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

  return {
    setPlayer,
    playMove,
    getWinner,
  };
}());
