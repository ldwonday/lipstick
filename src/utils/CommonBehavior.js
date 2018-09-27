import action from './action'
import dvaApp from '../dva'
import {
  getStorageSynctUserInfo,
  getStorageSyncLoginResult,
} from './index'

const behavior = {
  methods: {
    saveUserInfo: (userInfo, cb) => {
      if (userInfo) {
        dvaApp
          .getDispatch()(action('user/saveUser'))
          .then(_ => {
            cb && cb()
          })
      }
    },
    shareMessage: cb => {
      let title = ''
      const userInfo = getStorageSynctUserInfo()
      if (userInfo && userInfo.nickName) {
        title = `${userInfo.nickName || ''}@你，点开看点开看↓↓↓`
      } else {
        title = '@所有人，点开看点开看↓↓↓'
      }

      const loginResult = getStorageSyncLoginResult()
      const path = `/pages/index/index${
        loginResult && loginResult.shareCode ? `?shareCode=${loginResult.shareCode}` : ''
      }`

      return {
        title,
        path,
        success: cb || (() => {}),
      }
    },
  },
}

export default Behavior(behavior)
