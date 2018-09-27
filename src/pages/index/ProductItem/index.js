import { View, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../../components'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  navigateTo(url) {
    Taro.navigateTo({ url })
  }
  render() {
    const {
      data: { productName = '', saledNum = 0, bannerImage = '', price = 0 },
      to,
    } = this.props
    return (
      <View
        hover-class="product-hover"
        className="product-item"
        onClick={this.navigateTo.bind(this, to)}
      >
        <View className="sale">
          <Iconfont type="ic_gift" size={24} color="#FF5C21" />
          <Text>{saledNum}</Text>
          人已免费获得
        </View>
        <View className="content" style={{ backgroundImage: `url(${bannerImage})` }} />
        <View className="footer">
          <View className="title">{productName}</View>
          <View className="price">
            <Text className="unit">￥</Text>
            {(price && price.toFixed(2)) || 0}
          </View>
        </View>
      </View>
    )
  }
}
