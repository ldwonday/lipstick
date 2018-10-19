import { View, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  render() {
    const { name, price, saledNum } = this.props.data
    return (
      <View className="desc">
        <View className="main">
          <View className="price"><Text>￥</Text>{price}</View>
          <View className="sale-num">已售{saledNum}份</View>
        </View>
        <View className="subscribe">{name}</View>
      </View>
    )
  }
}
