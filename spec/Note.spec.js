const { note, Notify, configureNote } = require("../dist/note.js");

describe("Note utility", () => {
  afterEach(() => {
    configureNote({
      Notify: null,
      Dialog: null,
      Dark: null,
      Loading: null,
      LoadingBar: null,
      QSpinnerGears: null,
    });
  });

  it("returns safe payloads when Quasar is not configured", () => {
    const success = note.success("Hello world");
    const error = note.error(new Error("Boom"));
    const dialog = note.dialog({ title: "Heads up" });
    const loading = note.loading.start({ message: "Working..." });

    expect(success).toEqual(
      jasmine.objectContaining({
        message: "Hello world",
        type: "positive",
      }),
    );
    expect(error).toEqual(
      jasmine.objectContaining({
        message: "Boom",
        type: "negative",
      }),
    );
    expect(dialog.title).toEqual("Heads up");
    expect(loading.action).toEqual("show");
  });

  it("delegates to configured adapters", () => {
    const calls = {
      defaults: [],
    };

    const fakeNotify = {
      setDefaults(payload) {
        calls.defaults.push({ type: "notify", payload });
        return payload;
      },
      create(payload) {
        calls.notify = payload;
        return { channel: "notify", payload };
      },
    };
    const fakeDialog = {
      create(payload) {
        calls.dialog = payload;
        return { channel: "dialog", payload };
      },
    };
    const fakeLoading = {
      show(payload) {
        calls.loading = payload;
        return { channel: "loading", payload };
      },
      hide() {
        calls.hide = true;
        return { channel: "hide" };
      },
    };
    const fakeLoadingBar = {
      setDefaults(payload) {
        calls.defaults.push({ type: "loadingBar", payload });
        return payload;
      },
    };

    configureNote({
      Notify: fakeNotify,
      Dialog: fakeDialog,
      Dark: { isActive: true },
      Loading: fakeLoading,
      LoadingBar: fakeLoadingBar,
      QSpinnerGears: "Spinner",
    });

    const success = note.success("Configured");
    const dialog = note.dialog({ message: "Please wait" });
    const loading = note.loading.start({ message: "Syncing" });
    const hidden = note.loading.stop();
    const directNotify = Notify.create({ message: "Direct" });

    expect(success.channel).toEqual("notify");
    expect(dialog.channel).toEqual("dialog");
    expect(loading.channel).toEqual("loading");
    expect(hidden.channel).toEqual("hide");
    expect(directNotify.channel).toEqual("notify");
    expect(calls.notify.message).toEqual("Direct");
    expect(calls.dialog.dark).toBeTrue();
    expect(calls.loading.spinner).toEqual("Spinner");
    expect(calls.defaults.length).toBeGreaterThan(0);
  });
});
