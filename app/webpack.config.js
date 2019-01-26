const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/printer.html", to: "printer.html" }]),
    new CopyWebpackPlugin([{ from: "./src/StarWebPrintBuilder.js", to: "StarWebPrintBuilder.js" }]),
    new CopyWebpackPlugin([{ from: "./src/StarWebPrintTrader.js", to: "StarWebPrintTrader.js" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true, host:'0.0.0.0' },
};
