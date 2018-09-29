import { View, Button, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { TopBlurHead, Iconfont } from '../../components'
import bgImage from '../../asset/images/step@2x.png'
import config from '../../config'
import './index.scss'

export default class extends PureComponent {
  async handleCopy() {
    await Taro.setClipboardData({
      data: config.kefu,
    })
    Taro.showToast({ title: '复制成功' })
  }
  render() {
    return (
      <View className="pay-success">
        <TopBlurHead imageUrl={this.$router.params.imageUrl}>
          <View className="head">
            <View className="left">
              <Iconfont type="ic_check" size={72} color="#fff" />
            </View>
            <View className="right">
              <View className="title">付款成功！</View>
              <View className="desc">
                为了给你更好的服务，请添加下方微信，我们客服人员会和你核对地址后发货
              </View>
            </View>
          </View>
          <View className="card">
            <Image src={bgImage} className="bg" />
            <View className="wx-code">
              微信号：
              {config.kefu}
            </View>
            <View className="btn-group">
              <Button className="custom" onClick={this.handleCopy.bind(this)}>
                一键复制
              </Button>
            </View>
          </View>
        </TopBlurHead>
      </View>
    )
  }
}
