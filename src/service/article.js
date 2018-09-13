import config from '../config'
import request from '../utils/request'
import { setStoragePages } from '../utils'

const { article } = config.api

export const queryList = ({ page = 0 }) => {
  return request(article.list, {
    qs: {
      page,
    },
  })
}
export const queryPages = async () => {
  const res = await request(article.pages)
  setStoragePages((res && res.data) || [])
  return res
}
export const query = (id) => {
  return request(article.query(id))
}
export const queryByIds = (ids) => {
  return request(article.queryByIds, {
    qs: {
      ids,
    },
  })
}
