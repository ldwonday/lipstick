import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  render() {
    const { content, createdAt, headImageUrl, nickName } = this.props.data
    return (
      <View className="msg-item">
        <View className="left">
          <Image src={headImageUrl} />
        </View>
        <View className="right">
          <View className="top">
            <View className="name">{nickName}</View>
            <View className="time">{createdAt}</View>
          </View>
          <View className="desc">{content}</View>
        </View>
      </View>
    )
  }
}
