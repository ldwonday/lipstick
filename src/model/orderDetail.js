import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { orderService } from '../service'
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
      const { data } = yield call(orderService.get, payload)
      yield put(action('save', { ...data }))
    },
  },
  reducers: {},
})
