import { View, Text, Image, Form, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import action from '../../utils/action'
import config from '../../config'
import { User, NavBar, TopAddTip, Packet, Card, Loading } from '../../components'
import './index.scss'

const effectName = name => `article/${name}`
const articleAction = (name, payload) => action(effectName(name), payload)
const redPacketAction = (name, payload) => action(`redPacket/${name}`, payload)
@connect(({ article, user, loading }) => ({
  article,
  user,
  isLoad: loading.effects['article/list'],
  isLoadMore: loading.effects[effectName('loadMore')],
  isReFresh: loading.effects[effectName('refresh')],
}))
export default class extends Component {
  config = {
    enablePullDownRefresh: true,
  }
  componentDidMount = async () => {
    const options = this.$router.params
    console.log('index options ===>', options)
    const { packetNo, avatar, userName } = options
    this.props.dispatch(redPacketAction('save', { sharePacket: (packetNo ? { packetNo, avatar, userName } : null) }))
    this.props.dispatch(articleAction('init'))
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(articleAction('loadMore'))
  }
  onPullDownRefresh = () => {
    this.handleChangeData().then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  onShareAppMessage = e => {
    const target = e.target
    if (target) {
      const { type } = e.target.dataset
      const showToast = () => {
        Taro.showToast({
          title: '分享后，记得叮咛好友帮你点哦',
          duration: 2500,
          icon: 'none',
        })
      }
      if (type === 'help' || type === 'assist') {
        return this.packetCom.getShareConfig(showToast)
      }
    }
    return {
      title: config.appName,
      path: `/pages/index/index`,
    }
  }
  handleChangeData() {
    const { dispatch } = this.props
    return dispatch(articleAction('refresh'))
  }
  refPacket(node) {
    this.packetCom = node
  }
  reportForm(e) {
    const { id } = e.currentTarget.dataset
    const url = `/pages/detail/index?id=${id}&page=${this.props.article.page}`
    Taro.navigateTo({ url })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const {
      isLoad,
      isReFresh,
      article: { list, redPacketPosition },
      user: { balance },
    } = this.props

    const packetProps = {
      position: redPacketPosition,
      icon: '/asset/images/ic_reward@2x.png',
    }

    const adId = `adunit-${config.ad.article}`

    const adDiff = 7

    return (
      <block>
        <User />
        <View className="container">
          <TopAddTip />
          {isReFresh && <View className="update">已更新</View>}
          {isLoad ? (
            <Loading height="calc(100vh - 90rpx)" content="加载中..." />
          ) : (
            <View className="card-container">
              {list.map((item, index) => {
                const { title, cover } = item
                const adIndex = index + 1
                return (
                  <Form
                    reportSubmit
                    onSubmit={this.reportForm.bind(this)}
                    data-id={item.nId}
                    key={item.nId}
                  >
                    <Button formType="submit" className="custom card-btn">
                      <Card title={title} cover={cover} />
                    </Button>
                    {adIndex / adDiff > 0 &&
                      adIndex % adDiff === 0 && (
                        <View className="ad">
                          <ad className="ad" unitId={adId} />
                        </View>
                      )}
                  </Form>
                )
              })}
            </View>
          )}
          <View className="change" onClick={this.handleChangeData.bind(this)}>
            <Image src="../../asset/images/refresh.png" />
            <Text>换一批</Text>
          </View>
          <NavBar />
          <Packet
            ref={this.refPacket}
            position={packetProps.position}
            icon={packetProps.icon}
          />
        </View>
      </block>
    )
  }
}
