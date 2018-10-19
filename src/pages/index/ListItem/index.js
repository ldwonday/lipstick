import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import RightBuy from '../../../asset/images/btn-home-buynow.png'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  render() {
    const {
      data: { productName = '', bannerImage = '' },
    } = this.props
    return (
      <View
        hover-class="product-hover"
        className="product-item"
      >
        <View className="content" style={{ backgroundImage: `url(${bannerImage})` }} />
        <View className="footer">
          <View className="title">{productName}</View>
          <View className="right-buy">
            <Image src={RightBuy} />
          </View>
        </View>
      </View>
    )
  }
}
