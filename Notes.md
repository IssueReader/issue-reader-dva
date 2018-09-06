# create
```
$ create-react-app v2 --scripts-version react-scripts@2.0.0-next.3e165448
```

# add react-app-rewired
```
$ yarn add react-app-rewired --dev
```

# add config-overrides.js
```js
module.exports = {
  webpack: (config, env) => {
    return config;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) =>{
      const config = configFunction(proxy, allowedHost);
      return config;
    }
  },
};
```

# change srcipts in project.json
```json
{
  ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  ...
}
```
```json
{
  ...
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
  },
  ...
}
```

# copy src

# modify config-overrides.js
```js

```

# add dependencies
```
yarn add ant-design-pro antd dva dva-loading flv.js hls.js mediaelement moment moment-duration-format numeral query-string redux-logger sjcl ua-device
```
