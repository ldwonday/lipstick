import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { orderService } from '../service'
import { listPageModel } from './common'

export default modelExtend(listPageModel, {
  namespace: 'order',
  state: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('list', { page: 1 }))
    },
    *list({ payload }, { call, put, select }) {
      const selectFilter = yield select(state => state.order.filter)
      const { data } = yield call(orderService.list, { ...selectFilter, ...payload })
      yield put(action('saveList', { data, filter: payload }))
    },
    *loadMore({ payload }, { select, call, put }) {
      let { list, filter } = yield select(state => state.order)
      if (!filter.isEnd) {
        const newFilter = {
          ...filter,
          page: filter.page + 1,
        }
        const { data } = yield call(orderService.list, newFilter)
        data.items = list.concat(data.items)
        yield put(action('saveList', { data, filter: newFilter }))
      }
    },
  },
  reducers: {},
})
