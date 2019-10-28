const Player = function Player(name, id) {
  const token = ['X', 'O'][id];

  return {
    name,
    token,
  };
};
