import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'survey',
  state: {
    list: [],
  },
  effects: {
    *init({ payload }, { call, put, take }) {
      /*yield put.resolve(action('app/checkToken'))
      yield put(action('user/balance'))*/
    },
  },
  reducers: {},
})
