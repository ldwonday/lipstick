import modelExtend from 'dva-model-extend'
import { model } from './common'
import { setIsFirst, getIsFirst } from '../utils'
import action from '../utils/action'

export default modelExtend(model, {
  namespace: 'app',
  state: {
    startBarHeight: 0,
    navigationHeight: 0,
    isFirst: true,
  },
  reducers: {},
  effects: {
    *init({ payload }, { put }) {
      try {
        yield put(action('user/init'))
      } catch (e) {
        console.log(e)
      }
      try {
        const { data } = yield getIsFirst()
        yield put(action('save', { isFirst: data }))
      } catch (e) {
        yield put(action('save', { isFirst: true }))
      }
    },
    *changeIsFirst({ payload }, { put }) {
      yield setIsFirst(payload)
      yield put(action('save', { isFirst: payload }))
    },
  },
})
