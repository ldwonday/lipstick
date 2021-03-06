import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    userInfo: {},
  }
  render() {
    const { avatarUrl, width = 168, height = 168 } = this.props

    return (
      <View className="head" style={{ width: width + 'rpx', height: height + 'rpx' }}>
        <Image src={avatarUrl} />
      </View>
    )
  }
}
