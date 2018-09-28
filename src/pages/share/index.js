import { View, Image, Button, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import config from '../../config'
import { roundRect, circleImg } from '../../utils/canvas'
import { hideWxLoading, showWxLoading } from '../../utils'
import { AvatarTip, CardContainer } from '../../components'
import './index.scss'

@connect(({ call, user }) => ({
  call,
  user,
}))
export default class extends PureComponent {
  mainImage = ''
  qcodeImage = ''
  avatarImage = ''
  shareWidth = 690
  shareHeight = 980
  componentDidMount = async () => {
    this.ctx = Taro.createCanvasContext('canvas', this.$scope)
  }
  async handleSave() {
    if (this.shareImage) {
      await this.saveImage()
      return
    }
    showWxLoading()
    const {
      call: { info },
      user: { userInfo },
    } = this.props

    const mainRes = await Taro.getImageInfo({
      src: info.mainImageUrl,
    })
    this.mainImage = mainRes.path

    const qcodeRes = await Taro.getImageInfo({
      src: `https://klqrcode.pptmbt.com/${config.appId}/${info.recordNo}.jpeg`,
    })
    this.qcodeImage = qcodeRes.path

    const avatarRes = await Taro.getImageInfo({
      src: userInfo.avatarUrl,
    })
    this.avatarImage = avatarRes.path

    this.drawShareImage(() => {
      setTimeout(async () => {
        const res = await Taro.canvasToTempFilePath({
          x: 0,
          y: 0,
          destWidth: this.shareWidth,
          destHeight: this.shareHeight,
          quality: 0.4,
          canvasId: 'canvas',
        })
        this.shareImage = res.tempFilePath
        await this.checkAuthAndSave()
      }, 500)
    })
  }
  drawShareImage(cb) {
    const ctx = this.ctx

    roundRect(ctx, 0, 0, this.shareWidth, this.shareHeight, 20, 'white')
    // 剪切
    ctx.clip()
    ctx.drawImage(this.mainImage, this.shareWidth / 2 - 240, 25, 480, 480)
    ctx.restore()
    roundRect(ctx, 30, 535, 630, 72, 36, '#F5F5F5')
    ctx.clip()
    ctx.restore()
    circleImg(ctx, this.avatarImage, 30, 535, 36)
    // 作者名称
    ctx.setTextAlign('center')
    ctx.setFillStyle('#000000')
    ctx.setFontSize(26)
    ctx.fillText('还差你的赞我就可以免费领商品啦～', this.shareWidth / 2, 558 + 20)

    ctx.drawImage(this.qcodeImage, this.shareWidth / 2 - 120, 648, 240, 240)

    // 作者名称
    ctx.setTextAlign('center')
    ctx.setFillStyle('#9A9A9A')
    ctx.setFontSize(22)
    ctx.fillText('长按识别小程序，帮我点赞吧', this.shareWidth / 2, 928 + 22)

    ctx.draw(false, cb)
  }
  async checkAuthAndSave() {
    try {
      await Taro.authorize({ scope: 'scope.writePhotosAlbum' })
      hideWxLoading()
      await this.saveImage()
    } catch (e) {
      hideWxLoading()
      Taro.showModal({
        title: '温馨提示',
        content: '要允许【保存到相册】才能保存图片哦',
        showCancel: false,
        confirmText: '好哒',
        success: modalRes => {
          if (modalRes.confirm) {
            Taro.openSetting({
              success: async res => {
                res.authSetting['scope.writePhotosAlbum']
                  ? this.saveImage()
                  : this.checkAuthAndSave()
              },
            })
          }
        },
      })
    }
  }
  async saveImage() {
    try {
      await Taro.saveImageToPhotosAlbum({ filePath: this.shareImage })
      const modalRes = await Taro.showModal({
        content: '保存成功,长按图片就可以分享啦！',
        showCancel: false,
        confirmText: '好哒',
      })
      if (modalRes.confirm) {
        Taro.previewImage({
          current: this.shareImage, // 当前显示图片的http链接
          urls: [this.shareImage], // 需要预览的图片http链接列表
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  onShareAppMessage = e => {
    return {
      title: config.appName,
      path: `/pages/index/index`,
    }
  }
  render() {
    const {
      call: { info },
      user: { userInfo },
    } = this.props

    return (
      <View className="bg">
        <CardContainer>
          <View className="main-bg">
            <Image src={info.mainImageUrl} />
          </View>
          <AvatarTip avatarUrl={userInfo.avatarUrl}>
            <View className="tip">还差你的赞我就可以免费领商品啦～</View>
          </AvatarTip>
          <View className="bottom-qcode">
            {info.recordNo && (
              <Image src={`https://klqrcode.pptmbt.com/${config.appId}/${info.recordNo}.jpeg`} />
            )}
            <View className="tip">长按识别小程序，帮我点赞吧</View>
          </View>
        </CardContainer>
        <View className="bottom-save">
          <Button onClick={this.handleSave.bind(this)}>保存图片</Button>
          <View className="tip">保存图片并分享到朋友圈，让好友为你点赞吧</View>
        </View>
        <Canvas canvasId="canvas" style={{ width: `${this.shareWidth}px`, height: `${this.shareHeight}px` }} />
      </View>
    )
  }
}
