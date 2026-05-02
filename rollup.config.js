const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const resolve = require("@rollup/plugin-node-resolve");

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  json(),
];

const entries = [
  { input: "src/config.js", fileName: "config", name: "Config" },
  { input: "src/conf.js", fileName: "conf", name: "Conf" },
  { input: "src/note.js", fileName: "note", name: "Note" },
  { input: "src/storage.js", fileName: "storage", name: "Storage" },
  { input: "src/store.js", fileName: "store", name: "Store" },
  { input: "src/index.js", fileName: "utils", name: "Utils" },
];

module.exports = entries.map(({ input, fileName, name }) => ({
  input,
  plugins,
  output: [
    {
      file: `dist/${fileName}.mjs`,
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      file: `dist/${fileName}.js`,
      format: "umd",
      name,
      exports: "named",
      sourcemap: true,
    },
  ],
}));
