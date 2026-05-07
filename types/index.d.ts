export interface StoreNamespaceLike {
    get(key: string): unknown;
    set(key: string, value: unknown): unknown;
    remove(key: string): unknown;
    has?(key: string): boolean;
}

export interface StoreModule extends StoreNamespaceLike {
    (key: string, value?: unknown): unknown;
    namespace(namespace: string): StoreNamespaceLike;
    session: {
        namespace(namespace: string): StoreNamespaceLike;
    };
}

export interface ConfigLike {
    set(key: string, value: unknown): unknown;
    get(key: string): unknown;
    getItem(key: string): unknown;
    getAll(): Record<string, unknown>;
    client(): unknown;
    dev(): unknown;
    server(): unknown;
    storage(): unknown;
    store(): Record<string, unknown>;
    has(key: string): boolean;
}

export interface StorageAdapter<TValue = unknown> {
    get(key: string): TValue | null;
    getItem(key: string): TValue | null;
    set(key: string, value: TValue): TValue | null;
    setItem(key: string, value: TValue): TValue | null;
    has(key: string): boolean;
    hasItem(key: string): boolean;
    remove(key: string): boolean;
    removeItem(key: string): boolean;
}

export interface SignalChange<TValue = unknown> {
    key: string;
    value: TValue | null;
    previousValue: TValue | null;
    source: "set" | "remove";
}

export interface SignalStorageAdapter<TValue = unknown>
    extends StorageAdapter<TValue> {
    subscribe(
        key: string,
        listener: (value: TValue | null, change: SignalChange<TValue>) => void,
    ): () => boolean;
    snapshot(): Record<string, TValue>;
}

export interface NotePayload {
    message?: string;
    type?: string;
    color?: string;
    icon?: string;
    [key: string]: unknown;
}

export interface NoteHelper {
    loading: {
        (action?: string, config?: Record<string, unknown>): unknown;
        start(config?: Record<string, unknown>): unknown;
        stop(): unknown;
    };
    dialog(config?: Record<string, unknown>): unknown;
    show(message: string, style?: string, config?: Record<string, unknown>): unknown;
    success(message: string, config?: Record<string, unknown>): unknown;
    info(message: string, config?: Record<string, unknown>): unknown;
    warning(message: string, config?: Record<string, unknown>): unknown;
    error(error: unknown, config?: Record<string, unknown>): unknown;
    log(...args: unknown[]): void;
    debug(title: string, err?: unknown): void;
}

export interface UStore {
    config: ConfigLike;
    local: StorageAdapter;
    session: StorageAdapter;
    cookie: StorageAdapter;
    memory: StorageAdapter;
    signal: SignalStorageAdapter;
}

export const store: StoreModule;
export const config: ConfigLike;
export const conf: ConfigLike;
export const storage: StoreNamespaceLike;
export const note: NoteHelper;
export const Notify: {
    create(payload: NotePayload): unknown;
    setDefaults(payload: NotePayload): unknown;
};
export function configureNote(
    nextAdapters?: Record<string, unknown>,
): NoteHelper;

export const uStore: UStore;
export const localStorage: StorageAdapter;
export const sessionStorage: StorageAdapter;
export const cookieStorage: StorageAdapter;
export const memoryStorage: StorageAdapter;
export const signalStorage: SignalStorageAdapter;

export interface UtilsShape {
    Store: StoreModule;
    Config: ConfigLike;
    Storage: StoreNamespaceLike;
    Note: NoteHelper;
    store: typeof store;
    config: ConfigLike;
    storage: typeof storage;
    note: NoteHelper;
    Notify: typeof Notify;
    configureNote: typeof configureNote;
    conf: ConfigLike;
    uStore: UStore;
    localStorage: StorageAdapter;
    sessionStorage: StorageAdapter;
    cookieStorage: StorageAdapter;
    memoryStorage: StorageAdapter;
    signalStorage: SignalStorageAdapter;
}

export const Utils: UtilsShape;