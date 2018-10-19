/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const { product } = config.api

export const list = ({ size, page }) => {
  return request(product.list, {
    customToken: true,
    qs: {
      page,
      size,
    },
  })
}
export const comments = ({ size, page, id }) => {
  return request(product.comment(id), {
    qs: {
      pageNum: page,
      pageSize: size,
    },
  })
}
export const query = (id) => {
  return request(product.query(id), {
    customToken: true,
  })
}

