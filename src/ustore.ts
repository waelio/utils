import {
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
} from "./ustore-core";

type GlobalWithUStore = typeof globalThis & {
  uStore?: typeof uStore;
};

(globalThis as GlobalWithUStore).uStore = uStore;

export {
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
};

export default uStore;