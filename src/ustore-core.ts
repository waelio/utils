import store2 from "./store";
import { config } from "./config";

type StorageValue = unknown;
type MemoryState = Record<string, StorageValue>;

type NamespaceLike = {
  get?: (key: string) => StorageValue;
  set?: (key: string, value: StorageValue) => unknown;
  remove?: (key: string) => unknown;
  has?: (key: string) => boolean;
  keys?: () => string[];
  clear?: () => void;
};

type SetOptions = {
  /** Time-to-live in milliseconds. Entry auto-expires after this duration. */
  ttl?: number;
};

type SignalChange = {
  key: string;
  value: StorageValue | null;
  previousValue: StorageValue | null;
  source: "set" | "remove";
};

type SignalListener = (
  value: StorageValue | null,
  change: SignalChange,
) => void;

const STORAGE_NAMESPACE = "uStore";
const hasOwn = (value: MemoryState, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const logAdapterError = (
  adapterName: string,
  methodName: string,
  error: unknown,
): void => {
  console.error(`@waelio/utils ${adapterName}.${methodName} failed:`, error);
};

const createMemoryNamespace = (): Required<NamespaceLike> => {
  const state: MemoryState = {};

  return {
    get(key: string) {
      return hasOwn(state, key) ? state[key] : null;
    },
    set(key: string, value: StorageValue) {
      state[key] = value;
      return value;
    },
    remove(key: string) {
      const existed = hasOwn(state, key);

      if (existed) {
        delete state[key];
      }

      return existed;
    },
    has(key: string) {
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

const createLazyNamespace = (factory: () => NamespaceLike) => {
  let namespace: NamespaceLike | undefined;

  return (): NamespaceLike => {
    if (namespace) {
      return namespace;
    }

    try {
      namespace = factory() || createMemoryNamespace();
    } catch (error) {
      logAdapterError(STORAGE_NAMESPACE, "namespace", error);
      namespace = createMemoryNamespace();
    }

    return namespace;
  };
};

const getLocalNamespace = createLazyNamespace(() =>
  store2.namespace(STORAGE_NAMESPACE),
);
const getSessionNamespace = createLazyNamespace(() =>
  store2.session.namespace(STORAGE_NAMESPACE),
);

const getNamespaceValue = (
  namespace: NamespaceLike,
  key: string,
): StorageValue | null => {
  if (!key) {
    return null;
  }

  return typeof namespace.get === "function" ? (namespace.get(key) ?? null) : null;
};

const hasNamespaceValue = (namespace: NamespaceLike, key: string): boolean => {
  if (!key) {
    return false;
  }

  if (typeof namespace.has === "function") {
    return namespace.has(key);
  }

  const value = getNamespaceValue(namespace, key);
  return value !== null && value !== undefined;
};

const setNamespaceValue = (
  namespace: NamespaceLike,
  key: string,
  value: StorageValue,
): StorageValue | null => {
  if (!key) {
    return null;
  }

  if (typeof namespace.set === "function") {
    namespace.set(key, value);
  }

  return getNamespaceValue(namespace, key);
};

const removeNamespaceValue = (namespace: NamespaceLike, key: string): boolean => {
  if (!key) {
    return false;
  }

  if (typeof namespace.remove === "function") {
    namespace.remove(key);
  }

  return !hasNamespaceValue(namespace, key);
};

const createStoreAdapter = (
  adapterName: string,
  namespaceGetter: () => NamespaceLike,
) => ({
  get(key: string) {
    try {
      return getNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "get", error);
      return null;
    }
  },
  getItem(key: string) {
    try {
      return getNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "getItem", error);
      return null;
    }
  },
  has(key: string) {
    try {
      return hasNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "has", error);
      return false;
    }
  },
  hasItem(key: string) {
    try {
      return hasNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "hasItem", error);
      return false;
    }
  },
  set(key: string, value: StorageValue) {
    try {
      return setNamespaceValue(namespaceGetter(), key, value);
    } catch (error) {
      logAdapterError(adapterName, "set", error);
      return null;
    }
  },
  setItem(key: string, value: StorageValue) {
    try {
      return setNamespaceValue(namespaceGetter(), key, value);
    } catch (error) {
      logAdapterError(adapterName, "setItem", error);
      return null;
    }
  },
  remove(key: string) {
    try {
      return removeNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "remove", error);
      return false;
    }
  },
  removeItem(key: string) {
    try {
      return removeNamespaceValue(namespaceGetter(), key);
    } catch (error) {
      logAdapterError(adapterName, "removeItem", error);
      return false;
    }
  },
});


const createStateStore = () => {
  const state: MemoryState = {};
  const ttlMap = new Map<string, number>();

  const isExpired = (key: string): boolean => {
    const exp = ttlMap.get(key);
    if (exp === undefined) return false;
    if (Date.now() >= exp) {
      delete state[key];
      ttlMap.delete(key);
      return true;
    }
    return false;
  };

  return {
    get(key: string): StorageValue | null {
      if (isExpired(key)) return null;
      return hasOwn(state, key) ? state[key] : null;
    },
    set(key: string, value: StorageValue, options?: SetOptions): StorageValue {
      state[key] = value;
      if (options?.ttl && options.ttl > 0) {
        ttlMap.set(key, Date.now() + options.ttl);
      } else {
        ttlMap.delete(key);
      }
      return value;
    },
    remove(key: string): boolean {
      const existed = hasOwn(state, key);
      if (existed) {
        delete state[key];
        ttlMap.delete(key);
      }
      return existed;
    },
    has(key: string): boolean {
      if (isExpired(key)) return false;
      return hasOwn(state, key);
    },
    keys(): string[] {
      return Object.keys(state).filter((k) => !isExpired(k));
    },
    clear(): void {
      Object.keys(state).forEach((k) => delete state[k]);
      ttlMap.clear();
    },
    snapshot(): MemoryState {
      return Object.fromEntries(
        Object.entries(state).filter(([k]) => !isExpired(k))
      );
    },
  };
};

const memoryState = createStateStore();

const memoryStorage = {
  get(key: string) {
    return memoryState.get(key);
  },
  getItem(key: string) {
    return memoryState.get(key);
  },
  has(key: string) {
    return memoryState.has(key);
  },
  hasItem(key: string) {
    return memoryState.has(key);
  },
  set(key: string, value: StorageValue, options?: SetOptions) {
    return memoryState.set(key, value, options);
  },
  setItem(key: string, value: StorageValue, options?: SetOptions) {
    return memoryState.set(key, value, options);
  },
  remove(key: string) {
    memoryState.remove(key);
    return !memoryState.has(key);
  },
  removeItem(key: string) {
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

const serializeCookieValue = (value: StorageValue): string => {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const deserializeCookieValue = (value: string | null | undefined): StorageValue | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const cookieFallback: MemoryState = {};

const readCookieValue = (key: string): StorageValue | null => {
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

const writeCookieValue = (key: string, value: StorageValue): StorageValue | null => {
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

const removeCookieValue = (key: string): boolean => {
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
  get(key: string) {
    try {
      return readCookieValue(key);
    } catch (error) {
      logAdapterError("cookieStorage", "get", error);
      return null;
    }
  },
  getItem(key: string) {
    try {
      return readCookieValue(key);
    } catch (error) {
      logAdapterError("cookieStorage", "getItem", error);
      return null;
    }
  },
  has(key: string) {
    try {
      return readCookieValue(key) !== null;
    } catch (error) {
      logAdapterError("cookieStorage", "has", error);
      return false;
    }
  },
  hasItem(key: string) {
    try {
      return readCookieValue(key) !== null;
    } catch (error) {
      logAdapterError("cookieStorage", "hasItem", error);
      return false;
    }
  },
  set(key: string, value: StorageValue) {
    try {
      return writeCookieValue(key, value);
    } catch (error) {
      logAdapterError("cookieStorage", "set", error);
      return null;
    }
  },
  setItem(key: string, value: StorageValue) {
    try {
      return writeCookieValue(key, value);
    } catch (error) {
      logAdapterError("cookieStorage", "setItem", error);
      return null;
    }
  },
  remove(key: string) {
    try {
      return removeCookieValue(key);
    } catch (error) {
      logAdapterError("cookieStorage", "remove", error);
      return false;
    }
  },
  removeItem(key: string) {
    try {
      return removeCookieValue(key);
    } catch (error) {
      logAdapterError("cookieStorage", "removeItem", error);
      return false;
    }
  },
};

const signalState = createStateStore();
const signalListeners = new Map<string, Set<SignalListener>>();

const notifySignalListeners = (
  key: string,
  value: StorageValue | null,
  previousValue: StorageValue | null,
  source: "set" | "remove",
): void => {
  const listeners = signalListeners.get(key);

  if (!listeners || listeners.size === 0) {
    return;
  }

  const change: SignalChange = {
    key,
    value,
    previousValue,
    source,
  };

  listeners.forEach((listener) => {
    try {
      listener(value, change);
    } catch (error) {
      logAdapterError("signalStorage", "listener", error);
    }
  });
};

const signalStorage = {
  get(key: string) {
    return signalState.get(key);
  },
  getItem(key: string) {
    return signalState.get(key);
  },
  has(key: string) {
    return signalState.has(key);
  },
  hasItem(key: string) {
    return signalState.has(key);
  },
  set(key: string, value: StorageValue, options?: SetOptions) {
    const previousValue = signalState.get(key);
    const nextValue = signalState.set(key, value, options);

    notifySignalListeners(key, nextValue, previousValue, "set");
    return nextValue;
  },
  setItem(key: string, value: StorageValue, options?: SetOptions) {
    const previousValue = signalState.get(key);
    const nextValue = signalState.set(key, value, options);

    notifySignalListeners(key, nextValue, previousValue, "set");
    return nextValue;
  },
  remove(key: string) {
    const previousValue = signalState.get(key);
    signalState.remove(key);
    const removed = !signalState.has(key);

    if (removed) {
      notifySignalListeners(key, null, previousValue, "remove");
    }

    return removed;
  },
  removeItem(key: string) {
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
  subscribe(key: string, listener: SignalListener) {
    if (!key || typeof listener !== "function") {
      return () => false;
    }

    const listeners = signalListeners.get(key) || new Set<SignalListener>();
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

const localStorage = createStoreAdapter("localStorage", getLocalNamespace);
const sessionStorage = createStoreAdapter(
  "sessionStorage",
  getSessionNamespace,
);

const uStore = {
  config,
  local: localStorage,
  session: sessionStorage,
  cookie: cookieStorage,
  memory: memoryStorage,
  signal: signalStorage,
};

export {
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
};