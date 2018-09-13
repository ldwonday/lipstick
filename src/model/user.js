import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { queryBalance, queryBalanceDetail } from '../service'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'user',
  state: {
    balance: 0,
    details: [],
    withdrawAmount: 0.3,
  },
  effects: {
    *balance({ payload }, { call, put }) {
      const { data } = yield call(queryBalance)
      yield put(action('save', data))
    },
  },
  reducers: {},
})
