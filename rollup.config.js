import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/plugins',
    plugins: [resolve(), json(), commonjs()],
    output: {
      name: 'plugins',
      file: 'dist/plugins.js',
      format: 'es'
    }
  },
  {
    input: 'src/plugins/config',
    plugins: [resolve(), json(), commonjs()],
    output: {
      name: 'config',
      file: 'dist/config.js',
      format: 'cjs'
    }
  },
  {
    input: 'src/plugins/note',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        name: 'note',
        file: 'dist/note.js',
        format: 'es'
      },
      {
        name: 'note',
        file: 'dist/note.js',
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/plugins/store',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        name: 'store',
        file: 'dist/store.js',
        format: 'es'
      },
      {
        name: 'store',
        file: 'dist/store-umd.js',
        format: 'umd'
      },
      {
        name: 'store',
        file: 'dist/store-cjs.js',
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/utils',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        file: 'dist/waelioUtils.js',
        format: 'cjs',
        name: 'waelioUtils'
      },
      {
        file: 'dist/waelioUtils-umd.js',
        name: 'waelioUtils',
        format: 'umd',
        name: 'waelioUtils'
      },
      {
        file: 'dist/waelioUtils-es.js',
        format: 'es',
        name: 'waelioUtils'
      }
    ]
  }
];
