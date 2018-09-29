import modelExtend from 'dva-model-extend';
import action from '../utils/action';
import { queryProductBarrage, getCallRecord, doCall } from '../service';
import { hideWxLoading, showModal, showWxLoading } from '../utils';
import { model } from './common';

export default modelExtend(model, {
  namespace: 'call',
  state: {
    info: {},
    barrages: []
  },
  effects: {
    *init({ payload }, { call, put }) {
      const { recordNo } = payload;
      yield put(action('barrages'));
      yield put.resolve(action('getCall', recordNo));
    },
    *getCall({ payload }, { call, put }) {
      try {
        const { data } = yield call(getCallRecord, { recordNo: payload });
        yield put(action('save', { info: data }));
      } catch (e) {
        showModal(`数据加载失败${e.detail}`);
      }
    },
    *doCall({ payload }, { call, put }) {
      try {
        showWxLoading();
        yield call(doCall, { recordNo: payload });
        yield put(action('getCall', payload));
        hideWxLoading();
      } catch (e) {
        showModal('打call失败了，再试一次吧');
        hideWxLoading();
      }
    },
    *barrages({ payload }, { call, put }) {
      const { data } = yield call(queryProductBarrage);
      yield put(action('save', { barrages: data }));
    }
  },
  reducers: {
    clear(state, { payload }) {
      return {
        info: {},
        barrages: []
      };
    }
  }
});