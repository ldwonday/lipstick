import { SwiperItem, View, Swiper, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: [],
  }
  state = {
    current: 0,
  }
  handlePreview(index) {
    const banners = this.props.data
    Taro.previewImage({
      current: banners[index].url,
      urls: banners,
    })
  }
  handleChange(e) {
    this.setState({
      current: e.detail.current
    })
  }
  render() {
    const banners = this.props.data
    const { current } = this.state
    return (
      <View className="banner">
        <Swiper
          indicatorColor="#999"
          indicatorActiveColor="#333"
          onChange={this.handleChange.bind(this)}
          circular
          autoplay
        >
          {banners.map((item, i) => {
            if (i > 4) {
              return false
            }
            const { url } = item
            return (
              <SwiperItem key={i}>
                <Image
                  lazyLoad
                  src={url}
                  mode="widthFix"
                  onClick={this.handlePreview.bind(this, i)}
                />
              </SwiperItem>
            )
          })}
        </Swiper>
        <View className="index">
          {current + 1}/{banners.length}
        </View>
      </View>
    )
  }
}
