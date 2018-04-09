// import React from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
import { Modal } from 'antd';
import userServices from '../services/user';
import authServices from '../services/auth';


export default {

  namespace: 'iusses',

  state: {
    iusses: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
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
      const { code, ...search } = payload;
      if (!code) {
        return yield put({ type: 'loginFaild', payload: search });
      }
      const { data } = yield call(userServices.login, { code });
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
    *getOwners({ payload }, { put, call }) {
      // const { repos } = yield select(state => state.app);
      const list = yield payload.map(it => call(githubServices.getUserInfo, it));
      const owners = list.map(({ data }, index) => {
        const matchObj = payload[index].match(/https:\/\/github.com\/(\w+)\/(\w+)(\/.*)?/);
        if (data) {
          return { ...data, repo: matchObj[2], repo_url: payload[index] };
        } else if (matchObj) {
          return { login: matchObj[1], name: matchObj[1], repo: matchObj[2], repo_url: payload[index] };
        } else {
          return null;
        }
      });
      yield put({ type: 'save', payload: { owners } });
    },
    *getIssues({ payload }, { put, call, select }) {
      // const { repos } = yield select(state => state.app);
      const list = yield payload.map(it => call(githubServices.getIssues, it));
      // const issues = list.map(({ data }) => (data || []));
      const { records, favorites } = yield select(state => state.app);
      const issues = list.map(({ data }) => (data || [])).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue];
      }).map((it) => {
        return { ...it, read: records.includes(it.url), favorite: favorites.includes(it.url) };
      });
      yield put({
        type: 'save',
        payload: {
          issues: issues.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          }),
        },
      });
    },
    *routerReduxPush({ payload }, { put }) {
      yield put(routerRedux.push(payload));
    },
    *markAsRead({ payload }, { call }) {
      payload.read = true;    // eslint-disable-line
      yield call(userServices.markAsLocalRead, payload.url);
      // yield put(routerRedux.push(payload));
    },
    *toggleFavorite({ payload }, { call }) {
      payload.favorite = !payload.favorite;    // eslint-disable-line
      if (payload.favorite) {
        yield call(userServices.markAsLocalFavorite, payload.url);
      } else {
        yield call(userServices.unmarkAsLocalFavorite, payload.url);
      }
    },
    // *getOwners({ payload }, { put, call }) {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};