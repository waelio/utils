(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.config = {}));
}(this, (function (exports) { 'use strict';

  var store2 = require('store2');

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..');
      }
    }

    return parts;
  }

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  // path.resolve([from ...], to)
  // posix version
  function resolve() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : '/';

      // Skip empty and invalid entries
      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }
  // path.normalize(path)
  // posix version
  function normalize(path) {
    var isPathAbsolute = isAbsolute(path),
        trailingSlash = substr(path, -1) === '/';

    // Normalize the path
    path = normalizeArray(filter(path.split('/'), function(p) {
      return !!p;
    }), !isPathAbsolute).join('/');

    if (!path && !isPathAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isPathAbsolute ? '/' : '') + path;
  }
  // posix version
  function isAbsolute(path) {
    return path.charAt(0) === '/';
  }

  // posix version
  function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize(filter(paths, function(p, index) {
      if (typeof p !== 'string') {
        throw new TypeError('Arguments to path.join must be strings');
      }
      return p;
    }).join('/'));
  }


  // path.relative(from, to)
  // posix version
  function relative(from, to) {
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  }

  var sep = '/';
  var delimiter = ':';

  function dirname(path) {
    var result = splitPath(path),
        root = result[0],
        dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }

    return root + dir;
  }

  function basename(path, ext) {
    var f = splitPath(path)[2];
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }


  function extname(path) {
    return splitPath(path)[3];
  }
  var path = {
    extname: extname,
    basename: basename,
    dirname: dirname,
    sep: sep,
    delimiter: delimiter,
    relative: relative,
    join: join,
    isAbsolute: isAbsolute,
    normalize: normalize,
    resolve: resolve
  };
  function filter (xs, f) {
      if (xs.filter) return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
          if (f(xs[i], i, xs)) res.push(xs[i]);
      }
      return res;
  }

  // String.prototype.substr - negative index don't work in IE8
  var substr = 'ab'.substr(-1) === 'b' ?
      function (str, start, len) { return str.substr(start, len) } :
      function (str, start, len) {
          if (start < 0) start = str.length + start;
          return str.substr(start, len);
      }
  ;

  const Storage = store2.namespace('app');
  class Config {
    constructor() {
      const self = this;
      self.setEnvironment();
      self._storage = Storage;
      self._server = self.getServerVars();
      self._client = self.getClientVars();
      self._dev = self.getUrgentOverrides();

      self._store = Object.assign(
        {},
        { ...self._client.default },
        { ...(self._server.default ? self._server.default : self._server) },
        { ...self._dev.default },
        { client: self._client.default },
        { server: self._server.default ? self._server.default : self._server },
        { dev: self._dev.default },
      );
      // Do not Merge the Storage ;)
      self._store.storage = self._storage;
      // console.log("this._store", this._store);
    }

    set(key, value) {
      if (key.match(/:/)) {
        const keys = key.split(':');
        let storeKey = this._store;

        keys.forEach(function (k, i) {
          if (keys.length === i + 1) {
            storeKey[k] = value;
          }

          if (storeKey[k] === undefined) {
            storeKey[k] = {};
          }

          storeKey = storeKey[k];
        });
      } else {
        this._store[key] = value;
      }
    }

    getAll() {
      return this._store
    }

    getItem(key) {
      return this._store[key]
    }

    get(key) {
      // Is the key a nested object
      if (key.match(/:/)) {
        // Transform getter string into object
        const storeKey = this.buildNestedKey(key);
        return storeKey
      }

      // Return regular key
      return this._store[key]
    }

    client() {
      return this.getItem('client')
    }

    dev() {
      return this.getItem('dev')
    }

    storage() {
      return this._store.storage
    }

    server() {
      return this.getItem('server')
    }

    store() {
      return this._store
    }

    has(key) {
      return Boolean(this.get(key))
    }

    setEnvironment() {
      if (process.browser) {
        this._env = 'client';
      } else {
        this._env = 'server';
      }
    }

    getServerVars() {
      let serverVars = {};

      if (this._env === 'server') {
        try {
          serverVars = require(path + '/config/server');
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn("Didn't find a server config in `./config`.");
          }
        }
      }

      return serverVars
    }

    getClientVars() {
      let clientVars;

      try {
        clientVars = require('./config/client');
      } catch (e) {
        clientVars = {};

        if (process.env.NODE_ENV === 'development') {
          console.warn("Didn't find a client config in `./config`.");
        }
      }

      return clientVars
    }

    getUrgentOverrides() {
      let overrides;
      const filename = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
      try {
        overrides =
          process.env.NODE_ENV === 'production'
            ? require('./config/prod')
            : require('./config/dev');

        console.warn(
          `FYI: data in \`./config/${filename}.js\` file will override Server & Client equal data/values.`,
        );
      } catch (e) {
        overrides = {};
      }

      return overrides
    }

    // Builds out a nested key to get nested values
    buildNestedKey(nestedKey) {
      // Transform getter string into object
      const keys = nestedKey.split(':');
      let storeKey = this._store;

      keys.forEach(function (k) {
        try {
          storeKey = storeKey[k];
        } catch (e) {
          return undefined
        }
      });

      return storeKey
    }
  }

  const config = new Config(),
    storage = Storage;

  exports.config = config;
  exports.storage = storage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=config.js.map
