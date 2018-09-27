import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../utils/CommonBehavior'
import Head from './Head'
import MenuItem from './MenuItem'
import './index.scss'

@connect(({ user }) => ({
  user,
}))
export default class extends PureComponent {
  static behaviors = [Behaviors]
  handleGetUserInfo(e) {
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
      Taro.navigateTo({ url: '/pages/mine/order/index' })
    })
  }
  render() {
    const {
      user: { userInfo },
    } = this.props

    return (
      <View className="mine">
        <Head userInfo={userInfo} />
        <View className="line" />
        {userInfo ? (
          <MenuItem icon="ic_like" to="/pages/mine/order/index" name="我发起的订单" />
        ) : (
          <Button
            openType="getUserInfo"
            onGetUserInfo={this.handleGetUserInfo.bind(this)}
            className="custom kefu"
          >
            <MenuItem icon="ic_like" name="我发起的订单" />
          </Button>
        )}
        <View className="line" />
        <Button openType="contact" className="custom kefu">
          <MenuItem icon="kefu" name="客服" />
        </Button>
        <View className="line" />
      </View>
    )
  }
}
