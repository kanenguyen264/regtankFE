module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [!process.env.CYPRESS_INTERNAL_ENV && "react-app"].filter(Boolean),
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-pipeline-operator", { proposal: "smart" }],
      ["@babel/plugin-syntax-pipeline-operator", { proposal: "smart" }],
      [
        "transform-imports",
        {
          lodash: {
            // eslint-disable-next-line no-template-curly-in-string
            transform: "lodash/${member}",
            preventFullImport: true
          },
          recompose: {
            // eslint-disable-next-line no-template-curly-in-string
            transform: "recompose/${member}",
            preventFullImport: true
          },
          "@material-ui/core": {
            // Use "transform: '@material-ui/core/${member}'," if your bundler does not support ES modules
            // eslint-disable-next-line no-template-curly-in-string
            transform: "@material-ui/core/esm/${member}",
            preventFullImport: true
          },
          "@material-ui/icons": {
            // Use "transform: '@material-ui/icons/${member}'," if your bundler does not support ES modules
            // eslint-disable-next-line no-template-curly-in-string
            transform: "@material-ui/icons/esm/${member}",
            preventFullImport: true
          }
        }
      ]
    ].filter(Boolean),
    env: {
      development: {
        plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]]
      },
      production: {
        plugins: [
          process.env.SDK_ENV === "development" && [
            "@babel/plugin-proposal-private-methods",
            { loose: true }
          ]
        ].filter(Boolean)
      }
    }
  };
};
