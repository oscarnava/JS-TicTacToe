export default function Player(name, id) {
  const token = ['X', 'O'][id];

  const playMove = () => {};

  return {
    name,
    token,
    playMove,
  };
}
