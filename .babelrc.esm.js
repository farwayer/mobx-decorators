module.exports = {
  presets: [
    ['@babel/env', {
      shippedProposals: true,
      modules: false,
      targets: {esmodules: true},
    }],
  ],
};
