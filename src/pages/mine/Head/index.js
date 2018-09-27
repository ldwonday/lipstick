import { View, Image, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    userInfo: {},
  }
  render() {
    const {
      userInfo: { avatarUrl, nickName },
    } = this.props

    return (
      <View className="head">
        <Image src={avatarUrl} />
        <Text>{nickName}</Text>
      </View>
    )
  }
}
