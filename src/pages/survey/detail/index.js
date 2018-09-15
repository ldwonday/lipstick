import { View, WebView } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { getStorageSynctUserInfo } from '../../../utils'
import { SHARE_IMAGE } from '../const'
import './index.scss'

export default class extends Component {
  onShareAppMessage = () => {
    const userInfo = getStorageSynctUserInfo()
    return {
      title: '全中国80万人在疯传的测试，强烈推荐！',
      imageUrl: SHARE_IMAGE,
      path: '/pages/survey/index',
    }
  }
  render() {
    return (
      <block>
        <View className="container">
          <WebView src="https://file95f322092315.iamh5.cn/v3/idea/7JNtiPES" />
        </View>
      </block>
    )
  }
}
