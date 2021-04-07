import { plugin, config, storage, store, note, Notify } from './plugins';
import * as utils from './utils';

export { plugin, config, storage, store, note, Notify, utils };
export default {
  input: 'src/index.js',
  output: 'dist/plugins.js',
  format: 'esm',
  exports: 'named', /** Disable warning for default imports */
  sourcemap: true,
};