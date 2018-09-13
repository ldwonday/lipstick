import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'favourites',
  state: {
    list: [],
  },
  effects: {
    *init({ payload }, { call, put, take }) {
      const { data } = yield Taro.getStorage({ key: 'favourite' })
      yield put(action('save', { list: data }))

      yield put.resolve(action('app/checkToken'))
      yield put(action('user/balance'))
    },
    *remove({ payload }, { call, put, take }) {
      const { data } = yield Taro.getStorage({ key: 'favourite' })
      const index = data.find(item => item.nId === payload)
      const modal = yield Taro.showModal({
        title: '提示',
        content: '确认要删除吗？',
      })
      if (modal.confirm) {
        data.splice(index, 1)
        yield Taro.setStorage({ key: 'favourite', data })
        yield put(action('init'))
      }
    },
  },
  reducers: {},
})
