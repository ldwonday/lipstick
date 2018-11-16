import modelExtend from 'dva-model-extend'
import Taro from '@tarojs/taro'
import action from '../utils/action'
import { model } from './common'
import { wxService } from '../service'
import { setStorageLoginResult, setStorageUserInfo, getStorageShareCode } from '../utils'

const { mp } = wxService

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
      yield call(mp.checkToken)
    },
    *login({ payload }, { call, put }) {
      const { code } = yield Taro.login()
      console.log(code)
      const { data } = yield call(mp.login, code)
      yield setStorageLoginResult(data)
      yield put(action('saveUser'))
    },
    *saveUser({ payload }, { call, put }) {
      try {
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
          const { data } = yield call(mp.saveUser, other, shareCode)
          yield setStorageLoginResult(data)
          console.log('save user ok!!')
        } catch (e) {
          console.log('save user error ===> ', e)
        }
        yield put(action('save', { userInfo }))
      } catch (e) {
        console.log(e)
        console.log('getUserInfo error: not auth')
      }
    },
  },
  reducers: {},
})
