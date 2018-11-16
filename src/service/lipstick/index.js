/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const { lipstick } = config.api

export const productList = (shareCode) => {
  return request(lipstick.productList, {
    customToken: true,
    qs: shareCode ? {
      shareCode,
    } : {},
  })
}
export const bindAddress = (params) => {
  return request(lipstick.bindAddress, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params,
    }
  })
}
export const challenge = (productId) => {
  return request(lipstick.challenge, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      productId,
    }
  })
}
export const gameFinish = (params) => {
  return request(lipstick.gameFinish, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params,
    }
  })
}
export const gameStart = (params) => {
  return request(lipstick.gameStart, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params,
    }
  })
}
export const getReward = (recordId) => {
  return request(lipstick.getReward, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      recordId,
    }
  })
}
export const my = () => {
  return request(lipstick.my, {
    customToken: true,
  })
}
export const prize = ({ size, page }) => {
  return request(lipstick.prize, {
    customToken: true,
    qs: {
      page,
      size,
    },
  })
}
export const prizeDetail = (orderNo) => {
  return request(lipstick.prizeDetail(orderNo), {
    customToken: true,
  })
}
export const shareList = () => {
  return request(lipstick.shareList, {
    customToken: true,
  })
}

