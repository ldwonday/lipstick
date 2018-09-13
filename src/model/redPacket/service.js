import config from '../../config'
import api from './api'
import request from '../../utils/request'

const { getPacket, assistPacket, extraPacket, grabPacket } = api.packet.share
const { grabList } = api.packet.grab
const baseQs = {
	qs: {
		appId: config.appId,
	}
}

export const packetGet = async (pno) => {
	return request(getPacket(pno), {
		customToken: true,
		showFailMsg: true,
		...baseQs,
	})
}

export const packetExtra = async (id) => {
	return request(extraPacket(id), {
		customToken: true,
		showFailMsg: true,
		...baseQs,
	})
}

export const packetGrab = async (id) => {
	return request(grabPacket(id), {
		customToken: true,
		showFailMsg: true,
		...baseQs,
	})
}

export const packetAssist = async (packetNo) => {
	return request(assistPacket(packetNo), {
		customToken: true,
		showFailMsg: false,
		...baseQs,
	})
}

export const packetGrabList = async (pageNum, pageSize = 10) => {
	return request(grabList, {
		customToken: true,
		showFailMsg: false,
		qs: {
			...baseQs.qs,
			pageNum,
			pageSize
		},
	})
}


