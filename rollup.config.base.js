import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonJs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.js",
  output: [{
      file: "dist/index.js",
      format: "cjs"
    },
    {
      file: "dist/index.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    resolve(),
    json(),
    commonJs(),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true
    })
  ],
  external: ["axios"]
};