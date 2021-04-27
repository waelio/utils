import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/config',
    plugins: [
      resolve(),
      json(),
      copy({
        targets: [{ src: 'src/config', dest: 'dist/' }],
      }),
    ],
    output: [
      {
        name: 'config',
        file: 'dist/config.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        name: 'config',
        file: 'dist/config.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
      },
    ],
  }, //Config
  {
    input: 'src/note',
    plugins: [resolve(), json()],
    copy({
      targets: [{ src: 'src/defaults', dest: 'dist/' }],
    }),
    output: [
      {
        name: 'note',
        file: 'dist/note.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        name: 'note',
        file: 'dist/note.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
      },
    ],
  }, //Note
  {
    input: 'src/store',
    plugins: [resolve(), json()],
    output: [
      {
        name: 'store',
        file: 'dist/store.ejs',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        name: 'store',
        file: 'dist/store.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
      },
    ],
  }, //Store
]
