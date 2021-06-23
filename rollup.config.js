import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import auto from '@rollup/plugin-auto-install';

export default [
  {
    input: 'src/config',
    plugins: [
      nodePolyfills(),
      auto(),
      resolve(),
      json(),
      copy({
        targets: [{ src: 'src/config', dest: 'dist/' }]
      })
    ],
    output: [
      {
        name: 'Config',
        file: 'dist/config.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Config',
        file: 'dist/config.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  }, //Config
  {
    input: 'src/conf',
    plugins: [
      nodePolyfills(),
      auto(),
      resolve(),
      json(),
      copy({
        targets: [{ src: 'src/conf', dest: 'dist/' }]
      })
    ],
    output: [
      {
        name: 'Conf',
        file: 'dist/conf.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Conf',
        file: 'dist/conf.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  }, // Conf
  {
    input: 'src/note',
    plugins: [
      nodePolyfills(),
      auto(),
      resolve(),
      json(),
      copy({
        targets: [{ src: 'src/statics.js', dest: 'dist/' }]
      })
    ],
    output: [
      {
        name: 'Note',
        file: 'dist/note.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Note',
        file: 'dist/note.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  }, //Note
  {
    input: 'src/storage',
    plugins: [nodePolyfills(), auto(), resolve(), json()],
    output: [
      {
        name: 'Storage',
        file: 'dist/storage.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Storage',
        file: 'dist/storage.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  }, //Storage
  {
    input: 'src/store',
    plugins: [nodePolyfills(), auto(), resolve(), json()],
    output: [
      {
        name: 'Store',
        file: 'dist/store.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Store',
        file: 'dist/store.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  }, //Store
  {
    input: 'src/index.js',
    plugins: [nodePolyfills(), auto(), resolve(), json()],
    output: [
      {
        name: 'Utils',
        file: 'dist/utils.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        name: 'Utils',
        file: 'dist/utils.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true
      }
    ]
  } //utils
];
