import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  render() {
    const { desc, name, saledNum } = this.props.data
    return (
      <View className="desc">
        <View className="main">
          <View className="title">{name}</View>
          <View className="sale-num">
            <View className="num">{saledNum}</View>
            人已免费获得
          </View>
        </View>
        <View className="subscribe">{desc}</View>
      </View>
    )
  }
}
