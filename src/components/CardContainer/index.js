import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    return <View className="card-container">{this.props.children}</View>
  }
}
