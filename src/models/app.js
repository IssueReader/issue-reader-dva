// import React from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
import { Modal } from 'antd';
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
    *loginSucceed({ payload }, { put, call }) {  // eslint-disable-line
      yield call(authServices.setSessionToken, payload.userInfo.sessionToken);
      yield put({ type: 'save', payload: { userInfo: payload.userInfo } });
      const { data } = yield call(userServices.getRepos);
      if (data && 0 < data.length) {
        yield put({ type: 'save', payload: { repos: data } });
        const { from, ...search } = payload.search;
        const pathname = (from && 'login' !== from && '/mobile' !== from) ? from : '/all';
        yield put(routerRedux.replace({
          pathname,
          search: `?${queryString.stringify(search)}`,
        }));
      } else {
        // TODO: 引导页面，获取用户 github 账号 watching repos
        debugger;  // eslint-disable-line
        yield put(routerRedux.replace('/all'));
      }
    },
    *loginFaild({ payload }, { put, call }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { userInfo: null } });
      yield put(routerRedux.replace('/login'));
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
