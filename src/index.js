import store from './store'
import { config, storage } from './config'
import { note, Notify } from './note'
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
}

export { store, config, storage, note, Notify, Utils }
