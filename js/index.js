import gameState from './game';

const ROBOHASH_URL = 'https://robohash.org';

window.gs = gameState;

const ticTacToe = document.querySelector('#tic-tac-toe');
const winner = document.querySelector('#winner');

function renderBoard() {
  gameState.getBoardState().forEach((cell, index) => {
    if (cell === ' ') {
      document.querySelector('#tic-tac-toe').children[index].className = 'cell';
    } else {
      document.querySelector('#tic-tac-toe').children[index].classList.add(cell.toLowerCase());
    }
  });
}

function avatarImg(name, id) {
  const img = document.createElement('img');
  img.src = `${ROBOHASH_URL}/${name}`;
  img.id = `avatar-${id}`;
  return img;
}

function makeMove(move) {
  document.querySelector(`#cell-${move}`).click();
  renderBoard();
}

function startGame() {
  gameState.newGame();
  const player1 = document.querySelector('#player-1').value;
  const player2 = document.querySelector('#player-2').value;
  gameState.setPlayer(player1, 0, true);
  gameState.setPlayer(player2, 1, true);
  document.querySelector('#avatar-1').replaceWith(avatarImg(player1, 1));
  document.querySelector('#avatar-2').replaceWith(avatarImg(player2, 2));

  ticTacToe.style.display = 'grid';
  renderBoard();
  winner.style.display = 'none';

  gameState.nextPlayerTurn(makeMove);
}

function play(event) {
  if (!event.target.classList.contains('cell') || gameState.getStatus().status !== 'playing') {
    return;
  }

  const id = event.target.id.split('-')[1];

  gameState.playMove(id);
  renderBoard();

  const { status, player: { name, token } = {} } = gameState.getStatus();

  if (status === 'win') {
    winner.textContent = `Winner: ${name}`;
    winner.classList.add(token.toLowerCase());
    winner.style.display = 'block';
    document.querySelector('#play').textContent = 'Play again!';
  } else if (status !== 'draw') {
    gameState.nextPlayerTurn(makeMove);
  }
}

ticTacToe.addEventListener('click', play);
document.querySelector('#play').addEventListener('click', startGame);
