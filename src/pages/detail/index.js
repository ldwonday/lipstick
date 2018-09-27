import { View, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro from '@tarojs/taro'
import action from '../../utils/action'
import { Card, Loading, Barrage } from '../../components'
import Banner from './Banner'
import Content from './Content'
import Description from './Description'
import ButtonGroup from './ButtonGroup'
import Guide from './Guide'
import ShareImage from './ShareImage'
import './index.scss'

const effectName = name => `detail/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ detail, user, app }) => ({
  ...detail,
  user,
  isFirst: app.isFirst,
}))
export default class extends ShareImage {
  static defaultProps = {
    info: {},
    barrages: [],
  }
  state = {
    loading: true,
  }
  componentDidMount = () => {
    this.ctx = Taro.createCanvasContext('canvas', this.$scope)
    this.props.dispatch(mappingAction('init', this.$router.params.id)).then(_ => {
      this.setState({
        loading: false,
      })
    })
  }
  componentWillUnmount = () => {
    this.props.dispatch(mappingAction('clear'))
  }
  onShareAppMessage = e => {
    const info = this.props.user.userInfo
    const pTitle = this.props.info.name || ''
    return {
      title: `${(info && info.nickName) || ''}邀你一起免费拿【${pTitle}】`,
      path: `/pages/index/index`,
      imageUrl: this.shareImage,
    }
  }
  handleCollect(formId) {
    this.props.dispatch(mappingAction('newCall', formId))
  }
  handleBuyProduct(formId) {
    this.props.dispatch(mappingAction('buyProduct', formId))
  }
  handleCloseGuide() {
    this.props.dispatch(action('app/changeIsFirst', false))
  }
  render() {
    const {
      info = {},
      barrages,
      isFirst,
      user: { userInfo },
    } = this.props

    const { loading } = this.state

    const { banners = [], detailList, ...desc } = info

    return (
      <View>
        {loading ? (
          <Loading height="80vh" />
        ) : (
          <block>
            <Guide isShow={isFirst} onClose={this.handleCloseGuide.bind(this)} />
            <Barrage data={barrages} />
            <Banner data={banners} />
            <Description data={desc} />
            <Card title="商品详情" titleColor="#000">
              <Content data={detailList} />
            </Card>
            <ButtonGroup
              isAuthorize={!!userInfo}
              data={desc}
              onBuy={this.handleBuyProduct.bind(this)}
              onCollect={this.handleCollect.bind(this)}
            />
          </block>
        )}
        <Canvas canvasId="canvas" style={{ width: '640px', height: '640px' }} />
      </View>
    )
  }
}
