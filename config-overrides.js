const rewireLess = require('react-app-rewire-less-modules');
const { injectBabelPlugin } = require('react-app-rewired');

module.exports = {
  webpack: (config, env) => {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);

    config = rewireLess.withLoaderOptions({
      javascriptEnabled: true,
      // modifyVars: {
      //   "@primary-color": "#1890ff",
      // },
    })(config, env);
    return config;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      return config;
    }
  },
};
