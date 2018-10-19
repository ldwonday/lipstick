import modelExtend from 'dva-model-extend'
import Taro from '@tarojs/taro'
import action from '../utils/action'
import { showModal, showModalWithTitle, showWxLoading, hideWxLoading, showNotify } from '../utils'
import { balanceService, wxService } from '../service'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'profit',
  state: {
    balance: 78,
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('list'))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(balanceService.query)
      yield put(action('save', data))
    },
    *withdraw({ payload }, { call, put }) {
      const { amount, formId } = payload
      if (/\d+\.?\d{0,2}/.test(amount)) {
        showWxLoading()
        try {
          const res = yield wxService.pay.withDraw(parseFloat(amount).toFixed(2), formId)
          hideWxLoading()
          if (res.succ) {
            yield put(action('query'))
            Taro.showModal({
              title: '提现成功',
              content: '预计1-5个工作日内到账',
              showCancel: false,
              confirmText: '确定',
            })
          } else {
            showModal('提现失败')
          }
        } catch (e) {
          hideWxLoading()
          const detail = e.detail
          if (detail === 'exceed.times.limit') {
            showModalWithTitle(
              '提现超过次数',
              '亲，因微信规定提现到零钱每天最多3次哦，请明天再提吧'
            )
          } else if (detail === 'too.frequency') {
            showNotify('提现过于频繁，请1分钟后再试', '#custom-selector')
          } else {
            showModalWithTitle('服务器繁忙', '因太多人使用，开发小哥正加紧处理，请稍后再试哈')
          }
        }
      } else {
        showNotify('金额不正确，请重新输入', '#custom-selector')
      }
    },
  },
  reducers: {},
})
