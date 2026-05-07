const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
  }),
];

const entries = [
  { input: "src/config.ts", fileName: "config", name: "Config" },
  { input: "src/conf.ts", fileName: "conf", name: "Conf" },
  { input: "src/note.ts", fileName: "note", name: "Note" },
  { input: "src/storage.ts", fileName: "storage", name: "Storage" },
  { input: "src/store.ts", fileName: "store", name: "Store" },
  { input: "src/ustore.ts", fileName: "ustore", name: "UStore" },
  { input: "src/index.ts", fileName: "utils", name: "Utils" },
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
