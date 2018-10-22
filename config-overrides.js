const paths = require('react-scripts/config/paths');
const rewireLess = require('react-app-rewire-less-modules');
const { injectBabelPlugin } = require('react-app-rewired');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

paths.servedPath = './';

module.exports = {
  webpack: (config, env) => {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);

    config = rewireLess.withLoaderOptions({
      javascriptEnabled: true,
      // modifyVars: {
      //   "@primary-color": "#1890ff",
      // },
    })(config, env);
    // if ('development' !== env) {
    //   config.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
    // }
    return config;
  },
  devServer: configFunction => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      return config;
    };
  },
};
