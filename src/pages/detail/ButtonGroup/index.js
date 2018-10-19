import { View, Button, Text, Form, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../../utils/CommonBehavior'
import HomeImage from '../../../asset/images/btn-home-default.png'

import './index.scss'

export default class extends PureComponent {
  static behaviors = [Behaviors]
  static defaultProps = {
    data: {
      price: 0,
    },
  }

  handleClick(type) {
    this.props.onBuy(type)
  }

  handleGetUserInfo(e) {
    const { type } = e.currentTarget.dataset
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
      if (type === '2' && this.props.currentShareTimes < this.props.data.needShareTimes) {
        return
      }
      this.handleClick(type)
    })
  }
  formSubmit(e) {
    this.formId = e.detail.formId
    const { type } = e.detail.target.dataset
    const { isAuthorize } = this.props
    if (isAuthorize) {
      this.handleClick(type)
    }
  }
  handleGoHome() {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  }
  render() {
    const {
      isAuthorize,
      currentShareTimes,
      data: { price, sharedPrice, needShareTimes },
      onShare,
    } = this.props

    console.log(currentShareTimes)

    const buyText = (
      <View className="inner">
        <View className="price">
          <Text className="unit">￥</Text>
          {price && price.toFixed(2)}
        </View>
        <View className="bottom-tip">立即购买</View>
      </View>
    )

    const shareText = (
      <View className="inner">
        <View className="price">
          <Text className="unit">￥</Text>
          {sharedPrice && sharedPrice.toFixed(2)}
        </View>
        <View className="bottom-tip">好友助力价 {currentShareTimes}/{needShareTimes}</View>
      </View>
    )
    return (
      <View className="btn-group">
        <Form className="form" onSubmit={this.formSubmit.bind(this)} reportSubmit>
          <Button className="custom home" onClick={this.handleGoHome.bind(this)}>
            <Image src={HomeImage} />
            <View>回首页</View>
          </Button>
          {isAuthorize && (
            <block>
              <Button className="custom buy" dataType="1" formType="submit">
                {buyText}
              </Button>
              {currentShareTimes < needShareTimes && (
                <Button className="custom share" dataType="2" openType="share">
                  {shareText}
                </Button>
              )}
              {currentShareTimes === needShareTimes && (
                <Button className="custom share" dataType="2" formType="submit">
                  {shareText}
                </Button>
              )}
            </block>
          )}
          {!isAuthorize && (
            <block>
              <Button
                className="custom buy"
                openType="getUserInfo"
                dataType="1"
                formType="submit"
                onGetUserInfo={this.handleGetUserInfo.bind(this)}
              >
                {buyText}
              </Button>
              <Button
                className="custom share"
                openType="getUserInfo"
                dataType="2"
                onGetUserInfo={this.handleGetUserInfo.bind(this)}
              >
                {shareText}
              </Button>
            </block>
          )}
        </Form>
      </View>
    )
  }
}
