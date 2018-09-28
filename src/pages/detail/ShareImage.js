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
      src: 'https://klimg.pptmbt.com/pub/fz/free-get.png',
    })
    this.freeGetIamge = res.path
    return Taro.getImageInfo({
      src: imageUrl,
    })
  }
  create(src, imgW, imgH, cb) {
    let canvasW = 640
    let canvasH = imgH

    if (imgW / imgH > 5 / 4) {
      canvasW = (imgH * 5) / 4
    }

    this.ctx.drawImage(src, (imgW - canvasW) / 2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH)
    if (this.freeGetIamge) {
      this.ctx.drawImage(this.freeGetIamge, canvasW / 2 - 130, 260, 240, 56)
    }
    this.ctx.draw(false, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          width: canvasW,
          height: canvasH,
          destWidth: canvasW,
          destHeight: canvasH,
          canvasId: 'canvas',
          fileType: 'jpg',
          success: res => {
            typeof cb === 'function' && cb(res.tempFilePath)
          },
        })
      }, 500)
    })
  }
}
