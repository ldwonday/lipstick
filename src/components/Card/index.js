import { View, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class extends Component {
  render() {
    const { title, to, cover, subTitle } = this.props
    return (
      <View className="card">
        <View className="img">
          <Image src={cover} />
          <View className="main">
            <View>{title}</View>
          </View>
        </View>
      </View>
    )
  }
}
