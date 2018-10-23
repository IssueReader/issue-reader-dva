import React from 'react';
import dynamic from 'dva/dynamic';
import { Route } from 'dva/router';

const getRoutes = (routerData, app) => {
  const Routes = routerData.map(it => {
    // debugger;
    const Component = dynamic({ app, models: it.models, component: it.component });
    const exact = false !== it.exact;
    return <Route key={it.path} path={it.path} exact={exact} render={props => <Component {...props} app={app} />} />;
  });
  return Routes;
};

const getRouterDate = () => {
  return [
    {
      path: '/all',
      key: 'all',
      models: () => [import('../models/all')],
      component: () => import('../routes/All'),
    },
    {
      path: '/favorites',
      key: 'favorites',
      models: () => [import('../models/favorites')],
      component: () => import('../routes/Favorites'),
    },
    {
      path: '/discovery',
      key: 'discovery',
      models: () => [],
      component: () => import('../routes/Discovery'),
    },
    {
      path: '/discovery/:owner/:repo',
      key: 'repoinfo',
      models: () => [],
      component: () => import('../routes/RepoInfo'),
    },
    {
      path: '/repos/:owner/:repo',
      key: 'repo',
      models: () => [],
      component: () => import('../routes/Repo'),
    },
    {
      path: '/user/profile',
      key: 'profile',
      models: () => [],
      component: () => import('../routes/Profile'),
    },
    {
      path: '/user/watching',
      key: 'watching',
      models: () => [import('../models/watching')],
      component: () => import('../routes/Watching'),
    },
    {
      path: '/search',
      key: 'search',
      models: () => [],
      component: () => import('../routes/Search'),
    },
  ];
};

const getAppRoutes = app => {
  return getRoutes(getRouterDate(), app);
};

export default getAppRoutes;
