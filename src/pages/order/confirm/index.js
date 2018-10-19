import { View, Form, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { Loading, Iconfont, ProductItem } from '../../../components'
import Stepper from './Stepper'
import pageWithData from '../../../common/PageWithData'
import './index.scss'
import Behaviors from '../../../utils/CommonBehavior'

@pageWithData('orderConfirm')
@connect(({ orderConfirm, user }) => ({
  ...orderConfirm,
  ...user,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '确认订单',
  }
  static behaviors = [Behaviors]
  state = {
    buyNum: 1,
  }
  handleGoAddress() {
    Taro.navigateTo({
      url: '/pages/mine/address/index?chooseAddress=true',
    })
  }
  handleBuyNumChange(buyNum) {
    this.setState({
      buyNum,
    })
  }
  handleClick() {
    try {
      this.props.dispatch(
        this.mappingAction('commit', {
          buyType: this.$router.params.buyType,
          formId: this.formId,
          count: this.state.buyNum,
          addressId: this.props.postDetail.id,
          shareCode: '',
          productId: this.props.info.productId,
        })
      )
    } catch (e) {
      Taro.showModal({
        title: '提示',
        content: '下单失败',
      })
    }
  }
  formSubmit(e) {
    this.formId = e.detail.formId
    const { userInfo } = this.props
    if (userInfo) {
      this.handleClick()
    }
  }
  handleGetUserInfo(e) {
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
      this.handleClick()
    })
  }
  render() {
    const {
      loading,
      info = {},
      postDetail,
      userInfo,
    } = this.props

    const { buyType = '1' } = this.$router.params

    const { province, address, city, region, name, phone } = postDetail || {}

    const { buyNum } = this.state

    return (
      <View className="order-confirm">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            {postDetail && (
              <View className="top" onClick={this.handleGoAddress.bind(this)}>
                <View className="left">
                  <View className="lt">
                    <View className="ltl">收货人：{name}</View>
                    <View className="ltr">{phone}</View>
                  </View>
                  <View className="lb">{`${province} ${city} ${region} ${address}`}</View>
                </View>
                <View className="right">
                  <Iconfont type="previewright" size={26} color="#c7c7cc" />
                </View>
              </View>
            )}
            {!postDetail && (
              <View className="top" onClick={this.handleGoAddress.bind(this)} style={{textAlign: 'center'}}>
                您还没有添加地址，现在添加一个吧
              </View>
            )}
            <View className="detail">
              <ProductItem
                price={info.price}
                name={info.name}
                image={info.mainImageUrl}
                count={buyNum}
              />
            </View>
            <View className="desc">
              <View className="item">
                <View className="label">购买数量</View>
                <View className="content">
                  <Stepper value={buyNum} onChange={this.handleBuyNumChange.bind(this)} />
                </View>
              </View>
              <View className="line1px" />
              <View className="item">
                <View className="label">支付方式</View>
                <View className="content">微信支付</View>
              </View>
            </View>
            <View className="fixed-bottom">
              <View className="price">
                <Text className="unit">￥</Text>{((buyType === '1' ? info.price : info.sharedPrice) * buyNum).toFixed(2)}</View>
              <Form onSubmit={this.formSubmit.bind(this)} reportSubmit>
                {!userInfo && (
                  <Button
                    type="submit"
                    className="red"
                    openType="getUserInfo"
                    formType="submit"
                    onGetUserInfo={this.handleGetUserInfo.bind(this)}
                  >
                    立即支付
                  </Button>
                )}
                {userInfo && (
                  <Button
                    type="submit"
                    className="red"
                    formType="submit"
                  >
                    立即支付
                  </Button>
                )}
              </Form>
            </View>
          </block>
        )}
      </View>
    )
  }
}
