import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { userService } from '../service'
import { model } from './common'

const { address } = userService

export default modelExtend(model, {
  namespace: 'address',
  state: {},
  effects: {
    *init({ payload }, { put }) {
      yield put.resolve(action('list'))
    },
    *list({ payload }, { call, put }) {
      const { data } = yield call(address.list)
      yield put(action('save', { list: data }))
    },
    *setDefault({ payload }, { call, put }) {
      const res = yield Taro.showModal({
        title: '提示',
        content: '确实设置这个地址为您的默认地址吗？',
      })
      if (res.confirm) {
        yield call(userService.address.setDefault, payload)
        yield put(action('list'))
        Taro.showToast({
          title: '保存成功',
        })
      }
    },
  },
  reducers: {},
})
