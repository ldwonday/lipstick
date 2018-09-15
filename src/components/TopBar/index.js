import { connect } from '@tarojs/redux'
import { View, Image, Text, Button, OpenData } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { getNavHeight } from '../../utils'
import config from '../../config'
import './index.scss'

@connect(({ app }) => ({
  userInfo: app.userInfo,
}))
class TopBar extends Component {
  componentDidMount = async () => {
    const { startBarHeight, navigationHeight } = await getNavHeight()
    this.setState({
      startBarHeight,
      navigationHeight,
    })
  }
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
  goBack() {
    Taro.navigateBack({ delta: 1 })
  }
  render() {
    const { startBarHeight, navigationHeight } = this.state
    const { isShowBack, userInfo, title, balance } = this.props
    return (
      <View className="navigation" style={{ height: (startBarHeight + navigationHeight) + 'px' }}>
        <View className="startBar" style={{ height: startBarHeight + 'px' }} />
        <View className="navgation" style={{ height: navigationHeight + 'px' }}>
          {isShowBack && (
            <block>
              <View className="back" onClick={this.goBack.bind(this)}>
                <Image src="../../asset/images/back.png" />
              </View>
              <View className="title left">{title}</View>
            </block>
          )}
          {!isShowBack && (
            <block>
              {userInfo && (
                <Button className="custom top-cash" onClick={this.goCash.bind(this)}>
                  <OpenData type="userAvatarUrl" />
                  <Text>
                    余额：
                    {balance || 0}
                  </Text>
                </Button>
              )}
              {!userInfo && (
                <Button
                  openType="getUserInfo"
                  onGetUserInfo={this.getUserInfo.bind(this)}
                  className="custom top-cash"
                >
                  <OpenData type="userAvatarUrl" />
                  <Text>
                    余额：
                    {balance || 0}
                  </Text>
                </Button>
              )}
              <View className="title">{title}</View>
            </block>
          )}
        </View>
      </View>
    )
  }
}

TopBar.defaultProps = {
  title: config.appName,
  balance: 0,
}

export default TopBar
