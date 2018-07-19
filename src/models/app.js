// import React from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
import localForage from 'localforage';
import { Modal, notification } from 'antd';
import userService from '../services/user';
import authService from '../services/auth';


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
      debugger;
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
      debugger;
      const token = yield call(authService.getAccessToken);
      debugger;
      return token || null;
    },
    *getUserInfo({ payload }, { put, call }) {  // eslint-disable-line
      // debugger;  // eslint-disable-line
      const { data } = yield call(userService.getUserInfo, payload);
      return data || null;
    },
    *getAccessTokenByCode({ payload }, { put, call }) {  // eslint-disable-line
      // debugger;  // eslint-disable-line
      const { code, state, ...search } = payload;
      if (!code) {
        return yield put({ type: 'loginFaild', payload: search });
      }
      replaceState(search);
      const { data } = yield call(userService.loginByCode, { code, state });
      debugger;  // eslint-disable-line
      if (!data) {
        const ref = Modal.error({
          title: '登录失败',
          content: 'code 已过期',
          onOk: () => {
            ref.destroy();
          },
        });
        return yield put({ type: 'loginFaild', payload: search });
      }
      yield call(authService.setAccessToken, data);
      return yield put({ type: 'loginSucceed', payload: data });
    },
    *loginByToken({ payload }, { put, call }) {  // eslint-disable-line
      debugger;  // eslint-disable-line
      const token = yield call(authService.getSessionToken);
      debugger;  // eslint-disable-line
      if (!token) {
        return yield put({ type: 'loginFaild', payload });
      }
      debugger;  // eslint-disable-line
      const { data } = yield call(userService.loginByToken, { token });
      if (data) {
        return yield put({ type: 'loginSucceed', payload: { userInfo: data, search: payload } });
      } else {
        return yield put({ type: 'loginFaild', payload });
      }
    },
    *logout({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authService.removeSessionToken);
      yield put(routerRedux.replace('/login'));
    },
    *loginSucceed({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authService.setSessionToken, payload.userInfo.sessionToken);
      yield put({ type: 'save', payload: { userInfo: payload.userInfo } });
      const { data } = yield call(userService.getRepos);
      yield put({ type: 'save', payload: { repos: data || [] } });
      const { from, ...search } = payload.search;
      if (data && 0 < data.length && from && 'login' !== from && '/mobile' !== from) {
        yield put(routerRedux.replace({ pathname: from, search: `?${queryString.stringify(search)}` }));
      } else {
        yield put({ type: 'jump2default', payload: data });
      }
    },
    *loginFaild({ payload }, { put, call }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { userInfo: null } });
      yield put(routerRedux.replace('/login'));
    },
    *jump2default({ payload }, { put, call, select }) {  // eslint-disable-line
      // const {} = yield select
      const { repos } = yield select(state => state.app);
      const list = payload || repos;
      if (list && 0 < list.length) {
        yield put(routerRedux.replace(`/repos/${list[0].owner}/${list[0].repo}`));
      } else {
        // TODO: 引导页面，获取用户 github 账号 watching repos
        yield put(routerRedux.replace('/user/watching'));
      }
      // yield put({ type: 'save', payload: { userInfo: null } });
      // yield put(routerRedux.replace('/login'));
    },
    *subscribe({ payload }, { put, call }) {  // eslint-disable-line
      const result = yield call(userService.addRepo, payload);
      if (!result.data) {
        notification.error({ message: '订阅失败', description: '' });
        return false;
      }
      yield put({ type: 'addRepo', payload });
      notification.success({ message: '订阅成功', description: '' });
      return true;
    },
    *unsubscribe({ payload }, { put, call }) {  // eslint-disable-line
      const result = yield call(userService.delRepo, payload);
      if (!result.data) {
        notification.error({ message: '退订失败', description: '' });
        return false;
      }
      yield put({ type: 'delRepo', payload });
      notification.success({ message: '退订成功', description: '' });
      return true;
    },
    *addRepo({ payload }, { put, select }) {  // eslint-disable-line
      const { repos } = yield select(state => state.app);
      const index = repos.findIndex((it) => {
        return it.owner === payload.owner && it.repo === payload.repo;
      });
      if (-1 === index) {
        yield put({ type: 'save', payload: { repos: [...repos, payload] } });
      }
    },
    *delRepo({ payload }, { put, select }) {  // eslint-disable-line
      const { repos } = yield select(state => state.app);
      const index = repos.findIndex((it) => {
        return it.owner === payload.owner && it.repo === payload.repo;
      });
      if (-1 !== index) {
        repos.splice(index, 1);
        yield put({ type: 'save', payload: { repos } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
