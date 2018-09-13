import { View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { getNavHeight } from '../../utils'
import './index.scss'

export default class extends Component {
  static options = {
    addGlobalClass: true,
  }
  navigateTo(url) {
    Taro.navigateTo({ url })
  }
  async componentDidMount() {
    const { startBarHeight, navigationHeight } = await getNavHeight()
    this.setState({
      startBarHeight,
      navigationHeight,
    })
  }
  render() {
    const { startBarHeight, navigationHeight } = this.state
    return (
      <View className="container" style={{ marginTop: (startBarHeight + navigationHeight) + 'px'}}>
        {this.props.children}
      </View>
    )
  }
}
