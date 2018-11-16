import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { formatPrice } from '../../../../utils'
import { formatDate } from '../../../../utils/timeFormat'
import pageWithData from '../../../../common/PageWithData'
import { Loading } from '../../../../components'
import './index.scss'

@pageWithData('orderDetail')
@connect(({ orderDetail }) => ({
  ...orderDetail,
}))
export default class extends PureComponent {
  config = {
    enablePullDownRefresh: true,
  }
  applyDelivery() {
    this.props.dispatch(this.mappingAction('applyDelivery', this.props.orderView.orderNo))
  }
  onPullDownRefresh() {
    const { dispatch } = this.props
    dispatch(this.mappingAction('init')).then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  copyPostalNumber() {
    Taro.setClipboardData({
      data: this.props.order.post_num,
      success: function(t) {
        Taro.showToast({
          title: '单号已复制',
        })
      },
    })
  }
  render() {
    const { orderView = {}, addressView = {}, expressView = {}, loading } = this.props

    return (
      <View className="order">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <View className="body">
            <View className="order">
              <View className="infomation">
                <Image className="image" lazyLoad mode="aspectFill" src={orderView.imageUrl} />
                <View className="right-part">
                  <Text className="title">{orderView.productName}</Text>
                  <Text className="original-price">￥{formatPrice(orderView.salePrice)} 专柜价格</Text>
                  <View className="brand">
                    <Text className="iconfont brand-name">{orderView.brand}</Text>
                    <Text className="quality-goods">正品</Text>
                  </View>
                  <View className="color-code" style={{ background: orderView.colorCode }} />
                  <Text className="color">{orderView.color}</Text>
                  <Text className="status">{orderView.expressStatus === 1 ? '等待申请' : orderView.expressStatus === 2 ? '待发货' : '已发货'}</Text>
                </View>
              </View>
              <View className="bottom">
                <Text className="order-id">中奖时间：{formatDate(orderView.createdAt)}</Text>
                <Text className="order-id">订单编号：{orderView.orderNo}</Text>
              </View>
              <View className="orderBorder" />
              {(orderView.expressStatus === 2 || orderView.expressStatus === 3) && (
                <View className="address-section">
                  <Text className="address-title">寄送至</Text>
                  <View className="address-value">
                    <Text>{addressView.name}</Text>
                    <Text>{addressView.phone}</Text>
                    <Text>{addressView.province}</Text>
                    <Text>{addressView.city}</Text>
                    <Text>{addressView.region}</Text>
                    <Text>{addressView.address}</Text>
                  </View>
                </View>
              )}
              {orderView.expressStatus === 3 && (
                <View className="parcel-info-section">
                  <View className="orderBorder" />
                  <Text className="postal-company">快递公司：{expressView.name}</Text>
                  <Text onClick={this.copyPostalNumber.bind(this)} className="postal-number">快递编号：{expressView.expressNo}</Text>
                  <Text className="postal-time">发货时间：{formatDate(expressView.createdAt)}</Text>
                </View>
              )}
            </View>
            {orderView.expressStatus === 1 && (
              <Button
                onClick={this.applyDelivery.bind(this)}
                className="apply-delivery"
                hoverClass="button-hover"
              >
                申请发货
              </Button>
            )}
          </View>
        )}
      </View>
    )
  }
}
