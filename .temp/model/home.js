import modelExtend from 'dva-model-extend';
import action from '../utils/action';
import { queryProductList } from '../service';
import { listPageModel } from './common';

export default modelExtend(listPageModel, {
  namespace: 'home',
  state: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('list'));
    },
    *list({ payload }, { call, put, select }) {
      const selectFilter = yield select(state => state.home.filter);
      const { data } = yield call(queryProductList, selectFilter);
      yield put(action('saveList', { data, filter: selectFilter }));
    },
    *loadMore({ payload }, { select, call, put }) {
      let { list, filter } = yield select(state => state.home);
      if (!filter.isEnd) {
        const newFilter = { ...filter, page: filter.page + 1 };
        const { data } = yield call(queryProductList, newFilter);
        data.items = list.concat(data.items);
        yield put(action('saveList', { data, filter: newFilter }));
      }
    }
  },
  reducers: {}
});