import modelExtend from 'dva-model-extend'
import Taro from '@tarojs/taro'
import action from '../utils/action'
import { model } from './common'
import { userLogin, saveUser, checkToken, submitForm } from '../service'
import { setStorageLoginResult, setStorageUserInfo, getStorageShareCode } from '../utils'

export default modelExtend(model, {
  namespace: 'user',
  state: {
    userInfo: null,
  },
  effects: {
    *init({ payload }, { call, put }) {
      try {
        yield put(action('saveUser'))
      } catch (e) {
        console.log(e)
      }
    },
    *checkToken({ payload }, { call, put }) {
      yield call(checkToken)
      /*try {
        const isOk = yield call(checkToken)
        if (!isOk) {
          yield put.resolve(action('login'))
        }
      } catch (e) {
        console.log('checkToken request error ===>', e)
        yield put.resolve(action('login'))
      }*/
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
      const setting = yield Taro.getSetting()
      if (setting.authSetting['scope.userInfo']) {
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
      }
    },
  },
  reducers: {},
})
