const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV !== 'production';
const apiPrefix = isDev ? `https://kldev.ymmbtw.com/` : 'https://cf.zxxgtw.com/';
const appId = 'wxdd3dd685e5349a39';

export default {
  appId,
  kefu: 'cxm19880710',
  help_address: '',
  ios_announcement: '',
  api: {
    balance: {
      detail: `${apiPrefix}balance/detail`,
      query: `${apiPrefix}balance`
    },
    barrage: {
      product: `${apiPrefix}barrage/product`,
      profit: `${apiPrefix}barrage/profit`,
      empty: `${apiPrefix}barrage/empty`
    },
    order: {
      commit: `${apiPrefix}order/commit`,
      lipstickCommit: `${apiPrefix}order/lipstick/commit`,
      list: `${apiPrefix}order/list`,
      get: orderNo => `${apiPrefix}order/get/${orderNo}`
    },
    product: {
      query: id => `${apiPrefix}product/info/${id}`,
      list: `${apiPrefix}product/list/${appId}`,
      comment: id => `${apiPrefix}product/comment/${id}`
    },
    user: {
      address: {
        get: `${apiPrefix}user/address/get`,
        add: `${apiPrefix}user/address/create`,
        update: id => `${apiPrefix}user/address/update/${id}`,
        list: `${apiPrefix}user/address/list`,
        setDefault: id => `${apiPrefix}user/address/default/${id}`
      }
    },
    lipstick: {
      bindAddress: `${apiPrefix}lipstick/bindAddress`,
      challenge: `${apiPrefix}lipstick/challenge`,
      gameFinish: `${apiPrefix}lipstick/gameFinish`,
      gameStart: `${apiPrefix}lipstick/gameStart`,
      getReward: `${apiPrefix}lipstick/getReward`,
      my: `${apiPrefix}lipstick/my`,
      prize: `${apiPrefix}lipstick/prize`,
      prizeDetail: orderNo => `${apiPrefix}lipstick/prize/${orderNo}`,
      productList: `${apiPrefix}lipstick/product/list`,
      shareList: `${apiPrefix}lipstick/shareList`
    },
    wx: {
      pay: {
        withdraw: `${apiPrefix}wx/pay/withdraw`,
        retrieve: orderNo => `${apiPrefix}wx/pay/retrieve/${orderNo}`
      },
      mp: {
        saveUserInfo: `${apiPrefix}wx/mp/userInfo`,
        login: `${apiPrefix}wx/mp/login`,
        checkStatus: `${apiPrefix}wx/mp/checkStatus`
      }
    },
    formId: {
      submit: formId => `${apiPrefix}formId/submit/${formId}`
    }
  }
};