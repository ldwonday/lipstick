import { View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class extends Component {
  switchTab(url) {
    Taro.switchTab({ url });
  }

  navigateTo(url) {
    Taro.navigateTo({ url });
  }

  render() {
    const { title, padding, titleColor = '#fff' } = this.props
    const s = {
      padding: '20rpx',
    }
    return (
      <View className="card">
        {title ? (
          <View className="header">
            <View className="title" style={{ color: titleColor }}>
              {title}
            </View>
          </View>
        ) : null}
        <View className="body" style={padding ? s : null}>
          {this.props.children}
        </View>
      </View>
    )
  }
}
