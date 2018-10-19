import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { productService } from '../service'
import { listPageModel } from './common'

export default modelExtend(listPageModel, {
  namespace: 'comment',
  state: {},
  effects: {
    *init({ payload }, { put }) {
      const { id } = payload
      yield put.resolve(action('list', { page: 1, id }))
    },
    *list({ payload }, { call, put, select }) {
      const selectFilter = yield select(state => state.comment.filter)
      const { data } = yield call(productService.comments, { ...selectFilter, ...payload })
      yield put(action('saveList', { data, filter: payload }))
    },
    *loadMore({ payload }, { select, call, put }) {
      let { list, filter } = yield select(state => state.comment)
      if (!filter.isEnd) {
        const newFilter = {
          ...filter,
          page: filter.page + 1,
        }
        const { data } = yield call(productService.comments, newFilter)
        data.items = list.concat(data.items)
        yield put(action('saveList', { data, filter: newFilter }))
      }
    },
  },
  reducers: {
    clear(state, { payload }) {
      return {
        info: {},
        barrages: [],
      }
    },
  },
})
