import { wx } from '../../utils'
Component({
	async created() {
		try {
			const { data } = await wx.getStorage({ key: 'showTopAddTip' })
			console.log(2222, data)
			this.setData({
				isShow: data
			})
		} catch (e) {
			this.setData({
				isShow: true
			})
		}
	},
	methods: {
		close () {
			this.setData({
				isShow: false
			})
			wx.setStorage({ key: 'showTopAddTip', data: false })
			this.triggerEvent('onClose')
		},
	}
})
