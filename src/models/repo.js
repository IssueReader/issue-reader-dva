// import React from 'react';
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import { notification } from 'antd';

import userServices from '../services/user';

export default {
  namespace: 'repo',

  state: {
    issues: [],
    info: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/repos\/([^/]+)\/([^/]+)$/);
        if (match) {
          return dispatch({ type: 'load', payload: { owner: match[1], repo: match[2] } });
        }
      });
    },
  },

  effects: {
    *load({ payload }, { call, put, select }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { issues: undefined, info: payload } });
      const { data } = yield call(userServices.getRepoInfo, payload);
      const { info } = yield select(state => state.repo);
      if (info.owner === payload.owner && info.repo === payload.repo) {
        yield put({ type: 'save', payload: { issues: data || null } });
      }
    },
    // *getOwners({ payload }, { put, call }) {},
    *markAsRead({ payload }, { put, call }) {
      payload.read = true;    // eslint-disable-line
      yield call(userServices.markAsRead, payload);
      yield put({ type: 'update', payload });
      // yield put(routerRedux.push(payload));
    },
    *toggleFavorite({ payload }, { put, call }) {
      payload.favorite = !payload.favorite;    // eslint-disable-line
      if (payload.favorite) {
        const { err } = yield call(userServices.markAsFavorite, payload);
        if (err) {
          return notification.error({ message: '添加收藏失败', description: '' });
        }
      } else {
        const { err } = yield call(userServices.removeFavorite, payload);
        if (err) {
          return notification.error({ message: '删除收藏失败', description: '' });
        }
      }
      yield put({ type: 'update', payload });
    },
    *update({ payload }, { put, select }) {
      const { issues } = yield select(state => state.issues);
      if (!issues) {
        return;
      }
      const list = issues.map(it => {
        if (payload.owner === it.owner && payload.repo === it.repo && payload.number === it.number) {
          return { ...it, favorite: payload.favorite, read: payload.read };
        }
        return it;
      });
      yield put({ type: 'save', payload: { issues: list } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
