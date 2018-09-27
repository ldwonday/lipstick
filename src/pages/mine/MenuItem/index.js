import { View, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../../components'
import './index.scss'

export default class extends PureComponent {
  navigateTo(url) {
    url && Taro.navigateTo({ url })
  }
  render() {
    const { icon, name, to } = this.props

    return (
      <View className="menu-item" hover-class="hover" onClick={this.navigateTo.bind(this, to)}>
        <View className="left">
          <Iconfont type={icon} size={54} color="#000" />
          <Text className="name">{name}</Text>
        </View>
        <View className="right">
          <Iconfont type="you" size={30} color="#000" />
        </View>
      </View>
    )
  }
}
