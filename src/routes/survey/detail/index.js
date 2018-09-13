import { View, WebView } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { TopBar, Container } from '../../../components'
import { getStorageSynctUserInfo } from '../../../utils'
import './index.scss'

export default class extends Component {
  onShareAppMessage = () => {
    const userInfo = getStorageSynctUserInfo()
    return {
      title: `${
        userInfo && userInfo.nickName ? userInfo.nickName : ''
      }@你，生命只有一次，快点击测试吧↓↓↓`,
      imageUrl: 'https://klimg.pptmbt.com/pub/article/test-share.jpg',
      path: '/routes/survey/index',
    }
  }
  render() {
    return (
      <View>
        <TopBar isShowBack />
        <Container>
          <WebView src="https://file95f322092315.iamh5.cn/v3/idea/5gwcHqQ2" />
        </Container>
      </View>
    )
  }
}
