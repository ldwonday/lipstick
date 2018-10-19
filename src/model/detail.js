import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { barrageService, productService } from '../service'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'detail',
  state: {
    info: {},
    barrages: [],
    comments: [],
  },
  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload
      yield put(action('barrages', id))
      yield put(action('comment', id))
      yield put.resolve(action('query', id))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(productService.query, payload)
      console.log('queryProduct ==>', data)
      yield put(action('save', { info: data }))
    },
    *barrages({ payload }, { call, put }) {
      const { data } = yield call(barrageService.emptyBarrage, payload)
      yield put(action('save', { barrages: data }))
    },
    *comment({ payload }, { call, put }) {
      const { data } = yield call(productService.comments, { size: 3, page: 1, id: payload })
      yield put(action('save', { comments: data.items }))
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
