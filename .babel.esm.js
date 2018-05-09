module.exports = {
  presets: [
    ['@babel/env', {
      shippedProposals: true,
      modules: false,
      targets: {esmodules: true},
    }],
  ],
  plugins: [
    ['@babel/proposal-class-properties', {loose: true}],
    '@babel/proposal-export-default-from',
  ],
};
