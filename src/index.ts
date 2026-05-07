import store from "./store";
import { config, storage } from "./config";
import { conf } from "./conf";
import { note, Notify, configureNote } from "./note";
import {
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
} from "./ustore-core";

const Utils = {
  Store: store,
  Config: config,
  Storage: storage,
  Note: note,
  store,
  config,
  storage,
  note,
  Notify,
  configureNote,
  conf,
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
};

export {
  store,
  config,
  conf,
  storage,
  note,
  Notify,
  configureNote,
  uStore,
  localStorage,
  sessionStorage,
  cookieStorage,
  memoryStorage,
  signalStorage,
  Utils,
};