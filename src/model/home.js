import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { showModal, showTextToast, showWxLoading, hideWxLoading, getStorageLoginResult, setStorageShareCode } from '../utils'
import { lipstickService, orderService, wxService } from '../service'
import { listPageModel } from './common'

export default modelExtend(listPageModel, {
  namespace: 'home',
  state: {
    balance: 0,
    lipsticks: [],
    payList: [],
    shareList: [],
    configViews: {},
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('productList', payload))
    },
    *productList({ payload }, { call, put, select }) {
      const { shareCode = '' } = payload || {}
      if (shareCode) {
        yield setStorageShareCode(shareCode)
      }
      const {
        data: { payItems, productViews, configViews, ...other },
      } = yield call(lipstickService.productList, shareCode)
      const loginRes = yield getStorageLoginResult()
      yield put(
        action('save', {
          shareCode: loginRes.data.shareCode,
          lipsticks: productViews,
          payList: payItems,
          configViews,
          ...other,
        })
      )
    },
    *commit({ payload }, { call, put, select }) {
      if (!payload.productId) {
        showTextToast('请选择收货地址')
        return
      }
      if (payload.count <= 0 || payload.count > 99) {
        showTextToast('请核对您要购买的数量')
        return
      }
      showWxLoading()
      try {
        const { data } = yield call(orderService.lipstickCommit, payload)
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
          showTextToast('购买成功')
          retrieve()
          yield put(action('productList'))
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
    *shareList({ payload }, { call, put, select }) {
      const { data } = yield call(lipstickService.shareList)
      yield put(action('save', { shareList: data }))
    },
  },
  reducers: {},
})
