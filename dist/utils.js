(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	const { store, config, storage, note, Notify, Utils } = require('./src');

	exports.store = store;
	exports.config = config;
	exports.storage = storage;
	exports.note = note;
	exports.Notify = Notify;
	exports.Utils = { store, config, storage, note, Notify };

})));
//# sourceMappingURL=utils.js.map
