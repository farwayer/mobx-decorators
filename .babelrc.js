const envConfig = process.env.ESM
  ? {modules: false, targets: {esmodules: true}}
  : {};

module.exports = {
  presets: [
    ['@babel/env', envConfig],
  ],
  plugins: [
    ['@babel/proposal-decorators', {legacy: true}],
    ['@babel/proposal-class-properties', {loose: true}],
    '@babel/proposal-export-default-from',
    '@babel/transform-runtime',
  ],
};
