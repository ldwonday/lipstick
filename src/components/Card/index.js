import { View, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class extends Component {
  navigateTo(url) {
    Taro.navigateTo({ url })
  }

  render() {
    const { title, to, cover, subTitle } = this.props
    return (
      <View className="card" onClick={this.navigateTo.bind(this, to)}>
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
