export default function AI(name, id, CALC_TIME = 500) {
  const token = ['X', 'O'][id];

  const playToEnd = (gs, start) => {
    gs = gs.clone();
    gs.playMove(start);

    let status = gs.getStatus();
    let moves = 1;
    while (status.status === 'playing') {
      const valid = gs.getValidMoves();
      const move = valid[Math.floor(Math.random() * valid.length)];
      gs.playMove(move);
      status = gs.getStatus();
      moves += 1;
    }
    status.moves = moves;
    return status;
  };

  const calcMove = (gs) => {
    const stats = gs.getValidMoves().map((move) => ({ move, score: 0, total: 0 }));
    let times = 0;
    for (let eta = Date.now() + CALC_TIME; Date.now() < eta && times < 5e4; times += 1) {
      const stat = stats[Math.floor(Math.random() * stats.length)];
      const { status, moves, player = {} } = playToEnd(gs, stat.move);
      if (status === 'win') {
        if (player.token === token) {
          stat.score += 1.0 / moves;
        } else {
          stat.score -= 1.0 / moves;
        }
      } else if (status === 'draw') {
        stat.score += 0.25 / moves;
      }
      stat.total += 1;
    }

    console.log('Times', times, stats);

    const best = stats.reduce(({ bestMove, bestScore }, { move, score, total }) => {
      const avg = score / total;
      if (avg > bestScore) {
        return { bestMove: move, bestScore: avg };
      }
      return { bestMove, bestScore };
    }, { bestMove: 0, bestScore: -9e99 });

    return best.bestMove;
  };


  const playMove = (gs, makeMove) => {
    const move = calcMove(gs);
    setTimeout(() => makeMove(move), 100);
  };

  return {
    name,
    token,
    playMove,
  };
}
