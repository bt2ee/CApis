import baseConfig from "./rollup.config.base";
import { terser } from "rollup-plugin-terser";

export default Object.assign({}, baseConfig, {
  output: [{
      file: "dist/index.min.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.min.js",
      format: "esm",
    },
  ],
  plugins: [...baseConfig.plugins, terser()],
});