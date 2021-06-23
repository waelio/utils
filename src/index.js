import store from './store'
import { config, storage } from './config'
import { conf } from './conf'
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
  conf
}

export { store, config, conf, storage, note, Notify, Utils }
