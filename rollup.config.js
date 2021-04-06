import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src/plugins',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        name: 'plugins',
        file: 'dist/plugins.ejs',
        format: 'es'
      },
      {
        name: 'plugins',
        file: 'dist/plugins.js',
        format: 'umd'
      },
      {
        name: 'plugins',
        file: 'dist/plugins.cjs',
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/plugins/config',
    plugins: [
      resolve(),
      json(),
      commonjs(),
      copy({
        targets: [{ src: 'config/**/*', dest: 'config' }]
      })
    ],
    output: [
      {
        name: 'config',
        file: 'dist/config.ejs',
        format: 'es'
      },
      {
        name: 'config',
        file: 'dist/config.js',
        format: 'umd'
      },
      {
        name: 'config',
        file: 'dist/config.cjs',
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/plugins/note',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        name: 'note',
        file: 'dist/note.ejs',
        format: 'es'
      },
      {
        name: 'note',
        file: 'dist/note.js',
        format: 'umd'
      },
      {
        name: 'note',
        file: 'dist/note.cjs',
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
        file: 'dist/store.ejs',
        format: 'es'
      },
      {
        name: 'store',
        file: 'dist/store.js',
        format: 'umd'
      },
      {
        name: 'store',
        file: 'dist/store.cjs',
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/utils',
    plugins: [resolve(), json(), commonjs()],
    output: [
      {
        file: 'dist/waelioUtils.cjs',
        format: 'cjs',
        name: 'waelioUtils'
      },
      {
        file: 'dist/waelioUtils.js',
        name: 'waelioUtils',
        format: 'umd',
        name: 'waelioUtils'
      },
      {
        file: 'dist/waelioUtils.ejs',
        format: 'es',
        name: 'waelioUtils'
      }
    ]
  }
];
