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
})({"js/board.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Board;

/* eslint-disable no-bitwise */
function Board(cells = new Array(9).fill(0)) {
  const checkIfWinner = () => {
    const [a, b, c, d, e, f, g, h, i] = cells;
    return a & b & c || d & e & f || g & h & i || a & d & g || b & e & h || c & f & i || a & e & i || c & e & g;
  };

  const validMove = move => move >= 1 && move <= 9 && !cells[move - 1];

  const getValidMoves = () => cells.reduce((acc, cell, index) => cell ? acc : acc.concat(index + 1), []);

  const setCell = (pos, value) => {
    cells[pos - 1] = value + 1;
  };

  const winner = () => {
    const winr = checkIfWinner();

    if (winr) {
      return winr - 1;
    }

    if (!cells.includes(0)) {
      return -1;
    }

    return null;
  };

  const toString = () => cells.map(cell => [' ', 'X', 'O'][cell]);

  const clone = () => Board([...cells]);

  return {
    validMove,
    getValidMoves,
    setCell,
    winner,
    toString,
    clone
  };
}
},{}],"js/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Player;

function Player(name, id) {
  const token = ['X', 'O'][id];

  const playMove = () => {};

  return {
    name,
    token,
    playMove
  };
}
},{}],"js/ai.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AI;

function AI(name, id, CALC_TIME = 500) {
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

  const calcMove = gs => {
    const stats = gs.getValidMoves().map(move => ({
      move,
      score: 0,
      total: 0
    }));
    let times = 0;

    for (let eta = Date.now() + CALC_TIME; Date.now() < eta && times < 5e4; times += 1) {
      const stat = stats[Math.floor(Math.random() * stats.length)];
      const {
        status,
        moves,
        player = {}
      } = playToEnd(gs, stat.move);

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
    const best = stats.reduce(({
      bestMove,
      bestScore
    }, {
      move,
      score,
      total
    }) => {
      const avg = score / total;

      if (avg > bestScore) {
        return {
          bestMove: move,
          bestScore: avg
        };
      }

      return {
        bestMove,
        bestScore
      };
    }, {
      bestMove: 0,
      bestScore: -9e99
    });
    return best.bestMove;
  };

  const playMove = (gs, makeMove) => {
    const move = calcMove(gs);
    setTimeout(() => makeMove(move), 100);
  };

  return {
    name,
    token,
    playMove
  };
}
},{}],"js/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _board = _interopRequireDefault(require("./board"));

var _player = _interopRequireDefault(require("./player"));

var _ai = _interopRequireDefault(require("./ai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gameState = function GameState(board = (0, _board.default)(), players = [], currentPlayer = 0) {
  const newGame = (player = 0) => {
    board = (0, _board.default)();
    currentPlayer = player;
  };

  const setPlayer = (name, id, isAI = false) => {
    players[id] = isAI ? (0, _ai.default)(name, id) : (0, _player.default)(name, id);
  };

  const playMove = move => {
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

  const getBoardState = () => board.toString();

  const clone = () => GameState(board.clone(), [...players], currentPlayer);

  const getValidMoves = () => board.getValidMoves();

  const nextPlayerTurn = makeMove => {
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
    nextPlayerTurn
  };
}();

var _default = gameState;
exports.default = _default;
},{"./board":"js/board.js","./player":"js/player.js","./ai":"js/ai.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _game = _interopRequireDefault(require("./game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ROBOHASH_URL = 'https://robohash.org';
window.gs = _game.default;
const qrySelect = document.querySelector.bind(document);
const [ticTacToe, winner, player1, player2, ai1, ai2, playBtn, avatar1Img, avatar2Img] = ['#tic-tac-toe', '#winner', '#player-1', '#player-2', '#ai-1', '#ai-2', '#play', '#avatar-1', '#avatar-2'].map(qrySelect);

function renderBoard() {
  _game.default.getBoardState().forEach((cell, index) => {
    ticTacToe.children[index].className = `cell ${cell.toLowerCase()}`.trim();
  });
}

function makeMove(move) {
  qrySelect(`#cell-${move}`).click();
  renderBoard();
}

function startGame() {
  _game.default.newGame();

  _game.default.setPlayer(player1.value, 0, ai1.checked);

  _game.default.setPlayer(player2.value, 1, ai2.checked);

  avatar1Img.src = `${ROBOHASH_URL}/${player1.value}`;
  avatar2Img.src = `${ROBOHASH_URL}/${player2.value}`;
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

  const {
    status,
    player: {
      name
    } = {}
  } = _game.default.getStatus();

  if (status !== 'playing') {
    winner.textContent = status === 'win' ? `Winner: ${name}` : 'No winner!';
    winner.style.display = 'block';
    playBtn.textContent = 'Play again!';
    playBtn.style.display = 'block';
  } else {
    _game.default.nextPlayerTurn(makeMove);
  }
}

ticTacToe.addEventListener('click', play);
playBtn.addEventListener('click', startGame);
},{"./game":"js/game.js"}],"d:/Users/Oscar/Repos/Microverse/js-tic-tac-toe/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60572" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["d:/Users/Oscar/Repos/Microverse/js-tic-tac-toe/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map