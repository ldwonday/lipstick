import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { balanceService } from '../service'
import { listPageModel } from './common'

export default modelExtend(listPageModel, {
  namespace: 'profitDetail',
  state: {
    balance: 78,
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('list', { page: 1 }))
    },
    *list({ payload }, { call, put, select }) {
      const selectFilter = yield select(state => state.profitDetail.filter)
      const { data } = yield call(balanceService.detail, { ...selectFilter, ...payload })
      yield put(action('saveList', { data, filter: selectFilter }))
    },
    *loadMore({ payload }, { select, call, put }) {
      let { list, filter } = yield select(state => state.profitDetail)
      if (!filter.isEnd) {
        const newFilter = { ...filter, page: filter.page + 1 }
        const { data } = yield call(balanceService.detail, newFilter)
        data.items = list.concat(data.items)
        yield put(action('saveList', { data, filter: newFilter }))
      }
    },
  },
  reducers: {},
})
