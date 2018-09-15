import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class extends Component {
  state = {
    tipsStartTime: 2000,
    durations: 5000,
    showShareTips: false,
  }
  componentDidMount = () => {
    const { tipsStartTime, durations } = this.state
    setTimeout(() => {
      this.changeShareTips()
    }, tipsStartTime)
    setTimeout(() => {
      this.changeShareTips()
    }, tipsStartTime + durations)
  }
  goHome() {
    Taro.getCurrentPages().length === 1
      ? Taro.redirectTo({ url: '/pages/index/index' })
      : Taro.navigateBack()
  }
  changeShareTips() {
    this.setState({
      showShareTips: !this.state.showShareTips,
    })
  }
  render() {
    const { showShareTips } = this.state
    return (
      <View className="share-button">
        <View className="home">
          <Button onClick={this.goHome.bind(this)}>
            <Image src="../../asset/images/home.png" />
            <Text>最新热文</Text>
          </Button>
        </View>
        <View className="share">
          <Button openType="share">
            <Image src="../../asset/images/share.png" />
            <Text>转发给好友</Text>
          </Button>
        </View>
        {showShareTips && <View className="share-tips">喜欢这篇图文，转发给好友吧!</View>}
      </View>
    );
  }
}
