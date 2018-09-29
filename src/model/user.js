import modelExtend from 'dva-model-extend'
import Taro from '@tarojs/taro'
import action from '../utils/action'
import { model } from './common'
import { userLogin, saveUser, checkToken } from '../service'
import { setStorageLoginResult, setStorageUserInfo } from '../utils'

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
    },
    *login({ payload }, { call, put }) {
      const { code } = yield Taro.login()
      const { data } = yield call(userLogin, code)
      yield setStorageLoginResult(data)
    },
    *saveUser({ payload }, { call, put }) {
      try {
        const res = yield Taro.getUserInfo({ withCredentials: true })
        const { errMsg, ...other } = res
        const userInfo = res.userInfo
        yield setStorageUserInfo(userInfo)

        try {
          yield call(saveUser, other)
          console.log('save user ok!!')
        } catch (e) {
          console.log('save user error ===> ', e)
        }
        yield put(action('save', { userInfo }))
      } catch (e) {
        console.log('getUserInfo error: not auth')
      }
    },
  },
  reducers: {},
})
