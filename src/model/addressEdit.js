import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { userService } from '../service'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'addressEdit',
  state: {},
  effects: {
    *init({ payload }, { put }) {},
    *setDefault({ payload }, { call, put }) {
      const res = yield Taro.showModal({
        title: '提示',
        content: '确实设置这个地址为您的默认地址吗？',
      })
      if (res.confirm) {
        yield call(userService.address.setDefault, payload)
        yield put(action('address/list'))
        Taro.showToast({
          title: '保存成功',
        })
      }
    },
  },
  reducers: {},
})
