import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  handleClick() {
    const { recordNo } = this.props.data
    Taro.navigateTo({
      url: `/pages/call/index?recordNo=${recordNo}`,
    })
  }

  render() {
    const {
      data: { leftNum, status, productDesc, productName, mainImageUrl },
    } = this.props

    return (
      <View className="order-item" hover-class="hover" onClick={this.handleClick.bind(this)}>
        <View className="top">
          <View className="left">
            <Image src={mainImageUrl} />
          </View>
          <View className="right">
            <View className="title">{productName}</View>
            <View className="desc">{productDesc}</View>
          </View>
        </View>
        <View className="line" />
        <View className="bottom">
          <View className="state">{status === 2 ? '已完成' : '未完成'}</View>
          {status === 1 && (
            <View className="diff">
              还差
              {leftNum}
              个赞
            </View>
          )}
        </View>
      </View>
    )
  }
}
