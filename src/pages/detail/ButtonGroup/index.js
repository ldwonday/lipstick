import { View, Button, Text, Form } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../../utils/CommonBehavior'

import './index.scss'

export default class extends PureComponent {
  static behaviors = [Behaviors]
  static defaultProps = {
    data: {
      price: 0,
    },
  }

  handleClick(type) {
    const { onBuy, onCollect } = this.props
    type === '1' && onBuy(this.formId)
    type === '2' && onCollect(this.formId)
  }

  handleGetUserInfo(e) {
    const { type } = e.currentTarget.dataset
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
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
  render() {
    const {
      isAuthorize,
      data: { price },
      onShare,
    } = this.props

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
        <View className="call">集赞免费领</View>
        <View className="bottom-tip">限时活动</View>
      </View>
    )
    return (
      <View className="btn-group">
        <Form className="form" onSubmit={this.formSubmit.bind(this)} reportSubmit>
          {isAuthorize && (
            <block>
              <Button className="custom buy" dataType="1" formType="submit">
                {buyText}
              </Button>
              <Button className="custom share" dataType="2" formType="submit">
                {shareText}
              </Button>
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
