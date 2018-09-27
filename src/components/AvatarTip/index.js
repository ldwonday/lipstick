import { View, Image, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { avatarUrl } = this.props
    return (
      <View className="avatar-tip">
        <Image src={avatarUrl} />
        {this.props.children}
      </View>
    )
  }
}
