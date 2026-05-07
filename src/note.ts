import {
  dialogDefaults,
  loadingBarDefaults,
  defaultStyles,
  loadingDefaults,
  notifyDefaults,
} from "./statics";

type Payload = Record<string, unknown>;

type NoteLoading = ((action?: string, config?: Payload) => unknown) & {
  start(config?: Payload): unknown;
  stop(): unknown;
};

type NoteHelper = {
  loading: NoteLoading;
  dialog(config?: Payload): unknown;
  show(message: unknown, style?: string, config?: Payload): unknown;
  success(message: string, config?: Payload): unknown;
  info(message: string, config?: Payload): unknown;
  warning(message: string, config?: Payload): unknown;
  error(error: unknown, config?: Payload): unknown;
  log(...args: unknown[]): void;
  debug(title: string, err?: unknown): void;
};

type NotifyAdapter = {
  create?: (payload: Payload) => unknown;
  setDefaults?: (payload: Payload) => unknown;
} | null;

type DialogAdapter = {
  create?: (payload: Payload) => unknown;
} | null;

type DarkAdapter = {
  isActive?: boolean;
} | null;

type LoadingBarAdapter = {
  setDefaults?: (payload: Payload) => unknown;
} | null;

type LoadingAdapter = {
  show?: (payload: Payload) => unknown;
  hide?: () => unknown;
} | null;

type QuasarAdapters = {
  Notify?: NotifyAdapter;
  Dialog?: DialogAdapter;
  Dark?: DarkAdapter;
  LoadingBar?: LoadingBarAdapter;
  Loading?: LoadingAdapter;
  QSpinnerGears?: unknown;
};

type GlobalWithQuasar = typeof globalThis & {
  Quasar?: QuasarAdapters;
};

const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getGlobalQuasarAdapters = (): QuasarAdapters => {
  const quasar = (globalThis as GlobalWithQuasar).Quasar;

  if (!quasar) {
    return {};
  }

  const { Notify, Dialog, Dark, LoadingBar, Loading, QSpinnerGears } = quasar;

  return {
    Notify,
    Dialog,
    Dark,
    LoadingBar,
    Loading,
    QSpinnerGears,
  };
};

let adapters: Required<QuasarAdapters> = {
  Notify: null,
  Dialog: null,
  Dark: null,
  LoadingBar: null,
  Loading: null,
  QSpinnerGears: null,
  ...getGlobalQuasarAdapters(),
};

const applyDefaults = (): void => {
  const { Notify: activeNotify, LoadingBar: activeLoadingBar } = adapters;

  if (typeof activeNotify?.setDefaults === "function") {
    activeNotify.setDefaults(notifyDefaults);
  }

  if (typeof activeLoadingBar?.setDefaults === "function") {
    activeLoadingBar.setDefaults(loadingBarDefaults);
  }
};

const syncAdapters = (): typeof adapters => {
  adapters = {
    ...getGlobalQuasarAdapters(),
    ...adapters,
  };

  applyDefaults();
  return adapters;
};

const buildLoadingConfig = (config: Payload = {}): Payload => {
  const { QSpinnerGears } = syncAdapters();

  return {
    ...loadingDefaults,
    ...(QSpinnerGears ? { spinner: QSpinnerGears } : {}),
    ...config,
  };
};

const buildDialogConfig = (config: Payload = {}): Payload => {
  const { Dark, QSpinnerGears } = syncAdapters();
  const progressConfig = isPayload(config.progress) ? config.progress : {};

  return {
    ...dialogDefaults,
    dark:
      typeof Dark?.isActive === "boolean" ? Dark.isActive : dialogDefaults.dark,
    progress: {
      ...dialogDefaults.progress,
      ...(QSpinnerGears ? { spinner: QSpinnerGears } : {}),
      ...progressConfig,
    },
    ...config,
  };
};

const resolveMessage = (error: unknown): unknown => {
  if (typeof error === "string") {
    return error;
  }

  if (!isPayload(error)) {
    return "Unknown error";
  }

  const response = isPayload(error.response) ? error.response : null;
  const responseData = response?.data;
  const responseDataRecord = isPayload(responseData) ? responseData : null;

  return (
    error.message ||
    responseDataRecord?.message ||
    responseData ||
    response ||
    "Unknown error"
  );
};

const note = {} as NoteHelper;

const configureNote = (nextAdapters: QuasarAdapters = {}) => {
  adapters = {
    ...adapters,
    ...nextAdapters,
  };

  syncAdapters();
  return note;
};

const Notify = {
  create(payload: Payload) {
    const { Notify: activeNotify } = syncAdapters();

    if (typeof activeNotify?.create === "function") {
      return activeNotify.create(payload);
    }

    return payload;
  },
  setDefaults(payload: Payload) {
    const { Notify: activeNotify } = syncAdapters();

    if (typeof activeNotify?.setDefaults === "function") {
      return activeNotify.setDefaults(payload);
    }

    return payload;
  },
};

const loading = ((action = "show", config: Payload = {}) => {
  const { Loading } = syncAdapters();

  if (action === "show" && typeof Loading?.show === "function") {
    return Loading.show(buildLoadingConfig(config));
  }

  if (action === "hide" && typeof Loading?.hide === "function") {
    return Loading.hide();
  }

  return { action, ...config };
}) as NoteLoading;

loading.start = function (config: Payload = {}) {
  return loading("show", config);
};

loading.stop = function () {
  return loading("hide");
};

note.loading = loading;

note.dialog = function (config: Payload = {}) {
  const { Dialog } = syncAdapters();
  const payload = buildDialogConfig(config);

  if (typeof Dialog?.create === "function") {
    return Dialog.create(payload);
  }

  return payload;
};

note.show = function (message: string, style?: string, config: Payload = {}) {
  const selectedStyle =
    style && defaultStyles[style as keyof typeof defaultStyles]
      ? defaultStyles[style as keyof typeof defaultStyles]
      : defaultStyles.success;
  const payload = { message, ...selectedStyle, ...config };

  return Notify.create(payload);
};

note.success = (message: string, config: Payload = {}) =>
  note.show(message, "success", config);

note.info = (message: string, config: Payload = {}) =>
  note.show(message, "info", config);

note.warning = (message: string, config: Payload = {}) =>
  note.show(message, "warning", config);

note.error = (error: unknown, config: Payload = {}) =>
  note.show(resolveMessage(error), "error", config);

note.log = (...args: unknown[]) => console.log(...args);

note.debug = (title: string, err?: unknown) => {
  if (isPayload(err) && "message" in err) {
    console.log(title, JSON.stringify(err.message ?? {}, null, 2));
  } else if (err !== undefined) {
    console.log(title, JSON.stringify(err, null, 2));
  } else {
    console.log(title);
  }
};

syncAdapters();

export { note, Notify, configureNote };