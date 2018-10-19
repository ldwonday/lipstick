/* eslint-disable prettier/prettier */
import config from '../../../config'
import request from '../../../utils/request'

const { wx: { mp } } = config.api

export const login = (jsCode) => {
  return request(mp.login, {
    qs: {
      jsCode
    },
  })
}
export const saveUser = (userInfo, shareCode = '', async = true) => {
  return request(mp.saveUserInfo, {
    method: 'POST',
    customToken: true,
    async,
    qs: {
      shareCode,
    },
    contentType: 'application/json',
    body: userInfo
  })
}
export const checkToken = async () => {
  const { code } = await request(mp.checkStatus, {
    customToken: true,
  })
  return Promise.resolve(code === 200)
}
