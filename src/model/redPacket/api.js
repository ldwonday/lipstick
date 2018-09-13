const { NODE_ENV } = process.env
const isDev = NODE_ENV !== 'production'
const apiPrefix = isDev ? `https://kldev.ymmbtw.com/` : 'https://cf.zxxgtw.com/'
export default {
	packet: {
		share: {
			getPacket: pno => `${apiPrefix}packet/share/get${ pno ? `?pno=${pno}` : ''}`,
			extraPacket: type => `${apiPrefix}packet/share/extra?type=${type}`,
			grabPacket: id => `${apiPrefix}packet/grab/${id}`,
			assistPacket: id => `${apiPrefix}packet/assist/${id}`,
		},
		grab: {
			grabList: `${apiPrefix}packet/grab/list`,
		}
	},
}
