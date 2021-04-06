import { store, config, storage } from './config';
import { note, Notify } from './note';

const plugin = {
  config,
  storage,
  store,
  note,
  Notify
};
export { plugin, config, storage, store, note, Notify };
