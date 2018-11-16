/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const { order } = config.api

export const commit = (params) => {
	return request(order.commit, {
		method: 'POST',
		customToken: true,
		contentType: 'application/json',
		body: {
      ...params,
		}
	})
}
export const lipstickCommit = (params) => {
  return request(order.lipstickCommit, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params,
    }
  })
}
export const list = () => {
	return request(order.list, {
    customToken: true,
  })
}
export const get = (orderNo) => {
  return request(order.get(orderNo), {
    customToken: true,
  })
}

