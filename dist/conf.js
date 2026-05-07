(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Conf = {}));
})(this, (function (exports) { 'use strict';

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

    const conf = new BaseConfig();

    exports.conf = conf;

}));
//# sourceMappingURL=conf.js.map
