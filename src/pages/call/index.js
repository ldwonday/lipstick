import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro from '@tarojs/taro'
import action from '../../utils/action'
import { Loading, CustomModal, Barrage, Head, TopBlurHead, Iconfont } from '../../components'
import BottomCard from './BottomCard'
import ShareImage from '../detail/ShareImage'
import './index.scss'

const effectName = name => `call/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ call, user }) => ({
  ...call,
  user,
}))
export default class extends ShareImage {
  static defaultProps = {
    info: {},
    barrages: [],
  }
  state = {
    loading: true,
    isShowModal: false,
  }
  componentDidMount = () => {
    let scene = this.$router.params.scene
    if (scene) {
      scene = JSON.parse(decodeURIComponent(scene))
    }
    const recordNo = this.$router.params.recordNo || scene.recordNo
    this.ctx = Taro.createCanvasContext('canvas', this.$scope)
    this.props.dispatch(mappingAction('init', { recordNo })).then(_ => {
      this.setState({
        loading: false,
      })
    })
  }
  componentWillUnmount = () => {
    this.props.dispatch(mappingAction('clear'))
  }
  onShareAppMessage = e => {
    const { recordNo } = this.$router.params
    const info = this.props.user.userInfo
    const pTitle = this.props.info.productName || ''
    return {
      title: `${(info && info.nickName) || ''}邀你一起免费拿【${pTitle}】`,
      path: `/pages/call/index?recordNo=${recordNo}&showHome=1`,
      imageUrl: this.shareImage,
    }
  }
  handleSharePYQ() {
    Taro.navigateTo({ url: `/pages/share/index?image=${this.props.info.mainImageUrl}` })
  }
  handleDoCall() {
    const { info } = this.props
    this.props.dispatch(mappingAction('doCall', info.recordNo))
  }
  handleNewCall() {
    Taro.switchTab({ url: '/pages/index/index' })
    /*Taro.navigateTo({ url: `/pages/detail/index?id=${this.props.info.productId}` })*/
  }
  handleChangeProduct() {
    this.setState({
      isShowModal: true,
    })
  }
  handleCloseModal() {
    this.setState({
      isShowModal: false,
    })
  }
  handleGoHome() {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  render() {
    const {
      info,
      barrages,
      user: { userInfo },
    } = this.props

    const { showHome } = this.$router.params

    const { isShowModal, loading } = this.state

    const { productName, mainImageUrl, saledNum } = info

    return (
      <View>
        {loading ? (
          <Loading height="80vh" />
        ) : (
          <View className="bg">
            <Barrage data={barrages} />
            {showHome && (
              <View className="home" onClick={this.handleGoHome.bind(this)}>
                <Iconfont type="ic_home" size={32} />
                返回首页
              </View>
            )}
            <TopBlurHead imageUrl={mainImageUrl}>
              <View className="head">
                <Head avatarUrl={mainImageUrl} />
                <View className="sale-tip">
                  {saledNum}
                  人已免费获得
                </View>
              </View>
              <View className="title">{productName}</View>
            </TopBlurHead>
            <BottomCard
              userInfo={userInfo}
              data={info}
              onSharePYQ={this.handleSharePYQ.bind(this)}
              onCallZan={this.handleDoCall.bind(this)}
              onNewCall={this.handleNewCall.bind(this)}
              onChangeProduct={this.handleChangeProduct.bind(this)}
              onGoHome={this.handleGoHome.bind(this)}
            />
          </View>
        )}

        <CustomModal
          isShow={isShowModal}
          btnText="去回复"
          openType="contact"
          onClose={this.handleCloseModal.bind(this)}
        >
          <View>
            回复文字
            <Text className="zan">“赞”</Text>
          </View>
          <View>添加我们客服兑换商品吧</View>
        </CustomModal>
        <Canvas canvasId="canvas" style={{ width: '640px', height: '640px' }} />
      </View>
    )
  }
}
