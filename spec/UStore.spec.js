const {
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
} = require("../dist/utils.js");
const uStoreModule = require("../dist/ustore.js");

describe("uStore adapters", () => {
  it("exposes a unified facade from the root bundle", () => {
    expect(uStore).toEqual(
      jasmine.objectContaining({
        config: jasmine.any(Object),
        local: jasmine.any(Object),
        session: jasmine.any(Object),
        cookie: jasmine.any(Object),
        memory: jasmine.any(Object),
        signal: jasmine.any(Object),
      }),
    );
  });

  it("stores values in the local adapter", () => {
    const key = `local:${Date.now()}`;
    const payload = { theme: "dark" };

    expect(localStorage.set(key, payload)).toEqual(payload);
    expect(uStore.local.has(key)).toBeTrue();
    expect(uStore.local.get(key)).toEqual(payload);
    expect(uStore.local.remove(key)).toBeTrue();
    expect(uStore.local.has(key)).toBeFalse();
  });

  it("stores values in the session adapter", () => {
    const key = `session:${Date.now()}`;

    expect(sessionStorage.set(key, "active")).toEqual("active");
    expect(uStore.session.get(key)).toEqual("active");
    expect(uStore.session.remove(key)).toBeTrue();
    expect(uStore.session.get(key)).toBeNull();
  });

  it("stores cookies consistently in non-browser tests", () => {
    const key = `cookie:${Date.now()}`;
    const payload = { ok: true };

    expect(cookieStorage.set(key, payload)).toEqual(payload);
    expect(uStore.cookie.has(key)).toBeTrue();
    expect(uStore.cookie.get(key)).toEqual(payload);
    expect(uStore.cookie.remove(key)).toBeTrue();
    expect(uStore.cookie.has(key)).toBeFalse();
  });

  it("supports in-memory storage", () => {
    const key = `memory:${Date.now()}`;

    expect(memoryStorage.set(key, 42)).toEqual(42);
    expect(uStore.memory.get(key)).toEqual(42);
    expect(uStore.memory.remove(key)).toBeTrue();
    expect(uStore.memory.get(key)).toBeNull();
  });

  it("supports reactive signal subscriptions", () => {
    const key = `signal:${Date.now()}`;
    const changes = [];
    const stop = signalStorage.subscribe(key, (value, change) => {
      changes.push({ value, change });
    });

    expect(signalStorage.set(key, "dark")).toEqual("dark");
    expect(signalStorage.get(key)).toEqual("dark");
    expect(signalStorage.remove(key)).toBeTrue();
    expect(stop()).toBeTrue();
    expect(changes).toEqual([
      {
        value: "dark",
        change: jasmine.objectContaining({
          key,
          value: "dark",
          previousValue: null,
          source: "set",
        }),
      },
      {
        value: null,
        change: jasmine.objectContaining({
          key,
          value: null,
          previousValue: "dark",
          source: "remove",
        }),
      },
    ]);
  });

  it("publishes a dedicated ustore entry point", () => {
    expect(uStoreModule.default).toEqual(
      jasmine.objectContaining({
        local: jasmine.any(Object),
        session: jasmine.any(Object),
        cookie: jasmine.any(Object),
        memory: jasmine.any(Object),
        signal: jasmine.any(Object),
      }),
    );
    expect(typeof uStoreModule.signalStorage.subscribe).toEqual("function");
  });
});
