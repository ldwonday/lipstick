import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import { model } from './common'
import action from '../utils/action'
import { userLogin, saveUser, checkToken } from '../service'
import {
  setStorageLoginResult,
  setStorageUserInfo,
  getStorageShareCode,
  getStoragetUserInfo,
  getNavHeight,
} from '../utils'

export default modelExtend(model, {
  namespace: 'app',
  state: {
    userInfo: null,
    startBarHeight: 0,
    navigationHeight: 0,
  },
  reducers: {
    loginSuccess(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      try {
        const { data } = yield getStoragetUserInfo()
        yield put(action('save', { userInfo: data }))
      } catch (e) {
        console.log(e)
      }
    },
    *checkToken({ payload }, { call, put }) {
      const isOk = yield call(checkToken)
      if (!isOk) {
        yield put.resolve(action('login'))
      }
    },
    *login({ payload }, { call, put }) {
      const { code } = yield Taro.login()
      const { data } = yield call(userLogin, code)
      yield setStorageLoginResult(data)
    },
    *saveUser({ payload }, { call, put }) {
      const res = yield Taro.getUserInfo({ withCredentials: true })
      const { errMsg, ...other } = res
      const userInfo = res.userInfo
      yield setStorageUserInfo(userInfo)

      let shareCode = ''
      try {
        const data = yield getStorageShareCode()
        console.log('getStorageShareCode ===>', data)
        shareCode = data.data
      } catch (e) {
        console.log('getStorageShareCode ===>', e)
      }
      const { data } = yield call(saveUser, other, shareCode)
      yield put(action('save', { userInfo }))
    },
  },
})
