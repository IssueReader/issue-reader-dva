import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Loading from './components/Loading';
import Uploading from './routes/Uploading';
import Login from './routes/Login';
import BasicLayout from './layouts/BasicLayout';


dynamic.setDefaultLoadingComponent(() => {
  return <Loading />;
});

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Uploading} />
          <Route path="/login" exact component={Login} />
          <Route path="(.*)" render={props => <BasicLayout {...props} app={app} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
