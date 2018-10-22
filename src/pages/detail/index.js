import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { getProductShareTimes, setProductShareTimes } from '../../utils'
import { Card, Loading, Barrage, Iconfont } from '../../components'
import Banner from './Banner'
import Content from './Content'
import Description from './Description'
import ButtonGroup from './ButtonGroup'
import PopShare from './PopShare'
import pageWithData from '../../common/PageWithData'
import MessageItem from './MessageItem'
import FloatImage from '../../asset/images/img_float_redbag.gif'
import './index.scss'

@pageWithData('detail')
@connect(({ detail, user }) => ({
  ...detail,
  user,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '商品详情',
  }
  static defaultProps = {
    info: {},
    barrages: [],
  }
  state = {
    isShowPopShare: false,
    currentShareTimes: 0,
  }
  componentDidMount() {
    getProductShareTimes()
      .then(({ data }) => {
        try {
          this.allProductShareTimes = JSON.parse(data)
          this.setState({
            currentShareTimes: this.allProductShareTimes[this.$router.params.id] || 0,
          })
        } catch (e) {
          console.log(e)
          this.allProductShareTimes = {}
        }
      })
      .catch(e => {
        this.allProductShareTimes = {}
      })
  }
  onShareAppMessage() {
    const info = this.props.user.userInfo
    const pTitle = this.props.info.name || ''
    return {
      title: `${(info && info.nickName) || ''}邀你一起免费拿【${pTitle}】`,
      path: `/pages/detail/index?id=${this.props.info.productId}`,
      imageUrl: this.shareImage,
      success: () => {
        const addTimes = this.state.currentShareTimes + 1
        this.allProductShareTimes[this.$router.params.id] = addTimes
        this.setState({
          currentShareTimes: addTimes,
        })
        setProductShareTimes(JSON.stringify(this.allProductShareTimes))
        if (addTimes === this.props.info.needShareTimes) {
          this.handleBuyProduct('2')
        }
      },
    }
  }
  handleBuyProduct(type) {
    Taro.navigateTo({
      url: `/pages/order/confirm/index?id=${this.props.info.productId}&buyType=${type}`,
    })
  }
  handleClosePopShare() {
    this.setState({
      isShowPopShare: false,
    })
  }
  handleOpenPopShare() {
    this.setState({
      isShowPopShare: true,
    })
  }
  handleMoreComment() {
    Taro.navigateTo({
      url: `/pages/detail/comment/index?id=${this.props.info.productId}`,
    })
  }
  render() {
    const {
      loading,
      info = {},
      barrages,
      comments,
      user: { userInfo },
    } = this.props

    const { isShowPopShare, currentShareTimes } = this.state

    const { banners = [], detailList, ...desc } = info

    return (
      <View>
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            <PopShare isShow={isShowPopShare} onClose={this.handleClosePopShare.bind(this)} />
            <Barrage data={barrages} position={{ left: '30rpx', top: '115rpx' }} />
            <Banner data={banners} />
            <Description data={desc} />
            <Card title="用户留言">
              <View className="more" onClick={this.handleMoreComment.bind(this)}>
                更多
                <Iconfont type="previewright" size={18} color="#9b9b9b" />
              </View>
              <View className="comments">
                {comments.map(item => (
                  <MessageItem key={item} data={item} />
                ))}
              </View>
            </Card>
            <Card title="商品详情" className="detail-card">
              <Content data={detailList} />
            </Card>
            <ButtonGroup
              isAuthorize={!!userInfo}
              data={desc}
              currentShareTimes={currentShareTimes}
              needShareTimes={info.needShareTimes}
              onBuy={this.handleBuyProduct.bind(this)}
            />
            <View className="float-share" onClick={this.handleOpenPopShare.bind(this)}>
              <Image src={FloatImage} />
            </View>
          </block>
        )}
      </View>
    )
  }
}
