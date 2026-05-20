(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UStore = {}));
})(this, (function (exports) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var store2$2 = {exports: {}};

	/*! store2 - v2.14.4 - 2024-12-26
	* Copyright (c) 2024 Nathan Bubna; Licensed MIT */
	var store2$1 = store2$2.exports;

	var hasRequiredStore2;

	function requireStore2 () {
		if (hasRequiredStore2) return store2$2.exports;
		hasRequiredStore2 = 1;
		(function (module) {
	(function(window, define) {
			    var _ = {
			        version: "2.14.4",
			        areas: {},
			        apis: {},
			        nsdelim: '.',

			        // utilities
			        inherit: function(api, o) {
			            for (var p in api) {
			                if (!o.hasOwnProperty(p)) {
			                    Object.defineProperty(o, p, Object.getOwnPropertyDescriptor(api, p));
			                }
			            }
			            return o;
			        },
			        stringify: function(d, fn) {
			            return d === undefined || typeof d === "function" ? d+'' : JSON.stringify(d,fn||_.replace);
			        },
			        parse: function(s, fn) {
			            // if it doesn't parse, return as is
			            try{ return JSON.parse(s,fn||_.revive); }catch(e){ return s; }
			        },

			        // extension hooks
			        fn: function(name, fn) {
			            _.storeAPI[name] = fn;
			            for (var api in _.apis) {
			                _.apis[api][name] = fn;
			            }
			        },
			        get: function(area, key){ return area.getItem(key); },
			        set: function(area, key, string){ area.setItem(key, string); },
			        remove: function(area, key){ area.removeItem(key); },
			        key: function(area, i){ return area.key(i); },
			        length: function(area){ return area.length; },
			        clear: function(area){ area.clear(); },

			        // core functions
			        Store: function(id, area, namespace) {
			            var store = _.inherit(_.storeAPI, function(key, data, overwrite) {
			                if (arguments.length === 0){ return store.getAll(); }
			                if (typeof data === "function"){ return store.transact(key, data, overwrite); }// fn=data, alt=overwrite
			                if (data !== undefined){ return store.set(key, data, overwrite); }
			                if (typeof key === "string" || typeof key === "number"){ return store.get(key); }
			                if (typeof key === "function"){ return store.each(key); }
			                if (!key){ return store.clear(); }
			                return store.setAll(key, data);// overwrite=data, data=key
			            });
			            store._id = id;
			            try {
			                var testKey = '__store2_test';
			                area.setItem(testKey, 'ok');
			                store._area = area;
			                area.removeItem(testKey);
			            } catch (e) {
			                store._area = _.storage('fake');
			            }
			            store._ns = namespace || '';
			            if (!_.areas[id]) {
			                _.areas[id] = store._area;
			            }
			            if (!_.apis[store._ns+store._id]) {
			                _.apis[store._ns+store._id] = store;
			            }
			            return store;
			        },
			        storeAPI: {
			            // admin functions
			            area: function(id, area) {
			                var store = this[id];
			                if (!store || !store.area) {
			                    store = _.Store(id, area, this._ns);//new area-specific api in this namespace
			                    if (!this[id]){ this[id] = store; }
			                }
			                return store;
			            },
			            namespace: function(namespace, singleArea, delim) {
			                delim = delim || this._delim || _.nsdelim;
			                if (!namespace){
			                    return this._ns ? this._ns.substring(0,this._ns.length-delim.length) : '';
			                }
			                var ns = namespace, store = this[ns];
			                if (!store || !store.namespace) {
			                    store = _.Store(this._id, this._area, this._ns+ns+delim);//new namespaced api
			                    store._delim = delim;
			                    if (!this[ns]){ this[ns] = store; }
			                    if (!singleArea) {
			                        for (var name in _.areas) {
			                            store.area(name, _.areas[name]);
			                        }
			                    }
			                }
			                return store;
			            },
			            isFake: function(force) {
			                if (force) {
			                    this._real = this._area;
			                    this._area = _.storage('fake');
			                } else if (force === false) {
			                    this._area = this._real || this._area;
			                }
			                return this._area.name === 'fake';
			            },
			            toString: function() {
			                return 'store'+(this._ns?'.'+this.namespace():'')+'['+this._id+']';
			            },

			            // storage functions
			            has: function(key) {
			                if (this._area.has) {
			                    return this._area.has(this._in(key));//extension hook
			                }
			                return !!(this._in(key) in this._area);
			            },
			            size: function(){ return this.keys().length; },
			            each: function(fn, fill) {// fill is used by keys(fillList) and getAll(fillList))
			                for (var i=0, m=_.length(this._area); i<m; i++) {
			                    var key = this._out(_.key(this._area, i));
			                    if (key !== undefined) {
			                        if (fn.call(this, key, this.get(key), fill) === false) {
			                            break;
			                        }
			                    }
			                    if (m > _.length(this._area)) { m--; i--; }// in case of removeItem
			                }
			                return fill || this;
			            },
			            keys: function(fillList) {
			                return this.each(function(k, v, list){ list.push(k); }, fillList || []);
			            },
			            get: function(key, alt) {
			                var s = _.get(this._area, this._in(key)),
			                    fn;
			                if (typeof alt === "function") {
			                    fn = alt;
			                    alt = null;
			                }
			                return s !== null ? _.parse(s, fn) :
			                    alt != null ? alt : s;
			            },
			            getAll: function(fillObj) {
			                return this.each(function(k, v, all){ all[k] = v; }, fillObj || {});
			            },
			            transact: function(key, fn, alt) {
			                var val = this.get(key, alt),
			                    ret = fn(val);
			                this.set(key, ret === undefined ? val : ret);
			                return this;
			            },
			            set: function(key, data, overwrite) {
			                var d = this.get(key),
			                    replacer;
			                if (d != null && overwrite === false) {
			                    return data;
			                }
			                if (typeof overwrite === "function") {
			                    replacer = overwrite;
			                    overwrite = undefined;
			                }
			                return _.set(this._area, this._in(key), _.stringify(data, replacer), overwrite) || d;
			            },
			            setAll: function(data, overwrite) {
			                var changed, val;
			                for (var key in data) {
			                    val = data[key];
			                    if (this.set(key, val, overwrite) !== val) {
			                        changed = true;
			                    }
			                }
			                return changed;
			            },
			            add: function(key, data, replacer) {
			                var d = this.get(key);
			                if (d instanceof Array) {
			                    data = d.concat(data);
			                } else if (d !== null) {
			                    var type = typeof d;
			                    if (type === typeof data && type === 'object') {
			                        for (var k in data) {
			                            d[k] = data[k];
			                        }
			                        data = d;
			                    } else {
			                        data = d + data;
			                    }
			                }
			                _.set(this._area, this._in(key), _.stringify(data, replacer));
			                return data;
			            },
			            remove: function(key, alt) {
			                var d = this.get(key, alt);
			                _.remove(this._area, this._in(key));
			                return d;
			            },
			            clear: function() {
			                if (!this._ns) {
			                    _.clear(this._area);
			                } else {
			                    this.each(function(k){ _.remove(this._area, this._in(k)); }, 1);
			                }
			                return this;
			            },
			            clearAll: function() {
			                var area = this._area;
			                for (var id in _.areas) {
			                    if (_.areas.hasOwnProperty(id)) {
			                        this._area = _.areas[id];
			                        this.clear();
			                    }
			                }
			                this._area = area;
			                return this;
			            },

			            // internal use functions
			            _in: function(k) {
			                if (typeof k !== "string"){ k = _.stringify(k); }
			                return this._ns ? this._ns + k : k;
			            },
			            _out: function(k) {
			                return this._ns ?
			                    k && k.indexOf(this._ns) === 0 ?
			                        k.substring(this._ns.length) :
			                        undefined : // so each() knows to skip it
			                    k;
			            }
			        },// end _.storeAPI
			        storage: function(name) {
			            return _.inherit(_.storageAPI, { items: {}, name: name });
			        },
			        storageAPI: {
			            length: 0,
			            has: function(k){ return this.items.hasOwnProperty(k); },
			            key: function(i) {
			                var c = 0;
			                for (var k in this.items){
			                    if (this.has(k) && i === c++) {
			                        return k;
			                    }
			                }
			            },
			            setItem: function(k, v) {
			                if (!this.has(k)) {
			                    this.length++;
			                }
			                this.items[k] = v;
			            },
			            removeItem: function(k) {
			                if (this.has(k)) {
			                    delete this.items[k];
			                    this.length--;
			                }
			            },
			            getItem: function(k){ return this.has(k) ? this.items[k] : null; },
			            clear: function(){ for (var k in this.items){ this.removeItem(k); } }
			        }// end _.storageAPI
			    };

			    var store =
			        // safely set this up (throws error in IE10/32bit mode for local files)
			        _.Store("local", (function(){try{ return localStorage; }catch(e){}})());
			    store.local = store;// for completeness
			    store._ = _;// for extenders and debuggers...
			    // safely setup store.session (throws exception in FF for file:/// urls)
			    store.area("session", (function(){try{ return sessionStorage; }catch(e){}})());
			    store.area("page", _.storage("page"));

			    if (typeof define === 'function' && define.amd !== undefined) {
			        define('store2', [], function () {
			            return store;
			        });
			    } else if (module.exports) {
			        module.exports = store;
			    } else {
			        // expose the primary store fn to the global object and save conflicts
			        if (window.store){ _.conflict = window.store; }
			        window.store = store;
			    }

			})(store2$1, store2$1 && store2$1.define); 
		} (store2$2));
		return store2$2.exports;
	}

	var store2Exports = requireStore2();
	var store2 = /*@__PURE__*/getDefaultExportFromCjs(store2Exports);

	var clientDefaults = {
	    init: false,
	    app: {
	        businessName: "",
	        businessDomain: "",
	        businessAddress: "",
	        businessEmail: "",
	        businessImage: "",
	        businessDescription: "",
	    },
	    settings: {
	        locale: "en-us",
	        darkMode: true,
	    },
	    Credentials: {
	        google: {
	            clientId: "",
	            clientPassword: "",
	        },
	        facebook: {
	            clientId: "",
	            clientPassword: "",
	        },
	        apple: {
	            clientId: "",
	            clientPassword: "",
	        },
	        twitter: {
	            clientId: "",
	            clientPassword: "",
	        },
	    },
	};

	var devDefaults = {
	    debug: false,
	    localeName: "locale",
	    modeName: "darkMode",
	    api: "",
	    apiPrefix: "api/v1/",
	    crm: "",
	};

	var prodDefaults = {
	    debug: false,
	    localeName: "locale",
	    modeName: "darkMode",
	    apiPrefix: "api/v1/",
	    api: "",
	};

	var serverDefaults = {};

	const isConfigRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
	const normalizeConfig = (value) => {
	    const resolved = isConfigRecord(value) && "default" in value ? value.default : value;
	    return isConfigRecord(resolved) ? resolved : {};
	};
	const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
	const getNodeEnv = () => typeof process !== "undefined" ? process.env?.NODE_ENV : undefined;
	const getUrgentOverrides = () => normalizeConfig(getNodeEnv() === "production" ? prodDefaults : devDefaults);
	const buildBaseStore = (storage) => {
	    const client = normalizeConfig(clientDefaults);
	    const server = isBrowser() ? {} : normalizeConfig(serverDefaults);
	    const dev = getUrgentOverrides();
	    const store = {
	        ...client,
	        ...server,
	        ...dev,
	        client,
	        server,
	        dev,
	    };
	    if (storage) {
	        store.storage = storage;
	    }
	    return store;
	};
	class BaseConfig {
	    constructor({ storage } = {}) {
	        this._env = isBrowser() ? "client" : "server";
	        this._storage = storage;
	        this._store = buildBaseStore(storage);
	    }
	    set(key, value) {
	        if (key.includes(":")) {
	            const keys = key.split(":");
	            let storeKey = this._store;
	            keys.forEach((segment, index) => {
	                if (keys.length === index + 1) {
	                    storeKey[segment] = value;
	                    return;
	                }
	                if (!isConfigRecord(storeKey[segment])) {
	                    storeKey[segment] = {};
	                }
	                storeKey = storeKey[segment];
	            });
	            return value;
	        }
	        this._store[key] = value;
	        return value;
	    }
	    getAll() {
	        return this._store;
	    }
	    getItem(key) {
	        return this._store[key];
	    }
	    get(key) {
	        if (key.includes(":")) {
	            return this.buildNestedKey(key);
	        }
	        return this._store[key];
	    }
	    client() {
	        return this.getItem("client");
	    }
	    dev() {
	        return this.getItem("dev");
	    }
	    storage() {
	        return this._store.storage;
	    }
	    server() {
	        return this.getItem("server");
	    }
	    store() {
	        return this._store;
	    }
	    has(key) {
	        return Boolean(this.get(key));
	    }
	    buildNestedKey(nestedKey) {
	        return nestedKey
	            .split(":")
	            .reduce((storeKey, segment) => isConfigRecord(storeKey) ? storeKey[segment] : undefined, this._store);
	    }
	}

	const storage = store2.namespace("app");
	const config = new BaseConfig({ storage });

	const STORAGE_NAMESPACE = "uStore";
	const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
	const logAdapterError = (adapterName, methodName, error) => {
	    console.error(`@waelio/utils ${adapterName}.${methodName} failed:`, error);
	};
	const createMemoryNamespace = () => {
	    const state = {};
	    return {
	        get(key) {
	            return hasOwn(state, key) ? state[key] : null;
	        },
	        set(key, value) {
	            state[key] = value;
	            return value;
	        },
	        remove(key) {
	            const existed = hasOwn(state, key);
	            if (existed) {
	                delete state[key];
	            }
	            return existed;
	        },
	        has(key) {
	            return hasOwn(state, key);
	        },
	        keys() {
	            return Object.keys(state);
	        },
	        clear() {
	            Object.keys(state).forEach((k) => delete state[k]);
	        },
	    };
	};
	const createLazyNamespace = (factory) => {
	    let namespace;
	    return () => {
	        if (namespace) {
	            return namespace;
	        }
	        try {
	            namespace = factory() || createMemoryNamespace();
	        }
	        catch (error) {
	            logAdapterError(STORAGE_NAMESPACE, "namespace", error);
	            namespace = createMemoryNamespace();
	        }
	        return namespace;
	    };
	};
	const getLocalNamespace = createLazyNamespace(() => store2.namespace(STORAGE_NAMESPACE));
	const getSessionNamespace = createLazyNamespace(() => store2.session.namespace(STORAGE_NAMESPACE));
	const getNamespaceValue = (namespace, key) => {
	    if (!key) {
	        return null;
	    }
	    return typeof namespace.get === "function" ? (namespace.get(key) ?? null) : null;
	};
	const hasNamespaceValue = (namespace, key) => {
	    if (!key) {
	        return false;
	    }
	    if (typeof namespace.has === "function") {
	        return namespace.has(key);
	    }
	    const value = getNamespaceValue(namespace, key);
	    return value !== null && value !== undefined;
	};
	const setNamespaceValue = (namespace, key, value) => {
	    if (!key) {
	        return null;
	    }
	    if (typeof namespace.set === "function") {
	        namespace.set(key, value);
	    }
	    return getNamespaceValue(namespace, key);
	};
	const removeNamespaceValue = (namespace, key) => {
	    if (!key) {
	        return false;
	    }
	    if (typeof namespace.remove === "function") {
	        namespace.remove(key);
	    }
	    return !hasNamespaceValue(namespace, key);
	};
	const createStoreAdapter = (adapterName, namespaceGetter) => ({
	    get(key) {
	        try {
	            return getNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "get", error);
	            return null;
	        }
	    },
	    getItem(key) {
	        try {
	            return getNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "getItem", error);
	            return null;
	        }
	    },
	    has(key) {
	        try {
	            return hasNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "has", error);
	            return false;
	        }
	    },
	    hasItem(key) {
	        try {
	            return hasNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "hasItem", error);
	            return false;
	        }
	    },
	    set(key, value) {
	        try {
	            return setNamespaceValue(namespaceGetter(), key, value);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "set", error);
	            return null;
	        }
	    },
	    setItem(key, value) {
	        try {
	            return setNamespaceValue(namespaceGetter(), key, value);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "setItem", error);
	            return null;
	        }
	    },
	    remove(key) {
	        try {
	            return removeNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "remove", error);
	            return false;
	        }
	    },
	    removeItem(key) {
	        try {
	            return removeNamespaceValue(namespaceGetter(), key);
	        }
	        catch (error) {
	            logAdapterError(adapterName, "removeItem", error);
	            return false;
	        }
	    },
	});
	const createStateStore = () => {
	    const state = {};
	    const ttlMap = new Map();
	    const isExpired = (key) => {
	        const exp = ttlMap.get(key);
	        if (exp === undefined)
	            return false;
	        if (Date.now() >= exp) {
	            delete state[key];
	            ttlMap.delete(key);
	            return true;
	        }
	        return false;
	    };
	    return {
	        get(key) {
	            if (isExpired(key))
	                return null;
	            return hasOwn(state, key) ? state[key] : null;
	        },
	        set(key, value, options) {
	            state[key] = value;
	            if (options?.ttl && options.ttl > 0) {
	                ttlMap.set(key, Date.now() + options.ttl);
	            }
	            else {
	                ttlMap.delete(key);
	            }
	            return value;
	        },
	        remove(key) {
	            const existed = hasOwn(state, key);
	            if (existed) {
	                delete state[key];
	                ttlMap.delete(key);
	            }
	            return existed;
	        },
	        has(key) {
	            if (isExpired(key))
	                return false;
	            return hasOwn(state, key);
	        },
	        keys() {
	            return Object.keys(state).filter((k) => !isExpired(k));
	        },
	        clear() {
	            Object.keys(state).forEach((k) => delete state[k]);
	            ttlMap.clear();
	        },
	        snapshot() {
	            return Object.fromEntries(Object.entries(state).filter(([k]) => !isExpired(k)));
	        },
	    };
	};
	const memoryState = createStateStore();
	const memoryStorage = {
	    get(key) {
	        return memoryState.get(key);
	    },
	    getItem(key) {
	        return memoryState.get(key);
	    },
	    has(key) {
	        return memoryState.has(key);
	    },
	    hasItem(key) {
	        return memoryState.has(key);
	    },
	    set(key, value, options) {
	        return memoryState.set(key, value, options);
	    },
	    setItem(key, value, options) {
	        return memoryState.set(key, value, options);
	    },
	    remove(key) {
	        memoryState.remove(key);
	        return !memoryState.has(key);
	    },
	    removeItem(key) {
	        memoryState.remove(key);
	        return !memoryState.has(key);
	    },
	    keys() {
	        return memoryState.keys();
	    },
	    clear() {
	        memoryState.clear();
	    },
	    snapshot() {
	        return memoryState.snapshot();
	    },
	};
	const serializeCookieValue = (value) => {
	    if (typeof value === "string") {
	        return value;
	    }
	    return JSON.stringify(value);
	};
	const deserializeCookieValue = (value) => {
	    if (value === null || value === undefined || value === "") {
	        return null;
	    }
	    try {
	        return JSON.parse(value);
	    }
	    catch (error) {
	        return value;
	    }
	};
	const cookieFallback = {};
	const readCookieValue = (key) => {
	    if (!key) {
	        return null;
	    }
	    if (typeof document === "undefined") {
	        return hasOwn(cookieFallback, key) ? cookieFallback[key] : null;
	    }
	    const cookies = document.cookie
	        .split(";")
	        .map((cookie) => cookie.trim())
	        .filter(Boolean);
	    const cookie = cookies.find((entry) => entry.startsWith(`${key}=`));
	    if (!cookie) {
	        return null;
	    }
	    const encodedValue = cookie.slice(key.length + 1);
	    return deserializeCookieValue(decodeURIComponent(encodedValue));
	};
	const writeCookieValue = (key, value) => {
	    if (!key) {
	        return null;
	    }
	    if (typeof document === "undefined") {
	        cookieFallback[key] = value;
	        return cookieFallback[key];
	    }
	    const serialized = encodeURIComponent(serializeCookieValue(value));
	    document.cookie = `${key}=${serialized}; path=/; SameSite=Lax`;
	    return readCookieValue(key);
	};
	const removeCookieValue = (key) => {
	    if (!key) {
	        return false;
	    }
	    if (typeof document === "undefined") {
	        if (hasOwn(cookieFallback, key)) {
	            delete cookieFallback[key];
	        }
	        return !hasOwn(cookieFallback, key);
	    }
	    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
	    return readCookieValue(key) === null;
	};
	const cookieStorage = {
	    get(key) {
	        try {
	            return readCookieValue(key);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "get", error);
	            return null;
	        }
	    },
	    getItem(key) {
	        try {
	            return readCookieValue(key);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "getItem", error);
	            return null;
	        }
	    },
	    has(key) {
	        try {
	            return readCookieValue(key) !== null;
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "has", error);
	            return false;
	        }
	    },
	    hasItem(key) {
	        try {
	            return readCookieValue(key) !== null;
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "hasItem", error);
	            return false;
	        }
	    },
	    set(key, value) {
	        try {
	            return writeCookieValue(key, value);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "set", error);
	            return null;
	        }
	    },
	    setItem(key, value) {
	        try {
	            return writeCookieValue(key, value);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "setItem", error);
	            return null;
	        }
	    },
	    remove(key) {
	        try {
	            return removeCookieValue(key);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "remove", error);
	            return false;
	        }
	    },
	    removeItem(key) {
	        try {
	            return removeCookieValue(key);
	        }
	        catch (error) {
	            logAdapterError("cookieStorage", "removeItem", error);
	            return false;
	        }
	    },
	};
	const signalState = createStateStore();
	const signalListeners = new Map();
	const notifySignalListeners = (key, value, previousValue, source) => {
	    const listeners = signalListeners.get(key);
	    if (!listeners || listeners.size === 0) {
	        return;
	    }
	    const change = {
	        key,
	        value,
	        previousValue,
	        source,
	    };
	    listeners.forEach((listener) => {
	        try {
	            listener(value, change);
	        }
	        catch (error) {
	            logAdapterError("signalStorage", "listener", error);
	        }
	    });
	};
	const signalStorage = {
	    get(key) {
	        return signalState.get(key);
	    },
	    getItem(key) {
	        return signalState.get(key);
	    },
	    has(key) {
	        return signalState.has(key);
	    },
	    hasItem(key) {
	        return signalState.has(key);
	    },
	    set(key, value, options) {
	        const previousValue = signalState.get(key);
	        const nextValue = signalState.set(key, value, options);
	        notifySignalListeners(key, nextValue, previousValue, "set");
	        return nextValue;
	    },
	    setItem(key, value, options) {
	        const previousValue = signalState.get(key);
	        const nextValue = signalState.set(key, value, options);
	        notifySignalListeners(key, nextValue, previousValue, "set");
	        return nextValue;
	    },
	    remove(key) {
	        const previousValue = signalState.get(key);
	        signalState.remove(key);
	        const removed = !signalState.has(key);
	        if (removed) {
	            notifySignalListeners(key, null, previousValue, "remove");
	        }
	        return removed;
	    },
	    removeItem(key) {
	        const previousValue = signalState.get(key);
	        signalState.remove(key);
	        const removed = !signalState.has(key);
	        if (removed) {
	            notifySignalListeners(key, null, previousValue, "remove");
	        }
	        return removed;
	    },
	    keys() {
	        return signalState.keys();
	    },
	    clear() {
	        const allKeys = signalState.keys();
	        allKeys.forEach((key) => {
	            const previousValue = signalState.get(key);
	            signalState.remove(key);
	            notifySignalListeners(key, null, previousValue, "remove");
	        });
	        signalState.clear();
	    },
	    subscribe(key, listener) {
	        if (!key || typeof listener !== "function") {
	            return () => false;
	        }
	        const listeners = signalListeners.get(key) || new Set();
	        listeners.add(listener);
	        signalListeners.set(key, listeners);
	        return () => {
	            listeners.delete(listener);
	            if (listeners.size === 0) {
	                signalListeners.delete(key);
	            }
	            return true;
	        };
	    },
	    snapshot() {
	        return signalState.snapshot();
	    },
	};
	const localStorage$1 = createStoreAdapter("localStorage", getLocalNamespace);
	const sessionStorage$1 = createStoreAdapter("sessionStorage", getSessionNamespace);
	const uStore = {
	    config,
	    local: localStorage$1,
	    session: sessionStorage$1,
	    cookie: cookieStorage,
	    memory: memoryStorage,
	    signal: signalStorage,
	};

	globalThis.uStore = uStore;

	exports.cookieStorage = cookieStorage;
	exports.default = uStore;
	exports.localStorage = localStorage$1;
	exports.memoryStorage = memoryStorage;
	exports.sessionStorage = sessionStorage$1;
	exports.signalStorage = signalStorage;
	exports.uStore = uStore;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ustore.js.map
