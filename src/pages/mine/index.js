import { View, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../utils/CommonBehavior'
import { Iconfont } from '../../components'
import MenuItem from './MenuItem'
import iconContact from '../../asset/images/img-mine-contact.png'
import iconIncome from '../../asset/images/img-mine-income.png'
import iconMyProduct from '../../asset/images/img-mine-various.png'
import './index.scss'

@connect(({ user }) => ({
  user,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '我的',
  }
  static behaviors = [Behaviors]
  handleGetUserInfo(e) {
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
      Taro.navigateTo({ url: '/pages/mine/order/index' })
    })
  }
  handleGoOrder() {
    Taro.navigateTo({
      url: '/pages/mine/order/index',
    })
  }
  handleGoAddress() {
    Taro.navigateTo({
      url: '/pages/mine/address/index',
    })
  }
  render() {
    const {
      user: { userInfo },
    } = this.props

    return (
      <View className="mine">
        <View className="top-my" hover-class="hover" onClick={this.handleGoAddress}>
          <View className="left">
            <Image src={userInfo.avatarUrl} />
          </View>
          <View className="right">
            <View className="name">{userInfo.nickName}</View>
            <View className="address">
              收货地址
              <Iconfont type="previewright" size={26} color="#c7c7cc" />
            </View>
          </View>
        </View>
        <View className="center-my-product" hover-class="hover" onClick={this.handleGoOrder}>
          <View className="left">
            <Image src={iconMyProduct} />
          </View>
          <View className="right">
            <View className="name">我购买的商品</View>
            <View className="address">
              <Iconfont type="previewright" size={26} color="#c7c7cc" />
            </View>
          </View>
        </View>
        <View className="bottom-list">
          {userInfo ? (
            <MenuItem icon={iconIncome} name="我的收益" to="/pages/mine/profit/index" />
          ) : (
            <Button
              openType="getUserInfo"
              onGetUserInfo={this.handleGetUserInfo.bind(this)}
              className="custom kefu"
            >
              <MenuItem icon={iconIncome} name="我的收益" to="/pages/mine/profit/index" />
            </Button>
          )}
          <View className="line1px" />
          <Button openType="contact" className="custom kefu">
            <MenuItem icon={iconContact} name="联系客服" />
          </Button>
        </View>
      </View>
    )
  }
}
