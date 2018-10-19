import { View, Text, Image } from '@tarojs/components'
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
          <Image src={icon} />
          <Text className="name">{name}</Text>
        </View>
        <View className="right">
          <Iconfont type="previewright" size={26} color="#c7c7cc" />
        </View>
      </View>
    )
  }
}
