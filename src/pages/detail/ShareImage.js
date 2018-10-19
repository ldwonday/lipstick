/* global ZF_IMAGE */
import Taro, { PureComponent } from '@tarojs/taro'

export default class extends PureComponent {
  shareImage = null
  isCreate = false
  componentWillReceiveProps = nextProps => {
    const imageUrl = nextProps.info.mainImageUrl
    if (imageUrl) {
      console.log(imageUrl)
      this.createShareImage(imageUrl)
    }
  }
  componentDidShow = () => {
    this.createShareImage()
  }
  createShareImage(imageUrl) {
    if (!this.shareImage && !this.isCreate) {
      const image = imageUrl || this.props.info.mainImageUrl
      if (image) {
        this.isCreate = true
        this.getShareImage(image).then(res => {
          this.create(res.path, res.width, res.height, img => {
            console.log(img)
            this.isCreate = false
            this.shareImage = img
          })
        })
      }
    }
  }
  async getShareImage(imageUrl) {
    const res = await Taro.getImageInfo({
      src: ZF_IMAGE + 'free-get2.png',
    })
    this.freeGetIamge = res.path
    let result
    try {
      const end = imageUrl.substring(imageUrl.lastIndexOf('.'), imageUrl.length)
      const start = imageUrl.substring(0, imageUrl.lastIndexOf('.'))
      const src = `${start}-share${end}`
      result = await Taro.getImageInfo({
        src,
      })
      if (result.type === 'unknown' || result.height === -1) {
        throw new Error('file not exist')
      }
    } catch (e) {
      result = await Taro.getImageInfo({
        src: imageUrl,
      })
    }
    return result
  }
  create(src, imgW, imgH, cb) {
    let canvasW = 640
    let canvasH = imgH

    if (imgW / imgH > 5 / 4) {
      canvasW = (imgH * 5) / 4
    }

    console.log(canvasW, imgH, canvasW * 0.525)

    this.ctx.drawImage(src, (imgW - canvasW) / 2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH)
    if (this.freeGetIamge) {
      this.ctx.drawImage(this.freeGetIamge, (canvasW - 750) / 2, 336, 750, 76)
    }
    this.ctx.draw(false, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          width: canvasW,
          height: canvasH,
          destWidth: canvasW * 2,
          destHeight: canvasH * 2,
          canvasId: 'canvas',
          fileType: 'jpg',
          quality: 1,
          success: res => {
            typeof cb === 'function' && cb(res.tempFilePath)
          },
        })
      }, 500)
    })
  }
}
