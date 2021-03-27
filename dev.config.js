const path = require('path');
module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: "./, // string | object | array
  // defaults to ./src

  output: {
    path:path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/assets/",
    library: { // There is also an old syntax for this available (click to show)
      type: "umd", // universal module definition
      // the type of the exported library
      name: "WaelioUtils", // string | string[]
    },
    uniqueName: "waelio-utilities", // (defaults to package.json "name")
    // unique name for this build to avoid conflicts with other builds in the same HTML
    name: "waelio-utils",
  }
}