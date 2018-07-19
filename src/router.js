import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Loading from './routes/Loading';
import Login from './routes/Login';
import BasicLayout from './layouts/BasicLayout';

// import Mobile from './routes/Mobile';
// import App from './routes/App';

dynamic.setDefaultLoadingComponent(() => {
  return <Loading />;
});

// function RouterConfig({ history }) {
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route path="/" exact component={Loading} />
//         <Route path="/login" exact component={Login} />
//         <Route path="/mobile" exact component={Mobile} />
//         <Route path="*" component={App} />
//       </Switch>
//     </Router>
//   );
// }

// export default RouterConfig;
function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/login" exact component={Login} />
          <Route path="(.*)" render={props => <BasicLayout {...props} app={app} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
