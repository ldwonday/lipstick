import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { imageUrl } = this.props

    return (
      <View className="top-head">
        <View className="top-bg">
          <View className="bg" style={{ backgroundImage: `url(${imageUrl})` }} />
          <View className="blur" />
        </View>
        {this.props.children}
      </View>
    )
  }
}
