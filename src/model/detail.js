import modelExtend from 'dva-model-extend'
import Taro from '@tarojs/taro'
import action from '../utils/action'
import { queryList, query } from '../service/article'
import { model } from './common'
import { showWxLoading, hideWxLoading, getStoragePages } from '../utils'
import { formatDate } from '../utils/timeFormat'

export default modelExtend(model, {
  namespace: 'detail',
  state: {
    page: 0,
    article: {},
    previewImg: [],
    list: [],
  },
  effects: {
    *init({ payload }, { call, put, take }) {
      const { id, page } = payload
      yield put.resolve(action('query', id))
      yield put(action('list', page))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield query(payload)
      data.time = formatDate(new Date(data.time))
      yield put(action('save', { article: data }))
    },
    *list({ payload }, { call, put, select }) {
      const res = yield getStoragePages()
      const pages = res.data
      let page = payload === undefined ? Math.floor(Math.random() * pages.length) : payload
      page += 1
      const { data } = yield call(queryList, { page: pages[page] })
      yield put(action('save', { list: data, page }))
    },
    *saveFavourite({ payload }, { call, put, take }) {
      let favourite = []
      try {
        const res = yield Taro.getStorage({ key: 'favourite' })
        favourite = (res && res.data) || []
      } catch (e) {
        console.log(e)
      }
      const { nId } = payload
      if (favourite.find(item => item.nId === nId)) {
        Taro.showToast({
          title: '文章已经收藏啦！',
        })
        return
      }
      favourite.push({
        ...payload,
        saveTime: formatDate(new Date()),
      })
      yield Taro.setStorage({ key: 'favourite', data: favourite })
      Taro.showToast({
        title: '收藏成功！',
      })
    },
    *loadMore({ payload }, { select, call, put }) {
      showWxLoading()
      const res = yield getStoragePages()
      const pages = res.data
      let { page, list } = yield select(state => state.detail)
      page += 1
      const { data } = yield call(queryList, { page: pages[page] })
      yield put(action('save', { list: list.concat(data), page }))
      hideWxLoading()
    },
  },
  reducers: {},
})
