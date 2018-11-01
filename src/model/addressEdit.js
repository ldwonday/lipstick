import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { userService } from '../service'
import { showTextToast } from '../utils'
import { model } from './common'

const { address } = userService

export default modelExtend(model, {
  namespace: 'addressEdit',
  state: {},
  effects: {
    *init({ payload }, { put }) {},

    *addOrUpdate({ payload }, { call, put }) {
      const { detail, confirm } = payload
      const { id, name, phone, province, city } = detail
      if (!name) {
        showTextToast('请输入联系人的姓名')
        return
      }
      if (!phone) {
        showTextToast('请输入联系人的手机号码')
        return
      }
      if (!province || !city) {
        showTextToast('请选择联系人所在的省市区')
        return
      }
      if (!detail.address) {
        showTextToast('请输入联系人的详细地址')
        return
      }
      yield call(id ? address.update : address.add, detail)
      if (confirm) {
        yield put(action('orderConfirm/getAddress'))
      } else {
        yield put(action('address/list'))
        Taro.showToast({
          title: '保存成功',
        })
      }
      Taro.navigateBack()
    },
  },
  reducers: {},
})
