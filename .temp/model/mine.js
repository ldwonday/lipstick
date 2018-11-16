import modelExtend from 'dva-model-extend';
import action from '../utils/action';
import { lipstickService } from '../service';
import { model } from './common';
import { getStorageLoginResult } from "../utils";

export default modelExtend(model, {
  namespace: 'mine',
  state: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('me'));
    },
    *me({ payload }, { call, put }) {
      const { data } = yield call(lipstickService.my);
      yield put(action('save', data));
    },
    *shareList({ payload }, { call, put, select }) {
      const { data } = yield call(lipstickService.shareList);
      const loginRes = yield getStorageLoginResult();
      yield put(action('save', { shareList: data, shareCode: loginRes.data.shareCode }));
    }
  }
});