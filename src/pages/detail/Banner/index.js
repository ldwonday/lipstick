import { SwiperItem, Swiper, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: [],
  }
  handlePreview(index) {
    const banners = this.props.data
    Taro.previewImage({
      current: banners[index].url,
      urls: banners,
    })
  }
  render() {
    const banners = this.props.data
    return (
      <Swiper
        className="banner"
        indicatorColor="#999"
        indicatorActiveColor="#333"
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
    )
  }
}
