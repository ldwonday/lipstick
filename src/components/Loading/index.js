import { View } from '@tarojs/components'
import { Component } from '@tarojs/taro'
import { AtActivityIndicator } from 'taro-ui'
import './index.scss'

export default class extends Component {
  render() {
    const { size, content, mode, color = '#9d8352', height = '4rem' } = this.props
    return (
      <View className="loading" style={{ minHeight: height }}>
        <AtActivityIndicator mode={mode} content={content} size={size} color={color} />
      </View>
    )
  }
}
