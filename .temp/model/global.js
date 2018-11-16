import Taro from '@tarojs/taro-h5';
import Nerv from "nervjs";
import modelExtend from 'dva-model-extend';
import { model } from './common';
import { setIsFirst, getIsFirst } from '../utils';
import { formService } from '../service';
import action from '../utils/action';

export default modelExtend(model, {
  namespace: 'app',
  state: {
    startBarHeight: 0,
    navigationHeight: 0,
    isFirst: true,
    isShowShare: true
  },
  reducers: {},
  effects: {
    *init({ payload }, { put }) {
      try {
        yield put(action('user/init'));
      } catch (e) {
        console.log(e);
      }
      let isFirst = true,
          system = 'android',
          muted = null;
      try {
        const { data } = yield getIsFirst();
        isFirst = data;
      } catch (e) {
        console.log(e);
      }
      try {
        muted = yield Taro.getStorageSync('muted');
      } catch (e) {
        console.log(e);
      }
      try {
        system = yield Taro.getSystemInfoSync().system;
      } catch (e) {
        console.log(e);
      }
      yield put(action('save', { muted, isFirst, system }));
    },
    *changeMuted({ payload }, { put }) {
      yield Taro.setStorageSync('muted', payload);
      yield put(action('save', { muted: payload }));
    },
    *changeIsFirst({ payload }, { put }) {
      yield setIsFirst(payload);
      yield put(action('save', { isFirst: payload }));
    },
    *changeIsShowShare({ payload }, { put }) {
      yield put(action('save', { isShowShare: payload }));
    },
    *submitForm({ payload }, { call }) {
      yield call(formService.submit, payload);
    }
  }
});