import Taro from '@tarojs/taro-h5';
import Nerv from "nervjs";
import modelExtend from 'dva-model-extend';
import action from '../utils/action';
import { queryProduct, queryProductBarrage, commitOrder, retrieveOrder, newCall } from '../service';
import { model } from './common';
import { hideWxLoading, showWxLoading, showModal } from '../utils';

export default modelExtend(model, {
  namespace: 'detail',
  state: {
    info: {},
    barrages: []
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put(action('barrages', payload));
      yield put.resolve(action('query', payload));
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(queryProduct, { id: payload, isNet: true });
      yield put(action('save', { info: data }));
    },
    *barrages({ payload }, { call, put }) {
      const { data } = yield call(queryProductBarrage);
      yield put(action('save', { barrages: data }));
    },
    *newCall({ payload }, { call, put, select }) {
      showWxLoading();
      const {
        info: { productId }
      } = yield select(state => state.detail);
      try {
        const { data } = yield call(newCall, { productId, formId: payload });
        Taro.navigateTo({ url: `/pages/call/index?recordNo=${data.recordNo}` });
        hideWxLoading();
      } catch (e) {
        showModal(`数据加载失败：${e.detail}`);
        hideWxLoading();
      }
    },
    *buyProduct({ payload }, { call, put, select }) {
      const {
        info: { productId, mainImageUrl }
      } = yield select(state => state.detail);
      showWxLoading();
      try {
        const { data } = yield call(commitOrder, {
          buyType: 1,
          productId,
          formId: payload,
          shareCode: ''
        });
        const { orderNo, prePayResult } = data;
        let retrieveTimes = 0;
        const retrieve = () => {
          retrieveTimes < 5 && retrieveOrder(orderNo).catch(e => {
            retrieveTimes++;
            retrieve();
            console.log('retrieveOrder error ===> ', e);
          });
        };
        try {
          yield Taro.requestPayment({
            ...prePayResult
          });
          Taro.navigateTo({ url: `/pages/paySuccess/index?imageUrl=${mainImageUrl}` });
          retrieve();
        } catch (e) {
          if (!(e.errMsg.indexOf('cancel') !== -1)) {
            showModal(`支付失败(${e.detail})`);
          }
        } finally {
          hideWxLoading();
        }
      } catch (e) {
        hideWxLoading();
        showModal(`获取订单信息失败(${e.detail})`);
      }
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