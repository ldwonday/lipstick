import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { Loading } from '../../../components'
import pageWithData from '../../../common/PageWithData'
import { formatDate } from '../../../utils/timeFormat'
import './index.scss'

@pageWithData('orderDetail')
@connect(({ orderDetail }) => ({
  ...orderDetail,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '订单详情',
  }
  render() {
    const {
      loading,
      amount,
      count,
      createAt,
      imageUrl,
      orderNo,
      productName,
      status,
    } = this.props

    return (
      <View className="order-detail">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            <View className="top">
              <View className="point-line">
                <View className="point" />
                <View className="point-split"></View>
                <View className="point active" />
              </View>
              <View className="point-text">
                <View className="status-text">付款成功</View>
                <View className="status-text">钱款已交由 小程序托管</View>
              </View>
            </View>
            <View className="bottom">
              <View className="title-tip">总价</View>
              <View className="amount">
                <Text className="unit">￥</Text>
                {amount}</View>
              <View className="title-tip">购物须知</View>
              <View className="buy-tip">
                已购买的商品由卖家发货直接寄送到你的地址，小程序暂不进行物流跟踪，如遇到虚假商品，可截图发给我们，我们会根据情况对卖家进行处罚。同时你的钱款由小程序代位托管，钱款很安全请放心
              </View>
              <View className="buy-detail">
                <View className="line" />
                <View className="item">
                  <Text>商品名称</Text>
                  <Text>{productName}</Text>
                </View>
                <View className="line" />
                <View className="item">
                  <Text>订单编号</Text>
                  <Text>{orderNo}</Text>
                </View>
                <View className="line" />
                <View className="item">
                  <Text>交易时间</Text>
                  <Text>{formatDate(createAt)}</Text>
                </View>
                <View className="line" />
              </View>
              <Button className="red" openType="contact">联系卖家</Button>
            </View>
          </block>
        )}
      </View>
    )
  }
}
