import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    currentIndex: 0,
  }
  componentDidMount = () => {
    this.setState({
      currentIndex: this.props.current,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.state.currentIndex) {
      this.setState({ currentIndex: nextProps.current })
    }
  }

  render() {
    const { currentIndex } = this.state
    const { tabList, onClick } = this.props
    return (
      <View className="tab">
        <View className="tab-head">
          {tabList &&
            tabList.length > 0 &&
            tabList.map(item => (
              <View
                key={item.key}
                onClick={onClick.bind(null, item.key)}
                className={`tab-title${currentIndex === item.key ? ' active' : ''}`}
              >
                <View className="title-container">{item.title}</View>
              </View>
            ))}
        </View>
        <View className="tab-content">{this.props.children}</View>
      </View>
    )
  }
}
