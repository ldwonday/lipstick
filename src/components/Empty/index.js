import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { image, tip, desc } = this.props
    return (
      <View className="empty">
        <Image className="bg" src={image} />
        <View className="tip">{tip}</View>
        <View className="desc">{desc}</View>
      </View>
    )
  }
}
