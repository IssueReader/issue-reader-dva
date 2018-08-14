// import React from 'react';
// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
// import { notification } from 'antd';

import userServices from '../services/user';


export default {

  namespace: 'watching',

  state: {
    list: [],
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if ('/user/watching' === pathname) {
          return dispatch({ type: 'load', payload: { search } });
        }
      });
    },
  },

  effects: {
    *load({ payload }, { call, put, select }) {  // eslint-disable-line
      const { loading } = yield select(state => state.watching);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { list: undefined, loading: true } });
      const { data } = yield call(userServices.getWatching);
      yield put({ type: 'save', payload: { loading: false } });
      if (!data) {
        return yield put({ type: 'save', payload: { list: null } });
      }
      const { repos } = yield select(state => state.app);
      const list = data.list.map((it) => {
        const index = repos.findIndex((item) => {
          return it.repo === item.repo && it.owner === item.owner;
        });
        return { ...it, watch: -1 !== index };
      });
      return yield put({ type: 'save', payload: { list } });
    },
    // *getOwners({ payload }, { put, call }) {},
    *subscribe({ payload }, { put, call }) {
      if (payload.loading) {
        return;
      }
      yield put.resolve({ type: 'update', payload: { ...payload, loading: true } });
      const result = yield put.resolve({ type: 'app/subscribe', payload });
      yield put.resolve({ type: 'update', payload: { ...payload, loading: false, watch: result } });
    },
    *unsubscribe({ payload }, { put, call }) {
      if (payload.loading) {
        return;
      }
      yield put.resolve({ type: 'update', payload: { ...payload, loading: true } });
      const result = yield put.resolve({ type: 'app/unsubscribe', payload });
      yield put.resolve({ type: 'update', payload: { ...payload, loading: false, watch: !result } });
    },
    *update({ payload }, { put, select }) {
      const { list } = yield select(state => state.watching);
      if (!list) {
        return;
      }
      const index = list.findIndex(it => (payload.owner === it.owner && payload.repo === it.repo));
      if (-1 === index) {
        return;
      }
      const newList = [...list];
      newList[index] = { ...newList[index], ...payload };
      yield put({ type: 'save', payload: { list: newList } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
