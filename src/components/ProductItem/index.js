import { View, Image, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { price, name, image, count } = this.props

    return (
      <View className="product-item" hover-class="hover">
        <View className="left">
          <Image src={image} />
        </View>
        <View className="right">
          <View className="title">{name}</View>
          <View className="rb">
            <Text>￥{price}</Text>
            <Text className="num"><Text className="pre">x</Text>{count}</Text>
          </View>
        </View>
      </View>
    )
  }
}
