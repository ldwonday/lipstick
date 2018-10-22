const NODE_ENV = process.env.NODE_ENV

const isDev = NODE_ENV !== 'production'
const apiPrefix = isDev ? `https://distrib.ymmbtw.com/` : 'https://cf.zxxgtw.com/'
const appId = 'wx49821973c5425740'

export default {
  appId,
  kefu: 'cxm19880710',
  api: {
    balance: {
      detail: `${apiPrefix}balance/detail`,
      query: `${apiPrefix}balance`,
    },
    barrage: {
      product: `${apiPrefix}barrage/product`,
      profit: `${apiPrefix}barrage/profit`,
      empty: `${apiPrefix}barrage/empty`,
    },
    order: {
      commit: `${apiPrefix}order/commit`,
      list: `${apiPrefix}order/list`,
      get: orderNo => `${apiPrefix}order/get/${orderNo}`,
    },
    product: {
      query: id => `${apiPrefix}product/info/${id}`,
      list: `${apiPrefix}product/list/${appId}`,
      comment: id => `${apiPrefix}product/comment/${id}`,
    },
    user: {
      address: {
        get: `${apiPrefix}user/address/get`,
        add: `${apiPrefix}user/address/create`,
        update: id => `${apiPrefix}user/address/update/${id}`,
        list: `${apiPrefix}user/address/list`,
        setDefault: id => `${apiPrefix}user/address/default/${id}`,
      },
    },
    wx: {
      pay: {
        withdraw: `${apiPrefix}wx/pay/withdraw`,
        retrieve: orderNo => `${apiPrefix}wx/pay/retrieve/${orderNo}`,
      },
      mp: {
        saveUserInfo: `${apiPrefix}wx/mp/userInfo`,
        login: `${apiPrefix}wx/mp/login`,
        checkStatus: `${apiPrefix}wx/mp/checkStatus`,
      },
    },
    formId: {
      submit: formId => `${apiPrefix}formId/submit/${formId}`,
    },
  },
}
