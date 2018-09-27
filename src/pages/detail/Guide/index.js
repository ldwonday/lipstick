import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { isShow, onClose } = this.props
    return (
      isShow && (
        <View className="guide" onClick={onClose}>
          <View className="tip left">不想麻烦直接购买</View>
          <View className="tip right">
            <View className="call" />
            召集你的好友帮你点赞,即可免费领
          </View>
        </View>
      )
    )
  }
}
