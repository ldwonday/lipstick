import Taro from '@tarojs/taro'
import dva from '../dva'
import { getStorageSyncLoginResult } from './index'
import action from './action'
import config from '../config'

const makeOptions = (url, options) => {
  const defaultoptions = {
    url: undefined,
    method: 'GET',
    qs: undefined,
    body: undefined,
    headers: undefined,
    type: 'json',
    contentType: 'application/json',
    crossOrigin: true,
    credentials: undefined,
    customToken: false,
    showFailMsg: true,
    async: false,
  }

  let thisoptions = {}
  if (!options) {
    thisoptions = { url }
  } else {
    thisoptions = options
    if (url) {
      thisoptions.url = url
    }
  }
  thisoptions = Object.assign({}, defaultoptions, thisoptions, { qs: { ...thisoptions.qs, appId: config.appId } })

  return thisoptions
}

const addQs = (url, qs) => {
  let queryString = ''
  let newUrl = url
  if (qs && typeof qs === 'object') {
    /* eslint no-restricted-syntax: 0 */
    for (const k of Object.keys(qs)) {
      queryString += `&${k}=${qs[k]}`
    }
    if (queryString.length > 0) {
      if (url.split('?').length < 2) {
        queryString = queryString.substring(1)
      } else if (url.split('?')[1].length === 0) {
        queryString = queryString.substring(1)
      }
    }

    if (url.indexOf('?') === -1) {
      newUrl = `${url}?${queryString}`
    } else {
      newUrl = `${url}${queryString}`
    }
  }

  return newUrl
}

// 失效重试次数
let invalidTryTimes = 0
let token

const request = (url, options) => {
  const opts = makeOptions(url, options)
  const { method, body, headers, qs, type, contentType } = opts

  let requestUrl = opts.url
  if (qs) requestUrl = addQs(requestUrl, qs)

  let header = headers
  if ((!headers || !headers['content-type']) && contentType) {
    header = Object.assign({}, headers, { 'content-type': contentType })
  }
  if (opts.customToken) {
    if (!token) {
      const res = getStorageSyncLoginResult()
      token = res && res.token
    }
    header = {
      ...header,
      'X-Custom-Token': token,
    }
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: requestUrl,
      method,
      data: body,
      header,
      dataType: type,
    })
      .then(res => {
        let { statusCode, data } = res
        if (
          statusCode < 200 ||
          statusCode >= 300 ||
          (data.code !== 0 && (data.code < 200 || data.code >= 300))
        ) {
          let errors = {
            error: -1,
            request: url,
            errorMessage: '系统异常，请查看response',
            res,
          }
          if (data && typeof data === 'object') {
            errors = Object.assign({}, errors, data)
          }
          if (data.code === 401 && invalidTryTimes < 5 && !opts.async) {
            invalidTryTimes++
            token = null
            dva
              .getDispatch()(action('user/login'))
              .then(_ => {
                resolve(request(url, options))
              })
              .catch(e => {
                reject(e)
              })
          } else {
            console.log('request error ===>', errors)
            reject(errors)
          }
        } else {
          resolve(data)
        }
      })
      .catch(err => {
        console.log('request error ===>', err)
        reject({
          error: -1,
          message: '系统异常，请查看response',
          err,
          request: requestUrl,
        })
      })
  })
}

export default request
