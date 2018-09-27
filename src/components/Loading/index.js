import { View } from '@tarojs/components'
import { PureComponent } from '@tarojs/taro'
import { AtActivityIndicator } from 'taro-ui'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { size, content, mode, color = '#9d8352', height = '160rpx' } = this.props
    return (
      <View className="loading" style={{ minHeight: height, height }}>
        <AtActivityIndicator mode={mode} content={content} size={size} color={color} />
      </View>
    )
  }
}
