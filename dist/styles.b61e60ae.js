// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  const previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  const nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        const currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        const err = new Error(`Cannot find module '${name}'`);
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      const module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
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

  let error;
  for (let i = 0; i < entry.length; i++) {
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
    const mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(() => mainExports);

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
}({
  'node_modules/parcel-bundler/src/builtins/bundle-url.js': [function (require, module, exports) {
    let bundleURL = null;

    function getBundleURLCached() {
      if (!bundleURL) {
        bundleURL = getBundleURL();
      }

      return bundleURL;
    }

    function getBundleURL() {
      // Attempt to find the URL of the current script and use that as the base URL
      try {
        throw new Error();
      } catch (err) {
        const matches = (`${err.stack}`).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

        if (matches) {
          return getBaseURL(matches[0]);
        }
      }

      return '/';
    }

    function getBaseURL(url) {
      return `${(`${url}`).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1')}/`;
    }

    exports.getBundleURL = getBundleURLCached;
    exports.getBaseURL = getBaseURL;
  }, {}],
  'node_modules/parcel-bundler/src/builtins/css-loader.js': [function (require, module, exports) {
    const bundle = require('./bundle-url');

    function updateLink(link) {
      const newLink = link.cloneNode();

      newLink.onload = function () {
        link.remove();
      };

      newLink.href = `${link.href.split('?')[0]}?${Date.now()}`;
      link.parentNode.insertBefore(newLink, link.nextSibling);
    }

    let cssTimeout = null;

    function reloadCSS() {
      if (cssTimeout) {
        return;
      }

      cssTimeout = setTimeout(() => {
        const links = document.querySelectorAll('link[rel="stylesheet"]');

        for (let i = 0; i < links.length; i++) {
          if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
            updateLink(links[i]);
          }
        }

        cssTimeout = null;
      }, 50);
    }

    module.exports = reloadCSS;
  }, { './bundle-url': 'node_modules/parcel-bundler/src/builtins/bundle-url.js' }],
  'css/styles.css': [function (require, module, exports) {
    const reloadCSS = require('_css_loader');

    module.hot.dispose(reloadCSS);
    module.hot.accept(reloadCSS);
  }, { _css_loader: 'node_modules/parcel-bundler/src/builtins/css-loader.js' }],
  'node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [function (require, module, exports) {
    const global = arguments[3];
    const OVERLAY_ID = '__parcel__error__overlay__';
    const OldModule = module.bundle.Module;

    function Module(moduleName) {
      OldModule.call(this, moduleName);
      this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept(fn) {
          this._acceptCallbacks.push(fn || (() => {}));
        },
        dispose(fn) {
          this._disposeCallbacks.push(fn);
        },
      };
      module.bundle.hotData = null;
    }

    module.bundle.Module = Module;
    let checkedAssets; let
      assetsToAccept;
    const { parent } = module.bundle;

    if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
      const hostname = '' || location.hostname;
      const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${protocol}://${hostname}:` + '5850' + '/');

      ws.onmessage = function (event) {
        checkedAssets = {};
        assetsToAccept = [];
        const data = JSON.parse(event.data);

        if (data.type === 'update') {
          let handled = false;
          data.assets.forEach((asset) => {
            if (!asset.isNew) {
              const didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

              if (didAccept) {
                handled = true;
              }
            }
          }); // Enable HMR for CSS by default.

          handled = handled || data.assets.every((asset) => asset.type === 'css' && asset.generated.js);

          if (handled) {
            console.clear();
            data.assets.forEach((asset) => {
              hmrApply(global.parcelRequire, asset);
            });
            assetsToAccept.forEach((v) => {
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
          console.error(`[parcel] 🚨  ${data.error.message}\n${data.error.stack}`);
          removeErrorOverlay();
          const overlay = createErrorOverlay(data);
          document.body.appendChild(overlay);
        }
      };
    }

    function removeErrorOverlay() {
      const overlay = document.getElementById(OVERLAY_ID);

      if (overlay) {
        overlay.remove();
      }
    }

    function createErrorOverlay(data) {
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID; // html encode message and stack trace

      const message = document.createElement('div');
      const stackTrace = document.createElement('pre');
      message.innerText = data.error.message;
      stackTrace.innerText = data.error.stack;
      overlay.innerHTML = `${'<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">'}${message.innerHTML}</div>` + `<pre>${stackTrace.innerHTML}</pre>` + '</div>';
      return overlay;
    }

    function getParents(bundle, id) {
      const { modules } = bundle;

      if (!modules) {
        return [];
      }

      let parents = [];
      let k; let d; let
        dep;

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
      const { modules } = bundle;

      if (!modules) {
        return;
      }

      if (modules[asset.id] || !bundle.parent) {
        const fn = new Function('require', 'module', 'exports', asset.generated.js);
        asset.isNew = !modules[asset.id];
        modules[asset.id] = [fn, asset.deps];
      } else if (bundle.parent) {
        hmrApply(bundle.parent, asset);
      }
    }

    function hmrAcceptCheck(bundle, id) {
      const { modules } = bundle;

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
      const cached = bundle.cache[id];
      assetsToAccept.push([bundle, id]);

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        return true;
      }

      return getParents(global.parcelRequire, id).some((id) => hmrAcceptCheck(global.parcelRequire, id));
    }

    function hmrAcceptRun(bundle, id) {
      let cached = bundle.cache[id];
      bundle.hotData = {};

      if (cached) {
        cached.hot.data = bundle.hotData;
      }

      if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
        cached.hot._disposeCallbacks.forEach((cb) => {
          cb(bundle.hotData);
        });
      }

      delete bundle.cache[id];
      bundle(id);
      cached = bundle.cache[id];

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        cached.hot._acceptCallbacks.forEach((cb) => {
          cb();
        });

        return true;
      }
    }
  }, {}],
}, {}, ['node_modules/parcel-bundler/src/builtins/hmr-runtime.js'], null));
// # sourceMappingURL=/styles.b61e60ae.js.map