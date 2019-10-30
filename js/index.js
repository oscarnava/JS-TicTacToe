import gameState from './game';

const ROBOHASH_URL = 'https://robohash.org';

window.gs = gameState;

const qrySelect = document.querySelector.bind(document);
const [ticTacToe, winner, player1, player2, ai1, ai2, playBtn, avatar1Img, avatar2Img] = [
  '#tic-tac-toe', '#winner', '#player-1', '#player-2', '#ai-1', '#ai-2', '#play', '#avatar-1', '#avatar-2',
].map(qrySelect);

function renderBoard() {
  gameState.getBoardState().forEach((cell, index) => {
    ticTacToe.children[index].className = `cell ${cell.toLowerCase()}`.trim();
  });
}

function makeMove(move) {
  qrySelect(`#cell-${move}`).click();
  renderBoard();
}

function startGame() {
  gameState.newGame();

  gameState.setPlayer(player1.value, 0, ai1.checked);
  gameState.setPlayer(player2.value, 1, ai2.checked);

  avatar1Img.src = `${ROBOHASH_URL}/${player1.value}`;
  avatar2Img.src = `${ROBOHASH_URL}/${player2.value}`;

  ticTacToe.style.display = 'grid';
  winner.style.display = 'none';
  playBtn.style.display = 'none';

  renderBoard();
  gameState.nextPlayerTurn(makeMove);
}

function play(event) {
  if (!event.target.classList.contains('cell') || gameState.getStatus().status !== 'playing') {
    return;
  }

  gameState.playMove(event.target.id.split('-')[1]);
  renderBoard();

  const { status, player: { name } = {} } = gameState.getStatus();
  if (status !== 'playing') {
    winner.textContent = (status === 'win' ? `Winner: ${name}` : 'No winner!');
    winner.style.display = 'block';
    playBtn.textContent = 'Play again!';
    playBtn.style.display = 'block';
  } else {
    gameState.nextPlayerTurn(makeMove);
  }
}

ticTacToe.addEventListener('click', play);
playBtn.addEventListener('click', startGame);
