// import React from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
import localForage from 'localforage';
import { notification } from 'antd';
import userService from '../services/user';
import authService from '../services/auth';
import localForageService from '../services/localForage';


const replaceState = (searchObj) => {
  const search = queryString.stringify(searchObj);
  const newSearch = search ? `?${search}` : '';
  const href = window.location.href.replace(/^([^?#]+)(\?[^#]+)(#.*)?/, `$1${newSearch}$3`);
  window.history.replaceState({}, '', href);
};

export default {

  namespace: 'app',

  state: {
    repos: undefined,
    userInfo: undefined,
    percent: 0,
    status: 'active',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({ type: 'init', payload: history.location });
      return history.listen(({ pathname, search }) => {
        if ('/' === pathname) {
          return dispatch({ type: 'loading', payload: { pathname, search } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { call, put, select }) {  // eslint-disable-line
      localForage.config({ name: 'issue-reader' });
      const { userInfo } = yield select(state => state.app);
      if ('/' === payload.pathname || '/login' === payload.pathname || undefined !== userInfo) {
        return;
      }
      const from = 'mobile' === payload.pathname ? '/all' : payload.pathname;
      const search = queryString.stringify(Object.assign({ from }, queryString.parse(payload.search)));
      yield put(routerRedux.replace({
        pathname: '/',
        search: `?${search}`,
      }));
    },
    *loading({ payload }, { put }) {
      // debugger;  // eslint-disable-line
      const ua = new UA(window.navigator.userAgent);
      if ('mobile' === ua.device.type) {
        yield put({ type: 'save', payload: { userInfo: null } });
        return yield put(routerRedux.replace('/mobile'));
      }
      const search = queryString.parse(window.location.search || '');
      // const search = queryString.parse(payload.search);
      const token = yield put.resolve({ type: 'getAccessToken', payload: search });
      if (token) {
        const userInfo = yield put.resolve({ type: 'getUserInfo', payload: token });
        if (userInfo) {
          return yield put({ type: 'loginSucceed', payload: { userInfo, ...payload } });
        }
      }
      return yield put({ type: 'loginFaild' });
    },
    *getAccessToken({ payload }, { put, call }) {  // eslint-disable-line
      // debugger;  // eslint-disable-line
      const { code, state, ...search } = payload;
      if (code && state) {
        replaceState(search);
        const { data } = yield call(userService.getAccessTokenByCode, { code, state });
        if (data) {
          yield call(authService.setAccessToken, data);
        }
        return data || null;
      }
      const token = yield call(authService.getAccessToken);
      return token || null;
    },
    *getUserInfo({ payload }, { put, call }) {  // eslint-disable-line
      // debugger;  // eslint-disable-line
      const { data } = yield call(userService.getUserInfo, payload);
      return (data && data.viewer) || null;
    },
    *logout({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authService.removeAccessToken);
      yield put({ type: 'save', payload: { userInfo: null } });
      yield put(routerRedux.replace('/login'));
    },
    *loginSucceed({ payload }, { put, call }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { userInfo: payload.userInfo } });
      const repos = yield put.resolve({ type: 'updateDB', payload: payload.userInfo });
      if (repos && 0 < repos.length) {
        yield put(routerRedux.replace('/all'));
      } else {
        yield put(routerRedux.replace('/user/watching'));
      }
    },
    *loginFaild({ payload }, { put, call }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { userInfo: null } });
      yield put(routerRedux.replace('/login'));
    },
    *updateDB({ payload }, { put, call, select }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { percent: 0, status: 'active' } });
      yield call(localForageService.checkUser, payload);
      const utime = yield call(localForageService.getUpdateTime);
      if (60 * 60 * 1000 < new Date().getTime() - utime) {
        const list = yield call(localForageService.getRepos, payload);
        for (let i = 0, l = list.length; i < l; i += 1) {
          yield call(localForageService.syncRepoInfo, list[i]);
          yield put({ type: 'save', payload: { percent: Math.floor(i / l) } });
        }
        yield call(localForageService.setUpdateTime);
      }
      const repos = yield call(localForageService.getRepos, payload);
      yield put({ type: 'save', payload: { percent: 100, status: 'success', repos } });
      return repos;
    },
    *subscribe({ payload }, { put, call }) {  // eslint-disable-line
      const { data } = yield call(localForageService.addRepo, payload);
      if (data) {
        yield put({ type: 'updateRepos' });
        notification.success({ message: '订阅成功', description: '' });
        return true;
      } else {
        notification.error({ message: '订阅失败', description: '' });
        return false;
      }
    },
    *unsubscribe({ payload }, { put, call }) {  // eslint-disable-line
      yield call(localForageService.delRepo, payload);
      yield put({ type: 'updateRepos' });
      notification.success({ message: '退订成功', description: '' });
      return true;
    },
    *updateRepos({ payload }, { put, call }) {  // eslint-disable-line
      const list = yield call(localForageService.getRepos, payload);
      yield put({ type: 'save', payload: { repos: list } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
