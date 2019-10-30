export default function AI(name, id, CALC_TIME = 500) {
  const token = ['X', 'O'][id];

  const playToEnd = (gs) => {
    let status;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      status = gs.getStatus();
      if (status.status !== 'playing') {
        break;
      }
      const valid = gs.getValidMoves();
      const move = valid[Math.floor(Math.random() * valid.length)];
      gs.playMove(move);
    }
    return status;
  };

  const calcMove = (gs) => {
    const stats = gs.getValidMoves().map((move) => ({ move, score: 0, total: 0 }));
    let times = 0;
    for (let eta = Date.now() + CALC_TIME; Date.now() < eta && times < 1e5; times += 1) {
      const moveIdx = Math.floor(Math.random() * stats.length);
      const { move } = stats[moveIdx];
      const newGS = gs.clone();
      newGS.playMove(move);
      const { status, player = {} } = playToEnd(newGS);
      if (status === 'win') {
        if (player.token === token) {
          stats[moveIdx].score += 1;
        } else {
          stats[moveIdx].score -= 1;
        }
      }
      stats[moveIdx].total += 1;
    }

    // console.log('Times', times);

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
