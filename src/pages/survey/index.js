import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import action from '../../utils/action'
import config from '../../config'
import { TopBar, Container, NavBar } from '../../components'
import './index.scss'
import { getStorageSynctUserInfo } from '../../utils'

const effectName = name => `survey/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ user }) => ({
  user,
}))
export default class extends Component {
  componentDidMount = async () => {
    this.props.dispatch(mappingAction('init'))
  }
  onShareAppMessage = () => {
    const userInfo = getStorageSynctUserInfo()
    return {
      title: `${userInfo && userInfo.nickName ? userInfo.nickName : ''}@你，生命只有一次，快点击测试吧↓↓↓`,
      imageUrl: 'https://klimg.pptmbt.com/pub/article/test-share2.gif',
      path: '/routes/survey/index',
    }
  }
  goDetail() {
    Taro.navigateTo({
      url: '/routes/survey/detail/index',
    })
  }
  render() {
    const adId = `adunit-${config.ad.survey}`

    const {
      user: { balance },
    } = this.props

    return (
      <View>
        <TopBar isShowBack={false} balance={balance} />
        <Container>
          <View className="card" onClick={this.goDetail.bind(this)} />
          <View className="ad">
            <ad unitId={adId} />
          </View>
        </Container>
        <NavBar />
      </View>
    )
  }
}
