import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import action from '../../utils/action'
import config from '../../config'
import { TopBar, NavBar, Container, Packet, Card, Loading } from '../../components'
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
    packetNo &&
      this.props.dispatch(redPacketAction('save', { sharePacket: { packetNo, avatar, userName } }))
    this.props.dispatch(articleAction('init'))
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(articleAction('loadMore'))
  }
  onPullDownRefresh = async () => {
    this.handleChangeData()
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
      path: `/routes/article/index`,
    }
  }
  handleChangeData() {
    const { dispatch } = this.props
    dispatch(articleAction('refresh'))
  }
  refPacket(node) {
    this.packetCom = node
  }
  render() {
    const {
      isLoad,
      isReFresh,
      article: { list, redPacketPosition },
      user: { balance },
      page,
    } = this.props

    const packetProps = {
      position: redPacketPosition,
      icon: '/asset/images/ic_reward@2x.png',
    }

    const adId = `adunit-${config.ad.article}`

    const adDiff = 7

    return (
      <View>
        <TopBar isShowBack={false} balance={balance} />
        <Container>
          {isReFresh && <View className="update">已更新</View>}
          {isLoad ? (
            <Loading height="calc(100vh - 90rpx)" content="加载中..." />
          ) : (
            <View className="card-container">
              {list.map((item, index) => {
                const { title, cover } = item
                const adIndex = index + 1
                return (
                  <block>
                    <Card
                      title={title}
                      cover={cover}
                      key={item.nId}
                      to={`/routes/detail/index?id=${item.nId}&page=${page}`}
                    />
                    {adIndex / adDiff > 0 &&
                      adIndex % adDiff === 0 && (
                        <View className="ad">
                          <ad className="ad" unitId={adId} />
                        </View>
                      )}
                  </block>
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
        </Container>
      </View>
    )
  }
}
