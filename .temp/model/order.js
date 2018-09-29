import modelExtend from 'dva-model-extend';
import action from '../utils/action';
import { getFinished, getNotFinish } from '../service';
import { listPageModel } from './common';

export default modelExtend(listPageModel, {
  namespace: 'order',
  state: {
    finished: {
      page: 0,
      list: []
    },
    notFinish: {
      page: 0,
      list: []
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('notFinish'));
      yield put(action('finished'));
    },
    *finished({ payload }, { call, put }) {
      const page = 0;
      const { data } = yield call(getFinished, { page });
      yield put(action('save', { finished: data, page }));
    },
    *notFinish({ payload }, { call, put }) {
      const page = 0;
      const { data } = yield call(getNotFinish, { page });
      yield put(action('save', { notFinish: data, page }));
    },
    *loadMore({ payload }, { select, call, put }) {
      let { finished, notFinish } = yield select(state => state.order);
      console.log(payload, finished.isEnd, notFinish.isEnd);
      if (payload === '1' && !finished.isEnd) {
        const page = finished.page + 1;
        const { data } = yield call(getFinished, { page });
        data.items = finished.items.concat(data.items);
        yield put(action('save', { finished: { page, ...data } }));
      } else if (payload === '0' && !notFinish.isEnd) {
        const page = notFinish.page + 1;
        const { data } = yield call(getNotFinish, { page });
        data.items = finished.items.concat(data.items);
        yield put(action('save', { notFinish: { page, ...data } }));
      }
    }
  },
  reducers: {}
});