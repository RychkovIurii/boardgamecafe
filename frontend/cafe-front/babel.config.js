import transformImportMetaEnv from "./babel-transform-import-meta-env.js";

export const presets = [
  ["@babel/preset-env", { targets: { node: "current" } }],
  ["@babel/preset-react", { runtime: "automatic" }],
];

export const plugins = [transformImportMetaEnv];
