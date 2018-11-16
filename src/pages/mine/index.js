import { View, Button, Image, Form, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../utils/CommonBehavior'
import pageWithData from '../../common/PageWithData'
import { formatCoin, isAndroid } from '../../utils'
import action from '../../utils/action'
import { Loading, ModalShare } from '../../components'
import defaultAvatar from '../../asset/images/default_avatar.png'
import './index.scss'

@pageWithData('mine')
@connect(({ app, mine, user, home }) => ({
  ...app,
  ...mine,
  ...user,
  configViews: home.configViews,
}))
export default class extends PureComponent {
  state = {
    showDialogShare: false,
  }
  static behaviors = [Behaviors]
  onGetUserInfo(e) {
    const type = e.currentTarget.dataset.type
    if (!this.props.userInfo) {
      this.$scope.saveUserInfo(e.detail.userInfo, type && this[type](e))
    } else {
      type && this[type](e)
    }
  }
  onShareAppMessage = e => {
    console.log(e)
    const shareCode = e.target.dataset.code
    const { configViews } = this.props
    const path = `/pages/index/index${shareCode ? `?shareCode=${shareCode}` : ''}`
    return {
      title: `${configViews.share_title || '快帮我获得赢取大牌口红的机会，就差一步了！'}`,
      path,
      imageUrl: `${configViews.share_image || 'https://api.lipstick.lemiao.xyz/images/app.jpg'}`,
    }
  }
  componentDidShow() {
    this.props.dispatch(action('app/changeIsShowShare', false))
  }
  handleGoOrder() {
    Taro.navigateTo({
      url: '/pages/mine/order/index',
    })
  }
  saveFormID(e) {
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  openAgreement() {
    Taro.navigateTo({
      url: '/pages/webview/index?url=' + encodeURIComponent(this.props.configViews.agreement_url),
    })
  }
  startConversation() {
    Taro.navigateTo({
      url: '/pages/mine/service/index',
    })
  }
  closeDialogShare() {
    this.setState({
      showDialogShare: false,
    })
    Taro.showTabBar()
  }
  shareGetCoin() {
    this.setState({
      showDialogShare: true,
    })
    Taro.hideTabBar()
    this.props.dispatch(this.mappingAction('shareList'))
  }
  render() {
    const {
      loading,
      system,
      userInfo,
      balance = 0,
      prizeCount = 0,
      configViews,
      shareList,
      shareCode,
    } = this.props

    const { showDialogShare } = this.state

    return (
      <block>
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <View className="body">
            {!userInfo && (
              <Button
                onGetUserInfo="onGetUserInfo"
                className="section userinfo"
                openType="getUserInfo"
              >
                <Text className="name">点击登录</Text>
                <Image className="avatar" mode="aspectFill" src={defaultAvatar} />
                <Text className="iconfont icon-arrow-right" />
              </Button>
            )}
            {userInfo && (
              <View className="section userinfo">
                <Text className="name">{userInfo.nickName}</Text>
                <Image
                  className="avatar avatar-logined"
                  lazyLoad
                  mode="aspectFill"
                  src={userInfo.avatarUrl}
                />
              </View>
            )}
            <View className="sectionBorder" />
            <View className="section functions">
              <View className="function function-1">
                <Text className="function-value">{prizeCount}支</Text>
                <Text className="function-title">我的口红</Text>
              </View>
              {isAndroid(system) && <View className="sectionHorizontalBorder" />}
              {isAndroid(system) && (
                <View className="function function-2">
                  <Text className="function-value">{formatCoin(balance)}枚</Text>
                  <Text className="function-title">我的游戏币</Text>
                </View>
              )}
            </View>
            <View className="sectionBorder" />
            <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
              <Button
                onGetUserInfo={this.onGetUserInfo.bind(this)}
                data-type="handleGoOrder"
                className="section bar"
                formType="submit"
                hoverClass="hover"
                openType="getUserInfo"
              >
                <Text className="title">中奖订单</Text>
                <Text className="iconfont icon-arrow-right" />
              </Button>
            </Form>
            <View className="sectionBorder" />
            <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
              <Button
                onClick={this.startConversation.bind(this)}
                className="section bar"
                formType="submit"
                hoverClass="hover"
              >
                <Text className="title">联系客服</Text>
                <Text className="iconfont icon-arrow-right" />
              </Button>
            </Form>
            <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
              <Button
                onClick={this.shareGetCoin.bind(this)}
                className="section bar"
                formType="submit"
                hoverClass="hover"
              >
                <Text className="title">分享得币</Text>
                <Text className="iconfont icon-arrow-right" />
              </Button>
            </Form>
            <View className="sectionBorder" />
            <View className="copyright">
              <View onClick={this.openAgreement.bind(this)}>用户使用协议</View>
              <View>深圳红人助理网络科技有限公司 版权所有</View>
            </View>
            <ModalShare
              isShow={showDialogShare}
              shareCode={shareCode}
              shareList={shareList}
              onClose={this.closeDialogShare.bind(this)}
              onSaveForm={this.saveFormID.bind(this)}
              configViews={configViews}
            />
          </View>
        )}
      </block>
    )
  }
}
