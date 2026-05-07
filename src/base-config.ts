import clientDefaults from "./config/client";
import devDefaults from "./config/dev";
import prodDefaults from "./config/prod";
import serverDefaults from "./config/server";

type ConfigRecord = Record<string, unknown>;

const isConfigRecord = (value: unknown): value is ConfigRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeConfig = (value: unknown): ConfigRecord => {
  const resolved = isConfigRecord(value) && "default" in value ? value.default : value;

  return isConfigRecord(resolved) ? resolved : {};
};

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

const getNodeEnv = (): string | undefined =>
  typeof process !== "undefined" ? process.env?.NODE_ENV : undefined;

const getUrgentOverrides = (): ConfigRecord =>
  normalizeConfig(getNodeEnv() === "production" ? prodDefaults : devDefaults);

const buildBaseStore = (storage?: unknown): ConfigRecord => {
  const client = normalizeConfig(clientDefaults);
  const server = isBrowser() ? {} : normalizeConfig(serverDefaults);
  const dev = getUrgentOverrides();
  const store: ConfigRecord = {
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
  private _env: "client" | "server";

  private _storage?: unknown;

  private _store: ConfigRecord;

  constructor({ storage }: { storage?: unknown } = {}) {
    this._env = isBrowser() ? "client" : "server";
    this._storage = storage;
    this._store = buildBaseStore(storage);
  }

  set(key: string, value: unknown): unknown {
    if (key.includes(":")) {
      const keys = key.split(":");
      let storeKey: ConfigRecord = this._store;

      keys.forEach((segment, index) => {
        if (keys.length === index + 1) {
          storeKey[segment] = value;
          return;
        }

        if (!isConfigRecord(storeKey[segment])) {
          storeKey[segment] = {};
        }

        storeKey = storeKey[segment] as ConfigRecord;
      });

      return value;
    }

    this._store[key] = value;
    return value;
  }

  getAll(): ConfigRecord {
    return this._store;
  }

  getItem(key: string): unknown {
    return this._store[key];
  }

  get(key: string): unknown {
    if (key.includes(":")) {
      return this.buildNestedKey(key);
    }

    return this._store[key];
  }

  client(): unknown {
    return this.getItem("client");
  }

  dev(): unknown {
    return this.getItem("dev");
  }

  storage(): unknown {
    return this._store.storage;
  }

  server(): unknown {
    return this.getItem("server");
  }

  store(): ConfigRecord {
    return this._store;
  }

  has(key: string): boolean {
    return Boolean(this.get(key));
  }

  private buildNestedKey(nestedKey: string): unknown {
    return nestedKey
      .split(":")
      .reduce<unknown>(
        (storeKey, segment) =>
          isConfigRecord(storeKey) ? storeKey[segment] : undefined,
        this._store,
      );
  }
}

export { BaseConfig, buildBaseStore, isBrowser, normalizeConfig };