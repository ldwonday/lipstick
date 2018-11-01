import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { orderService, productService, userService, wxService } from '../service'
import { model } from './common'
import { hideWxLoading, showModal, showWxLoading, showTextToast } from '../utils'

export default modelExtend(model, {
  namespace: 'orderConfirm',
  state: {
    info: {},
    postDetail: {},
  },
  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload
      yield put.resolve(action('query', id))
      yield put.resolve(action('getAddress'))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(productService.query, payload)
      yield put(action('save', { info: data }))
    },
    *getAddress({ payload }, { call, put }) {
      const { data } = yield call(userService.address.get)
      yield put(action('save', { postDetail: data }))
    },
    *commit({ payload }, { call }) {
      if (!payload.addressId) {
        showTextToast('请选择收货地址')
        return
      }
      if (payload.count <= 0 || payload.count > 99) {
        showTextToast('请核对您要购买的数量')
        return
      }
      showWxLoading()
      try {
        const { data } = yield call(orderService.commit, payload)
        const { orderNo, prePayResult } = data
        let retrieveTimes = 0
        const retrieve = () => {
          retrieveTimes < 5 &&
            wxService.pay.retrieveOrder(orderNo).catch(e => {
              retrieveTimes++
              retrieve()
              console.log('retrieveOrder error ===> ', e)
            })
        }
        try {
          yield Taro.requestPayment({
            ...prePayResult,
          })
          Taro.navigateTo({ url: `/pages/order/detail/index?orderNo=${orderNo}` })
          retrieve()
        } catch (e) {
          console.log(11, e)
          if (e.errMsg.indexOf('cancel') !== -1) {
          } else {
            showModal(`支付失败(${e.detail})`)
          }
        } finally {
          hideWxLoading()
        }
      } catch (e) {
        console.log(22, e)
        hideWxLoading()
        showModal(`获取订单信息失败(${e.detail})`)
      }
    },
  },
  reducers: {},
})
