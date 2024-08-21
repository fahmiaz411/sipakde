import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistPath, "cmaps");

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: cMapsDir,
          to: "cmaps/",
        },
      ],
    }),
  ],
};
