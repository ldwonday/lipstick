import { connect } from '@tarojs/redux'
import { View, Image, Text, Button, OpenData } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import config from '../../config'
import './index.scss'

@connect(({ app, user }) => ({
  app,
  user,
}))
class TopBar extends Component {
  getUserInfo(e) {
    Taro.getApp().byGetUserInfo(e, () => {
      this.goCash()
    })
  }
  goCash() {
    Taro.navigateTo({
      url: '/pages/cash/index',
    })
  }
  render() {
    const { app: { userInfo }, user: { balance } } = this.props
    return (
      <View className="user">
        {userInfo && (
          <Button className="custom" onClick={this.goCash.bind(this)}>
            <OpenData type="userAvatarUrl" />
            <Text>
              余额：{balance.toFixed(3) || 0}
            </Text>
          </Button>
        )}
        {!userInfo && (
          <Button
            openType="getUserInfo"
            onGetUserInfo={this.getUserInfo.bind(this)}
            className="custom"
          >
            <OpenData type="userAvatarUrl" />
            <Text>
              余额：{balance.toFixed(3) || 0}
            </Text>
          </Button>
        )}
      </View>
    )
  }
}

TopBar.defaultProps = {
  title: config.appName,
  balance: 0,
}

export default TopBar
