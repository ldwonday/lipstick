import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { listPageModel } from './common'
import { queryBalanceDetail, withDraw } from '../service'
import { formatDate } from '../utils/timeFormat'
import { showWxLoading, hideWxLoading, showModal, showModalWithTitle } from '../utils'

export default modelExtend(listPageModel, {
  namespace: 'cash',
  state: {
    pageNum: 0,
  },
  effects: {
    *init({ payload }, { call, put, all, take }) {
      yield put.resolve(action('app/checkToken'))
      yield all([put.resolve(action('user/balance')), put.resolve(action('detail'))])
    },
    *detail({ payload }, { call, select, put }) {
      const selectFilter = yield select(state => state.cash.filter)
      const { data, isEnd } = yield call(queryBalanceDetail, selectFilter)
      data.items.map(item => ({
        ...item,
        amount: item.amount.toFixed(3),
        assistDate: formatDate(item.assistDate, 'yyyy-MM-dd HH:mm:ss'),
      }))
      selectFilter.isEnd = isEnd
      yield put(action('saveList', { data, filter: selectFilter }))
    },
    *loadMore({ payload }, { call, select, put }) {
      const selectFilter = yield select(state => state.cash.filter)
      if (!selectFilter.isEnd) {
        const filter = { ...selectFilter, pageNum: selectFilter.page + 1 }
        const list = yield select(state => state.cash.list)
        const { data } = yield call(queryBalanceDetail, filter)
        const newList = data.map(item => ({
          ...item,
          amount: item.amount.toFixed(3),
          assistDate: formatDate(item.assistDate, 'yyyy-MM-dd HH:mm:ss'),
        }))
        data.items = list.concat(newList)
        yield put(action('saveList', { data, filter }))
      }
    },
    *withDraw({ payload }, { call, put }) {
      showWxLoading()
      try {
        const res = yield call(withDraw, payload)
        hideWxLoading()
        if (res.succ) {
          yield put(action('user/balance'))
          wx.showModal({
            title: '提现成功',
            content: '预计1-5个工作日内到账',
            showCancel: false,
            confirmText: '确定',
          })
        } else {
          showModal('提现失败')
        }
      } catch (e) {
        const detail = e.detail
        if (detail === 'exceed.times.limit') {
          showModalWithTitle('提现超过次数', '亲，因微信规定提现到零钱每天最多3次哦，请明天再提吧')
        } else if (detail === 'too.frequency') {
          wx.showToast({ title: '提现过于频繁，请1分钟后再试', icon: 'none' })
        } else {
          showModalWithTitle(
            '服务器繁忙',
            `因太多人使用，开发小哥正加紧处理，请稍后再试哈(${detail})`
          )
        }
      }
      hideWxLoading()
    },
  },
  reducers: {},
})
