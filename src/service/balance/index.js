/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const { balance } = config.api

export const query = () => {
	return request(balance.query, {
		customToken: true,
	})
}
export const detail = ({ page, size }) => {
	return request(balance.detail, {
		customToken: true,
		qs: {
			pageSize: size,
      pageNum: page,
		},
	})
}

