import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import { model } from './common'
import action from '../utils/action'
import { userLogin, saveUser, checkToken, submitForm } from '../service'
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
    isShowTopAddTip: true,
  },
  reducers: {
    loginSuccess(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      try {
        yield put.resolve(action('saveUser'))
      } catch (e) {
        console.log(e)
      }
      try {
        const { data } = yield Taro.getStorage({ key: 'showTopAddTip' })
        yield put(action('save', { isShowTopAddTip: data }))
      } catch (e) {
        yield put(action('save', { isShowTopAddTip: true }))
      }
    },
    *closeAddTopTip({ payload }, { call, put }) {
      yield Taro.setStorage({ key: 'showTopAddTip', data: false })
      yield put(action('save', { isShowTopAddTip: false }))
    },
    *checkToken({ payload }, { call, put }) {
      try {
        const isOk = yield call(checkToken)
        if (!isOk) {
          yield put.resolve(action('login'))
        }
      } catch (e) {
        console.log('checkToken request error ===>', e)
        yield put.resolve(action('login'))
      }
    },
    *submitForm({ payload }, { call, put }) {
      yield call(submitForm, payload)
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
      try {
        const { data } = yield call(saveUser, other, shareCode)
        console.log('save user ok!!')
      } catch (e) {
        console.log('save user error ===> ', e)
      }
      yield put(action('save', { userInfo }))
    },
  },
})
