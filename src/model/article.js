import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import delay from '../utils/delay'
import { queryList, queryPages } from '../service/article'
import { model } from './common'
import { showWxLoading, hideWxLoading } from '../utils'

export default modelExtend(model, {
  namespace: 'article',
  state: {
    page: 0,
    pages: [],
    list: [],
    isShowLoading: false,
    showUpdate: false,
  },
  effects: {
    *init({ payload }, { call, put, take }) {
      yield put.resolve(action('pages'))
      yield put(action('list'))

      yield put.resolve(action('user/balance'))
      yield put(action('redPacket/get'))
    },
    *pages({ payload }, { call, put }) {
      const { data } = yield call(queryPages)
      yield put(action('save', { pages: data }))
    },
    *list({ payload }, { call, put, select }) {
      let { page, pages, list } = yield select(state => state.article)
      const { data } = yield call(queryList, { page: pages[page] })
      yield put(action('save', { list: data, page }))
    },
    *loadMore({ payload }, { select, call, put }) {
      showWxLoading()
      let { page, pages, list } = yield select(state => state.article)
      page += 1
      const { data } = yield call(queryList, { page: pages[page] })
      yield put(action('save', { list: list.concat(data), page }))
      hideWxLoading()
    },
    *refresh({ payload }, { select, call, put }) {
      let { page, pages, list } = yield select(state => state.article)
      page += 1
      const { data } = yield call(queryList, { page: pages[page] })
      yield put(action('save', { list: data, page }))
      yield delay(1000)
    },
  },
  reducers: {},
})
