import React from 'react';
import { Router, Route, Switch } from 'dva/router';

import Loading from './routes/Loading';
import Mobile from './routes/Mobile';
import Login from './routes/Login';
import App from './routes/App';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Loading} />
        <Route path="/login" exact component={Login} />
        <Route path="/mobile" exact component={Mobile} />
        <Route path="*" component={App} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
