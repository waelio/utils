(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Store = {}));
}(this, (function (exports) { 'use strict';

	var store2 = require('store2');

	exports.default = store2;
	exports.store2 = store2;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=store.js.map
