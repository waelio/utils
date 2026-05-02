(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Note = {}));
})(this, (function (exports) { 'use strict';

  const dialogDefaults = {
    title: "Loading ...",
    dark: false,
    message: "0%",
    progress: {
      color: "primary",
    },
    persistent: false,
    ok: false,
  };

  const notifyDefaults = {
    timeout: 10000,
    position: "top",
  };

  const loadingDefaults = {
    message: "Processing ...",
  };

  const loadingBarDefaults = {
    color: "amber-7",
    size: "10px",
    position: "top",
  };

  const defaultStyles = {
    info: {
      icon: "info",
      color: "info",
      type: "info",
    },
    success: {
      icon: "check_circle",
      color: "positive",
      type: "positive",
    },
    warning: {
      icon: "warning",
      color: "warning",
      type: "warning",
    },
    error: {
      icon: "error",
      color: "negative",
      type: "negative",
    },
  };

  const getGlobalQuasarAdapters = () => {
    if (typeof globalThis === "undefined" || !globalThis.Quasar) {
      return {};
    }

    const { Notify, Dialog, Dark, LoadingBar, Loading, QSpinnerGears } =
      globalThis.Quasar;

    return {
      Notify,
      Dialog,
      Dark,
      LoadingBar,
      Loading,
      QSpinnerGears,
    };
  };

  let adapters = {
    Notify: null,
    Dialog: null,
    Dark: null,
    LoadingBar: null,
    Loading: null,
    QSpinnerGears: null,
    ...getGlobalQuasarAdapters(),
  };

  const applyDefaults = () => {
    const { Notify: activeNotify, LoadingBar: activeLoadingBar } = adapters;

    if (typeof activeNotify?.setDefaults === "function") {
      activeNotify.setDefaults(notifyDefaults);
    }

    if (typeof activeLoadingBar?.setDefaults === "function") {
      activeLoadingBar.setDefaults(loadingBarDefaults);
    }
  };

  const syncAdapters = () => {
    adapters = {
      ...getGlobalQuasarAdapters(),
      ...adapters,
    };

    applyDefaults();
    return adapters;
  };

  const buildLoadingConfig = (config = {}) => {
    const { QSpinnerGears } = syncAdapters();

    return {
      ...loadingDefaults,
      ...(QSpinnerGears ? { spinner: QSpinnerGears } : {}),
      ...config,
    };
  };

  const buildDialogConfig = (config = {}) => {
    const { Dark, QSpinnerGears } = syncAdapters();

    return {
      ...dialogDefaults,
      dark:
        typeof Dark?.isActive === "boolean" ? Dark.isActive : dialogDefaults.dark,
      progress: {
        ...dialogDefaults.progress,
        ...(QSpinnerGears ? { spinner: QSpinnerGears } : {}),
        ...(config.progress || {}),
      },
      ...config,
    };
  };

  const resolveMessage = (error) => {
    if (typeof error === "string") {
      return error;
    }

    return (
      error?.message ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.response ||
      "Unknown error"
    );
  };

  const configureNote = (nextAdapters = {}) => {
    adapters = {
      ...adapters,
      ...nextAdapters,
    };

    syncAdapters();
    return note;
  };

  const Notify = {
    create(payload) {
      const { Notify: activeNotify } = syncAdapters();

      if (typeof activeNotify?.create === "function") {
        return activeNotify.create(payload);
      }

      return payload;
    },
    setDefaults(payload) {
      const { Notify: activeNotify } = syncAdapters();

      if (typeof activeNotify?.setDefaults === "function") {
        return activeNotify.setDefaults(payload);
      }

      return payload;
    },
  };

  const note = {};

  note.loading = function (action = "show", config = {}) {
    const { Loading } = syncAdapters();

    if (action === "show" && typeof Loading?.show === "function") {
      return Loading.show(buildLoadingConfig(config));
    }

    if (action === "hide" && typeof Loading?.hide === "function") {
      return Loading.hide();
    }

    return { action, ...config };
  };

  note.loading.start = function (config = {}) {
    return note.loading("show", config);
  };

  note.loading.stop = function () {
    return note.loading("hide");
  };

  note.dialog = function (config = {}) {
    const { Dialog } = syncAdapters();
    const payload = buildDialogConfig(config);

    if (typeof Dialog?.create === "function") {
      return Dialog.create(payload);
    }

    return payload;
  };

  note.show = function (message, style, config = {}) {
    const selectedStyle =
      style && defaultStyles[style]
        ? defaultStyles[style]
        : defaultStyles.success;
    const payload = { message, ...selectedStyle, ...config };

    return Notify.create(payload);
  };

  note.success = (message, config = {}) => note.show(message, "success", config);

  note.info = (message, config = {}) => note.show(message, "info", config);

  note.warning = (message, config = {}) => note.show(message, "warning", config);

  note.error = (error, config = {}) =>
    note.show(resolveMessage(error), "error", config);

  note.log = (...args) => console.log(...args);

  note.debug = (title, err) => {
    if (err && err.message) {
      console.log(title, JSON.stringify(err.message || {}, null, 2));
    } else if (err) {
      console.log(title, JSON.stringify(err || {}, null, 2));
    } else {
      console.log(title);
    }
  };

  syncAdapters();

  exports.Notify = Notify;
  exports.configureNote = configureNote;
  exports.note = note;

}));
//# sourceMappingURL=note.js.map
