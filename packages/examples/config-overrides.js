const { ProvidePlugin } = require("webpack");

module.exports = function (config, env) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(m?js|ts)$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },
    plugins: [
      ...config.plugins,
      new ProvidePlugin({
        process: "process/browser",
      }),
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        tls: false,
        net: false,
        child_process: false,
        readline: false,
        zlib: false,
        http: false,
        https: false,
        buffer: require.resolve("buffer"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify"),
        constants: require.resolve("constants-browserify"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert"),
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};
