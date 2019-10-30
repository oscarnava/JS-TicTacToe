// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dTec":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Board;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable no-bitwise */
function Board() {
  var cells = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Array(9).fill(0);

  var checkIfWinner = function checkIfWinner() {
    var _cells = _slicedToArray(cells, 9),
        a = _cells[0],
        b = _cells[1],
        c = _cells[2],
        d = _cells[3],
        e = _cells[4],
        f = _cells[5],
        g = _cells[6],
        h = _cells[7],
        i = _cells[8];

    return a & b & c || d & e & f || g & h & i || a & d & g || b & e & h || c & f & i || a & e & i || c & e & g;
  };

  var validMove = function validMove(move) {
    return move >= 1 && move <= 9 && !cells[move - 1];
  };

  var getValidMoves = function getValidMoves() {
    return cells.reduce(function (acc, cell, index) {
      return cell ? acc : acc.concat(index + 1);
    }, []);
  };

  var setCell = function setCell(pos, value) {
    cells[pos - 1] = value + 1;
  };

  var winner = function winner() {
    var winr = checkIfWinner();

    if (winr) {
      return winr - 1;
    }

    if (!cells.includes(0)) {
      return -1;
    }

    return null;
  };

  var toString = function toString() {
    return cells.map(function (cell) {
      return [' ', 'X', 'O'][cell];
    });
  };

  var clone = function clone() {
    return Board(_toConsumableArray(cells));
  };

  return {
    validMove: validMove,
    getValidMoves: getValidMoves,
    setCell: setCell,
    winner: winner,
    toString: toString,
    clone: clone
  };
}
},{}],"eDsD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Player;

function Player(name, id) {
  var token = ['X', 'O'][id];

  var playMove = function playMove() {};

  return {
    name: name,
    token: token,
    playMove: playMove
  };
}
},{}],"FCUV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AI;

function AI(name, id) {
  var CALC_TIME = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
  var token = ['X', 'O'][id];

  var playToEnd = function playToEnd(gs, start) {
    gs = gs.clone();
    gs.playMove(start);
    var status = gs.getStatus();
    var moves = 1;

    while (status.status === 'playing') {
      var valid = gs.getValidMoves();
      var move = valid[Math.floor(Math.random() * valid.length)];
      gs.playMove(move);
      status = gs.getStatus();
      moves += 1;
    }

    status.moves = moves;
    return status;
  };

  var calcMove = function calcMove(gs) {
    var stats = gs.getValidMoves().map(function (move) {
      return {
        move: move,
        score: 0,
        total: 0
      };
    });
    var times = 0;

    for (var eta = Date.now() + CALC_TIME; Date.now() < eta && times < 5e4; times += 1) {
      var stat = stats[Math.floor(Math.random() * stats.length)];

      var _playToEnd = playToEnd(gs, stat.move),
          status = _playToEnd.status,
          moves = _playToEnd.moves,
          _playToEnd$player = _playToEnd.player,
          player = _playToEnd$player === void 0 ? {} : _playToEnd$player;

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
    var best = stats.reduce(function (_ref, _ref2) {
      var bestMove = _ref.bestMove,
          bestScore = _ref.bestScore;
      var move = _ref2.move,
          score = _ref2.score,
          total = _ref2.total;
      var avg = score / total;

      if (avg > bestScore) {
        return {
          bestMove: move,
          bestScore: avg
        };
      }

      return {
        bestMove: bestMove,
        bestScore: bestScore
      };
    }, {
      bestMove: 0,
      bestScore: -9e99
    });
    return best.bestMove;
  };

  var playMove = function playMove(gs, makeMove) {
    var move = calcMove(gs);
    setTimeout(function () {
      return makeMove(move);
    }, 100);
  };

  return {
    name: name,
    token: token,
    playMove: playMove
  };
}
},{}],"IEHn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _board = _interopRequireDefault(require("./board"));

var _player = _interopRequireDefault(require("./player"));

var _ai = _interopRequireDefault(require("./ai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var gameState = function GameState() {
  var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _board.default)();
  var players = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var currentPlayer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var newGame = function newGame() {
    var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    board = (0, _board.default)();
    currentPlayer = player;
  };

  var setPlayer = function setPlayer(name, id) {
    var isAI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    players[id] = isAI ? (0, _ai.default)(name, id) : (0, _player.default)(name, id);
  };

  var playMove = function playMove(move) {
    if (board.validMove(move)) {
      board.setCell(move, currentPlayer);
      currentPlayer = 1 - currentPlayer;
      return true;
    }

    return false;
  };

  var getStatus = function getStatus() {
    switch (board.winner()) {
      case 0:
        return {
          status: 'win',
          player: players[0]
        };

      case 1:
        return {
          status: 'win',
          player: players[1]
        };

      case -1:
        return {
          status: 'draw'
        };

      default:
        return {
          status: 'playing'
        };
    }
  };

  var getBoardState = function getBoardState() {
    return board.toString();
  };

  var clone = function clone() {
    return GameState(board.clone(), _toConsumableArray(players), currentPlayer);
  };

  var getValidMoves = function getValidMoves() {
    return board.getValidMoves();
  };

  var nextPlayerTurn = function nextPlayerTurn(makeMove) {
    players[currentPlayer].playMove(gameState, makeMove);
  };

  return {
    setPlayer: setPlayer,
    playMove: playMove,
    getStatus: getStatus,
    getBoardState: getBoardState,
    newGame: newGame,
    clone: clone,
    getValidMoves: getValidMoves,
    nextPlayerTurn: nextPlayerTurn
  };
}();

var _default = gameState;
exports.default = _default;
},{"./board":"dTec","./player":"eDsD","./ai":"FCUV"}],"QvaY":[function(require,module,exports) {
"use strict";

var _game = _interopRequireDefault(require("./game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ROBOHASH_URL = 'https://robohash.org';
window.gs = _game.default;
var qrySelect = document.querySelector.bind(document);

var _map = ['#tic-tac-toe', '#winner', '#player-1', '#player-2', '#ai-1', '#ai-2', '#play', '#avatar-1', '#avatar-2'].map(qrySelect),
    _map2 = _slicedToArray(_map, 9),
    ticTacToe = _map2[0],
    winner = _map2[1],
    player1 = _map2[2],
    player2 = _map2[3],
    ai1 = _map2[4],
    ai2 = _map2[5],
    playBtn = _map2[6],
    avatar1Img = _map2[7],
    avatar2Img = _map2[8];

function renderBoard() {
  _game.default.getBoardState().forEach(function (cell, index) {
    ticTacToe.children[index].className = "cell ".concat(cell.toLowerCase()).trim();
  });
}

function makeMove(move) {
  qrySelect("#cell-".concat(move)).click();
  renderBoard();
}

function startGame() {
  _game.default.newGame();

  _game.default.setPlayer(player1.value, 0, ai1.checked);

  _game.default.setPlayer(player2.value, 1, ai2.checked);

  avatar1Img.src = "".concat(ROBOHASH_URL, "/").concat(player1.value);
  avatar2Img.src = "".concat(ROBOHASH_URL, "/").concat(player2.value);
  ticTacToe.style.display = 'grid';
  winner.style.display = 'none';
  playBtn.style.display = 'none';
  renderBoard();

  _game.default.nextPlayerTurn(makeMove);
}

function play(event) {
  if (!event.target.classList.contains('cell') || _game.default.getStatus().status !== 'playing') {
    return;
  }

  _game.default.playMove(event.target.id.split('-')[1]);

  renderBoard();

  var _gameState$getStatus = _game.default.getStatus(),
      status = _gameState$getStatus.status,
      _gameState$getStatus$ = _gameState$getStatus.player;

  _gameState$getStatus$ = _gameState$getStatus$ === void 0 ? {} : _gameState$getStatus$;
  var name = _gameState$getStatus$.name;

  if (status !== 'playing') {
    winner.textContent = status === 'win' ? "Winner: ".concat(name) : 'No winner!';
    winner.style.display = 'block';
    playBtn.textContent = 'Play again!';
    playBtn.style.display = 'block';
  } else {
    _game.default.nextPlayerTurn(makeMove);
  }
}

ticTacToe.addEventListener('click', play);
playBtn.addEventListener('click', startGame);
},{"./game":"IEHn"}]},{},["QvaY"], null)