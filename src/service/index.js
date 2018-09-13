/* eslint-disable prettier/prettier */
import config from '../config'
import request from '../utils/request'
import { setStorageProduct, getStorageProduct } from '../utils'

const { product, barrage, login, balance, checkStatus, saveUserInfo, order, code, retrieve, pay } = config.api
const baseQs = {
	qs: {
		appId: config.appId,
	}
}
export const queryProduct = async (isNet = false) => {
	let result
	const queryProduct = async () => {
		const res = await request(product.query, baseQs)
		setStorageProduct(res)
		return res
	}
	if (!isNet) {
		try {
			const res = await getStorageProduct()
			result = res.data
		} catch (e) {
			result = queryProduct()
		}
	} else {
		result = queryProduct()
	}

	return result
}
export const queryConfigCheck = () => {
	return request(config.api.config.check, { customToken: true, })
}
export const queryConfig = () => {
	return request(config.api.config.init)
}
export const queryProductComment = ({ pageSize, pageNum, productId }) => {
	return request(product.comment, {
		qs: {
			...baseQs.qs,
			productId,
			pageNum,
			pageSize
		},
	})
}
export const queryProductBarrage = (productId) => {
	return request(barrage.product, {
		qs: {
			...baseQs.qs,
			productId
		},
	})
}
export const queryProfitBarrage = (productId) => {
	return request(barrage.profit, {
		qs: {
			...baseQs.qs,
			productId
		},
	})
}
export const commitOrder = async (buyType, productId, formId, shareCode) => {
	return request(order.commit, {
		method: 'POST',
		showFailMsg: false,
		customToken: true,
		...baseQs,
		contentType: 'application/json',
		body: {
			buyType,
			productId,
			formId,
			shareCode,
		}
	})
}
export const userLogin = (jsCode) => {
	return request(login, {
		qs: {
			...baseQs.qs,
			jsCode
		},
	})
}
export const saveUser = async (userInfo, shareCode = '') => {
	return request(saveUserInfo, {
		method: 'POST',
		customToken: true,
		qs: {
			...baseQs.qs,
			shareCode
		},
		contentType: 'application/json',
		body: userInfo
	})
}
export const getCode = async (orderNo) => {
	return request(code.query(orderNo), {
		customToken: true,
		showFailMsg: false,
		...baseQs,
	})
}
export const retrieveOrder = async (orderNo) => {
	return request(retrieve(orderNo), {
		customToken: true,
		...baseQs,
	})
}
export const queryBalance = async (productId = '') => {
	return request(balance.query, {
		customToken: true,
		qs: {
			...baseQs.qs,
			productId
		},
	})
}
export const checkToken = async () => {
  const { code } = await request(checkStatus, {
    customToken: true,
    qs: {
      ...baseQs.qs,
    },
  })
  return Promise.resolve(code === 200)
}
export const queryBalanceDetail = async (params) => {
	return request(balance.detail, {
		customToken: true,
		qs: {
			...baseQs.qs,
			...params
		},
	})
}
export const withDraw = async ({ amount, formId }) => {
	return request(pay.withdraw, {
		method: 'POST',
		customToken: true,
		showFailMsg: false,
		...baseQs,
		contentType: 'application/json',
		body: {
			amount,
			formId
		},
	})
}
/*export const queryByIds = (ids) => {
	return request(article.queryByIds, {
		qs: {
			ids,
		}
	})
}*/

