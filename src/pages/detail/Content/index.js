import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: [],
  }
  handlePreview(index) {
    const details = this.props.data || []
    console.log(details[index].imageUrl)
    Taro.previewImage({
      current: details[index] && details[index].imageUrl,
      urls: details.map(item => item.imageUrl),
    })
  }
  render() {
    const details = this.props.data
    return (
      <View className="content">
        {details.map((item, i) => {
          const { imageUrl } = item
          return (
            <Image
              key={i}
              lazyLoad
              src={imageUrl}
              mode="widthFix"
              onClick={this.handlePreview.bind(this, i)}
            />
          )
        })}
      </View>
    )
  }
}
