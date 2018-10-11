const envConfig = process.env.ESM
  ? {modules: false, targets: {esmodules: true}}
  : {};

module.exports = {
  presets: [
    ['@babel/env', envConfig],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-runtime',
  ],
};
