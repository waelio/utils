const { store, config, conf, storage } = require("../dist/utils.js");

describe("Store utility", () => {
  it("stores and reads values", () => {
    const key = `store:${Date.now()}`;

    store(key, "testValue");

    expect(store(key)).toEqual("testValue");

    store.remove(key);
  });
});

describe("Config utility", () => {
  it("saves flat values", () => {
    const key = `config:${Date.now()}`;

    config.set(key, "testValue");

    expect(config.get(key)).toEqual("testValue");
  });

  it("supports nested keys", () => {
    const namespace = `nested:${Date.now()}`;

    config.set(`${namespace}:enabled`, true);

    expect(config.get(`${namespace}:enabled`)).toBeTrue();
  });

  it("exposes namespaced storage helpers", () => {
    const key = `storage:${Date.now()}`;

    storage.set(key, "stored");

    expect(storage.get(key)).toEqual("stored");

    storage.remove(key);
  });
});

describe("Conf utility", () => {
  it("mirrors config behaviour without storage", () => {
    const key = `conf:${Date.now()}`;

    conf.set(`${key}:api`, "/health");

    expect(conf.get(`${key}:api`)).toEqual("/health");
  });
});
