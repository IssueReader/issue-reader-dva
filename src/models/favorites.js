// import React from 'react';
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
// import { notification } from 'antd';
import queryString from 'query-string';
import localForageService from '../services/localForage';
// import userServices from '../services/user';

export default {
  namespace: 'favorites',

  state: {
    list: [],
    loading: false,
    total: undefined,
    page: 1,
    pageSize: 20,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if ('/favorites' === pathname) {
          return dispatch({ type: 'load', payload: { search } });
        }
      });
    },
  },

  effects: {
    *load({ payload }, { call, put, select }) {
      const parsed = queryString.parse(payload.search);
      const page = parseInt(parsed.page || 1, 10);
      const { pageSize, loading } = yield select(state => state.favorites);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { list: [], loading: true, page } });
      const { data } = yield call(localForageService.getFavoriteIssues, (page - 1) * pageSize, pageSize);
      yield put({
        type: 'save',
        payload: { loading: false, list: (data && data.list) || null, total: data && data.total },
      });
    },
    *updateIssue({ payload }, { put, call, select }) {  // eslint-disable-line
      yield call(localForageService.updateIssue, payload);
      const { list } = yield select(state => state.favorites);
      const index = list.findIndex(
        it => it.owner === payload.owner && it.repo === payload.repo && it.number === payload.number,
      );
      if (-1 !== index) {
        const issues = [...list];
        issues[index] = { ...issues[index], ...payload };
        yield put({ type: 'save', payload: { list: issues } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
