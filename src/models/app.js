// import React from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
import { Modal, notification } from 'antd';
import userServices from '../services/user';
import authServices from '../services/auth';


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
      const search = queryString.parse(payload.search);
      if (search.code) {
        return yield put({ type: 'loginByCode', payload: search });
      } else {
        return yield put({ type: 'loginByToken', payload: search });
      }
    },
    *loginByCode({ payload }, { put, call }) {  // eslint-disable-line
      // debugger;  // eslint-disable-line
      const { code, state, ...search } = payload;
      if (!code) {
        return yield put({ type: 'loginFaild', payload: search });
      }
      const { data } = yield call(userServices.login, { code, state });
      if (data) {
        return yield put({ type: 'loginSucceed', payload: { userInfo: data, search } });
      } else {
        const ref = Modal.error({
          title: '登录失败',
          content: 'code 已过期',
          onOk: () => {
            ref.destroy();
          },
        });
        return yield put({ type: 'loginFaild', payload: search });
      }
    },
    *loginByToken({ payload }, { put, call }) {  // eslint-disable-line
      const token = yield call(authServices.getSessionToken);
      if (!token) {
        return yield put({ type: 'loginFaild', payload });
      }
      const { data } = yield call(userServices.login, { token });
      if (data) {
        return yield put({ type: 'loginSucceed', payload: { userInfo: data, search: payload } });
      } else {
        return yield put({ type: 'loginFaild', payload });
      }
    },
    *logout({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authServices.removeSessionToken);
      yield put(routerRedux.replace('/login'));
    },
    *loginSucceed({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authServices.setSessionToken, payload.userInfo.sessionToken);
      yield put({ type: 'save', payload: { userInfo: payload.userInfo } });
      const { data } = yield call(userServices.getRepos);
      yield put({ type: 'save', payload: { repos: data || [] } });
      const { from, ...search } = payload.search;
      if (data && 0 < data.length && from && 'login' !== from && '/mobile' !== from) {
        yield put(routerRedux.replace({ from, search: `?${queryString.stringify(search)}` }));
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
      const result = yield call(userServices.addRepo, payload);
      if (!result.data) {
        notification.error({ message: '订阅失败', description: '' });
        return false;
      }
      yield put({ type: 'addRepo', payload });
      notification.success({ message: '订阅成功', description: '' });
      return true;
    },
    *unsubscribe({ payload }, { put, call }) {  // eslint-disable-line
      const result = yield call(userServices.delRepo, payload);
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
