import { View, Form, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import action from '../../utils/action'
import config from '../../config'
import { NavBar } from '../../components'
import './index.scss'
import { getStorageSynctUserInfo } from '../../utils'
import { SHARE_IMAGE } from './const'

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
      title: '全中国80万人在疯传的测试，强烈推荐！',
      imageUrl: SHARE_IMAGE,
      path: '/pages/survey/index',
    }
  }
  goDetail(e) {
    Taro.navigateTo({
      url: '/pages/survey/detail/index',
    })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const adId = `adunit-${config.ad.survey}`

    const {
      user: { balance },
    } = this.props

    return (
      <block>
        <View className="container">
          <Form reportSubmit onSubmit={this.goDetail.bind(this)}>
            <Button formType="submit" className="custom card-btn">
              <View className="card">
                <Image src="https://klimg.pptmbt.com/pub/article/test-body2.gif" />
              </View>
            </Button>
          </Form>
          <View className="ad">
            <ad unitId={adId} />
          </View>
        </View>
        <NavBar />
      </block>
    )
  }
}
