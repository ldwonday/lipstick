import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { lipstickService, userService } from '../service'
import { listPageModel } from './common'


export default modelExtend(listPageModel, {
  namespace: 'orderDetail',
  state: {},
  effects: {
    *init({ payload }, { call, put }) {
      const { orderNo } = payload
      yield put.resolve(action('query', orderNo))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(lipstickService.prizeDetail, payload)
      yield put(action('save', { ...data }))
    },
    *applyDelivery({ payload }, { call, put }) {
      const setting = yield Taro.getSetting()
      if (setting.authSetting['scope.address']) {
        const addressRes = yield Taro.chooseAddress()
        const {
          cityName,
          countyName,
          detailInfo,
          provinceName,
          telNumber,
          userName,
        } = addressRes
        const addRes = yield call(userService.address.add, {
          address: detailInfo,
          city: cityName,
          name: userName,
          phone: telNumber,
          province: provinceName,
          region: countyName,
        })
        try {
          const { succ } = yield call(lipstickService.bindAddress, {
            addressId: addRes.data,
            orderNo: payload,
          })
          if (succ) {
            yield Taro.showModal({
              title: '申请成功',
              content: '我们将在三个工作日内将您心爱的口红寄出，请小主多多关注小程序或公众号哦！',
              showCancel: false,
            })
            yield put(action('init', { orderNo: payload }))
          } else {
            Taro.showToast({
              title: '申请发货失败，订单ID：' + payload,
              icon: 'none',
              duration: 3000,
            })
          }
        } catch (e) {
          Taro.showToast({
            title: '申请发货失败，订单ID：' + payload,
            icon: 'none',
            duration: 3000,
          })
        }
      } else {
        try {
          yield Taro.authorize({
            scope: 'scope.address',
            success: this.applyDelivery,
          })
          yield put(action('applyDelivery', payload))
        } catch (e) {
          const res = yield Taro.showModal({
            title: '用户未授权',
            content:
              '小程序功能无法从微信中获取您的收寄地址，请按确定并在授权管理中选中“通讯地址”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
          })
          res.confirm && Taro.openSetting({})
        }
      }
    },
  },
  reducers: {},
})
