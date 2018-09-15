import { connect } from '@tarojs/redux'
import _ from 'lodash'
import { View, Image, Text, Button } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import {
  shareTotalTimes,
  NONE,
  SHOW_PACKET,
  SHARE_PACKET,
  ASSIST_SUCCESS,
  ASSIST_PACKET,
  PICK_PACKET,
} from '../../model/redPacket/const'
import {
  showWxLoading,
  hideWxLoading,
  setStorageShareTimes,
  getStorageShareTimes,
} from '../../utils'
import action from '../../utils/action'
import './index.scss'

const effectName = name => `redPacket/${name}`
const packetAction = (name, payload) => action(effectName(name), payload)

@connect(({ redPacket, app }) => ({ redPacket, app }))
export default class extends Component {
  static defaultProps = {
    position: {
      right: '0rpx',
      bottom: '300rpx',
    },
    icon: '/asset/images/ic_reward@2x.png',
  }
  state = {
    showStatus: NONE,
    oHour: 0,
    oMin: 0,
    oSec: 0,
    shareTimes: 0,
  }
  move = null
  countDown = null
  isClickPacket = false
  getShareConfig = cb => {
    const { app: { userInfo }, redPacket: { packet } } = this.props
    const path = `/pages/index/index?avatar=${encodeURIComponent(userInfo.avatarUrl)}&userName=
      ${userInfo.nickName}&packetNo=${packet.recordView.packetNo}`
    console.log(path)
    return {
      title: `${(userInfo && userInfo.nickName) || ''}@你，一起来拿红包吧`,
      path,
      imageUrl: 'https://klimg.pptmbt.com/pub/cf-mp/share@2x.png',
      success: cb || (() => {}),
    }
  }
  closePacket() {
    this.isClickPacket = false

    const packet = _.cloneDeep(this.props.redPacket.packet)
    delete packet.infoView

    this.props.dispatch(packetAction('save', { sharePacket: null, packet }))

    if (this.countDown) {
      clearInterval(this.countDown)
      this.countDown = null
    }
  }
  pickPacket() {
    const packet = _.cloneDeep(this.props.redPacket.packet)
    if (this.state.pickBtnDisabled) {
      return
    }
    if (packet.detailViews.length === 0) {
      this.props.dispatch(packetAction('get'))
      return
    }
    if (this.move) {
      clearTimeout(this.move)
      this.setState({
        isMoneyMove: false,
      })
      this.move = null
    }
    this.isClickPacket = true
    this.setState({
      pickBtnDisabled: true,
    })
    const { dispatch } = this.props
    console.log('pickPacket packet start ===> ', packet)
    const index = packet.detailViews.length - 1
    dispatch(packetAction('grab', packet.detailViews[index].id))
      .then(async res => {
        this.setState({
          isMoneyMove: true,
        })
        dispatch(action('user/balance'))
        packet.detailViews.splice(index, 1)
        if (packet.detailViews.length === 0) {
          try {
            await this.moneyMove()
            const status = packet.recordView.status
            if (status === 1) {
              await setStorageShareTimes(0)
            }
            this.props.dispatch(packetAction('get')).then(_ => {
              this.setState({
                pickBtnDisabled: false,
              })
            })
            console.log('pickPacket result ===>', this)
          } catch (e) {
            console.log('pickPacket error ===> ', e)
          }
        } else {
          this.moneyMove()
          dispatch(
            packetAction('save', {
              packet,
            })
          )
          this.setState({
            pickBtnDisabled: false,
          })
          console.log('pick result ===> ', packet)
        }
      })
      .catch(e => {
        console.log('pick error ===> ', e)
        this.setState({
          pickBtnDisabled: false,
        })
      })
  }
  async openPacket(e) {
    showWxLoading()
    this.isClickPacket = true
    this.props
      .dispatch(packetAction('get'))
      .then(_ => {
        hideWxLoading()
      })
      .catch(e => {
        hideWxLoading()
      })
  }
  assistPacket() {
    showWxLoading()
    this.props
      .dispatch(packetAction('assist'))
      .then(_ => {
        this.setState({
          showStatus: ASSIST_SUCCESS,
        })
        hideWxLoading()
      })
      .catch(e => {
        this.props.dispatch(packetAction('get'))
        console.log(e)
        hideWxLoading()
      })
  }
  async checkPacket({ sharePacket, packet, userInfo }) {
    console.log('checkPacket start ===> ', this.isClickPacket, sharePacket, packet, userInfo)
    let showStatus = NONE

    try {
      const { canGrap, recordView, infoView } = packet
      if (infoView && (!userInfo || (!infoView.assisted && !infoView.finished && !infoView.self))) {
        showStatus = ASSIST_PACKET
      } else if (
        (infoView && (infoView.assisted || infoView.finished || infoView.self)) ||
        this.isClickPacket
      ) {
        if (canGrap) {
          showStatus = PICK_PACKET
        } else if (recordView.packetNo) {
          showStatus = SHOW_PACKET
        } else {
          showStatus = SHARE_PACKET
          const status = recordView.status

          if (status === 1) {
            const resTimes = await getStorageShareTimes()
            const shareTimes = resTimes.data
            if (shareTimes >= shareTotalTimes) {
              await this.props.dispatch(packetAction('extra'))
            } else {
              this.setState({
                shareTimes,
              })
            }
          }
        }
      }

      showStatus === SHOW_PACKET && this.getCountDate()

      console.log('checkPacket ===> ', packet, showStatus)
      this.setState({
        showStatus,
      })
    } catch (e) {
      console.log('checkPacket error ===> ', e)
    }
  }
  moneyMove() {
    return new Promise((resolve, reject) => {
      this.move = setTimeout(() => {
        this.setState({
          isMoneyMove: false,
        })
        clearTimeout(this.move)
        this.move = null
        resolve()
      }, 1000)
    })
  }
  getUserInfo(e) {
    if (!this.props.app.userInfo) {
      showWxLoading()
      const { type } = e.currentTarget.dataset
      Taro.getApp().byGetUserInfo(e, () => {
        hideWxLoading()
        type === SHOW_PACKET && this.openPacket()
        type === ASSIST_PACKET && this.assistPacket()
      })
    } else {
      this.isClickPacket = true
    }
  }
  getCountDate() {
    let oDate = new Date()
    oDate.setHours(23, 59, 59, 0)

    // 将0-9的数字前面加上0，例1变为01
    const checkTime = i => {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }

    const countDown = () => {
      // 未来时间戳减去现在时间的时间戳;
      const ms = oDate.getTime() - new Date().getTime()

      // 毫秒转换成秒
      let oSec = parseInt(ms / 1000)

      // 不到一天剩下的秒数;
      oSec %= 86400

      // 转换成小时
      let oHour = parseInt(oSec / 3600)

      // 不到一小时剩下的秒数;
      oSec %= 3600

      // 转换成分钟
      let oMin = parseInt(oSec / 60)

      // 不到一分钟剩下的秒数;
      oSec %= 60

      if (oHour === 0 && oMin === 0 && oSec === 0) {
        oDate = new Date()
      }

      this.setState({
        oHour: checkTime(oHour),
        oMin: checkTime(oMin),
        oSec: checkTime(oSec),
      })
    }
    countDown()
    this.countDown = setInterval(countDown, 1000)
  }
  componentWillReceiveProps = nextProps => {
    const {
      app: { userInfo },
      redPacket: { sharePacket, packet },
    } = nextProps

    const { redPacket, app } = this.props

    if (
      packet &&
      (redPacket.packet !== packet ||
        redPacket.sharePacket !== sharePacket ||
        app.userInfo !== userInfo)
    ) {
      this.checkPacket({
        sharePacket,
        packet,
        userInfo,
      })
    }
  }

  render() {
    const {
      oHour,
      oMin,
      oSec,
      showStatus,
      isMoneyMove,
      shareTimes,
      pickBtnDisabled,
    } = this.state

    const {
      position,
      icon,
      app: { userInfo },
      redPacket: { packet, sharePacket },
    } = this.props

    const { recordView, detailViews, assistRecords } = packet || {}

    return (
      <View className="red-packet">
        <View
          className={
            !recordView.packetNo && recordView.status === 2
              ? ['open-container']
              : ['open-container', 'scale']
          }
          style={{
            left: position.left || 'unset',
            right: position.right || 'unset',
            top: position.top || 'unset',
            bottom: position.bottom || 'unset',
          }}
        >
          {userInfo && (
            <Button className="custom img-button packet-bg" onClick={this.openPacket.bind(this)}>
              <Image src={icon} />
            </Button>
          )}
          {detailViews &&
            detailViews.length > 0 && (
              <View className="num-tip">
                <View>{detailViews.length}</View>
              </View>
            )}
          {!userInfo && (
            <Button
              data-type={SHOW_PACKET}
              className="custom img-button packet-bg"
              openType="getUserInfo"
              onGetUserInfo="getUserInfo"
            >
              <Image src={icon} />
            </Button>
          )}

        </View>
        {showStatus !== NONE && (
          <View className="packet" catchtouchmove="preventD">
            <View className="bg" />
            {showStatus !== ASSIST_PACKET && (
              <View className="close-bg" onClick={this.closePacket.bind(this)} />
            )}
            <View className="light">
              <Image src="../../asset/images/ic_light@2x.png" />
            </View>
            {showStatus === SHOW_PACKET && (
              <View className="bag init">
                <Text className="top-tip">送你3个现金红包 ↓↓↓</Text>
                <View className="main">
                  <View className="close" onClick={this.closePacket.bind(this)}>
                    <Image src="../../asset/images/ic_close@2x.png" />
                  </View>
                  <Image className="main-bg" src="../../asset/images/ic_redpocket2@2x.png" mode="widthFix"/>
                  <View className="tip">
                    邀请<Text>3个</Text>好友，你可获得<Text>3个</Text>红包，最高可得<Text>88元！</Text>
                  </View>
                  <View className="head">
                    <View className="item">
                      <Image
                        src={(assistRecords[0] && assistRecords[0].astAvatarUrl) || '../../asset/images/ic_q@2x.png'}
                        mode="widthFix"/>
                      <Text>{(assistRecords[0] && assistRecords[0].astName) || ''}</Text>
                    </View>
                    <View className="item">
                      <Image
                        src={(assistRecords[1] && assistRecords[1].astAvatarUrl) || '../../asset/images/ic_q@2x.png'}
                        mode="widthFix"/>
                      <Text>{(assistRecords[1] && assistRecords[1].astName) || ''}</Text>
                    </View>
                    <View className="item">
                      <Image
                        src={(assistRecords[2] && assistRecords[2].astAvatarUrl) || '../../asset/images/ic_q@2x.png'}
                        mode="widthFix"/>
                      <Text>{(assistRecords[2] && assistRecords[2].astName) || ''}</Text>
                    </View>
                  </View>
                  <View className="time">
                    <View className="item">
                      <View className="date">{oHour}</View>
                      时
                    </View>
                    <View className="item">
                      <View className="date">{oMin}</View>
                      分
                    </View>
                    <View className="item">
                      <View className="date">{oSec}</View>
                      秒后过期
                    </View>
                  </View>
                  <Button className="custom" openType="share" data-type="help">
                    邀请好友帮我开红包
                  </Button>
                </View>
              </View>
            )}
            {showStatus === PICK_PACKET && (
              <View className="bag pick">
                <View className="main">
                  <View className="close" onClick={this.closePacket.bind(this)}>
                    <Image src="../../asset/images/ic_close@2x.png"/>
                  </View>
                  <View
                    className={isMoneyMove ? ['pick-money', 'move'] : ['pick-money']}
                    style={{ display: isMoneyMove ? 'block' : 'none' }}
                  >
                    {detailViews[detailViews.length - 1].amount}
                  </View>
                  <Image className="main-bg" src="../../asset/images/ic_redpocket@2x.png" mode="widthFix"/>
                  <View className="avatar">
                    <Image src={detailViews[detailViews.length - 1].asAvatarUrl} />
                  </View>
                  <View className="userName">{detailViews[detailViews.length - 1].assistorName}</View>
                  <View className="desc">给你的助力红包</View>
                  <View className="btn-container">
                    <Button className="custom img-Button" disabled={pickBtnDisabled} onClick={this.pickPacket.bind(this)}>
                      <Image src="../../asset/images/ic_open@2x.png" />
                    </Button>
                    <View className="num-tip">
                      <View>{detailViews.length}</View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {showStatus === SHARE_PACKET && (
              <View className="bag init need-share">
                {recordView.status === 2 && (
                  <Text className="top-tip">今天的红包已领完，明天再来吧</Text>
                )}
                {recordView.status === 1 && shareTimes === 0 && (
                  <Text className="top-tip">今天的红包已领完，明天再来吧</Text>
                )}
                {recordView.status === 1 && shareTimes > 0 && (
                  <Text className="top-tip" style="font-size: 48rpx">今天的红包已领完，明天再来吧</Text>
                )}
                <View className="main">
                  <View className="close" onClick={this.closePacket.bind(this)}>
                    <Image src="../../asset/images/ic_close@2x.png" />
                  </View>
                  <Image
                    className="main-bg"
                    src="../../asset/images/ic_redpocket2@2x.png"
                    mode="widthFix"
                  />
                  {recordView.status === 2 && (
                    <View className="tip">
                      今天的红包已领完啦，明天再来领吧
                    </View>
                  )}
                  {recordView.status === 1 && shareTimes === 0 && (
                    <View className="tip">分享<Text>{shareTotalTimes}篇</Text>文章给朋友，你今天就可以额外再多领<Text>3个</Text>红包，加油</View>
                  )}
                  {recordView.status === 1 && shareTimes > 0 && (
                    <View className="tip">再分享<Text>{shareTotalTimes - shareTimes}篇</Text>给好友看，今天就可以额外再多领<Text>3个</Text>红包
                    </View>
                  )}
                  <Button className="custom" onClick={this.closePacket.bind(this)}>
                    {(recordView.status === 1 && shareTimes === 0) ? '分享8篇文章给好友' : '好的'}
                  </Button>
                </View>
              </View>
            )}

            {showStatus === ASSIST_PACKET && (
              <View className="bag assist">
                <View className="main">
                  <View className="close" onClick={this.closePacket.bind(this)}>
                    <Image src="../../asset/images/ic_close@2x.png"/>
                  </View>
                  <Image className="main-bg" src="../../asset/images/ic_redpocket@2x.png" mode="widthFix"/>
                  <View className="avatar">
                    <Image src={decodeURIComponent(sharePacket.avatar)} />
                  </View>
                  <View className="userName">{sharePacket.userName}</View>
                  <View className="desc">帮我开下红包</View>
                  <View className="btn-container">
                    {userInfo && (
                      <Button
                        className="custom img-Button"
                        onClick={this.assistPacket.bind(this)}>
                        <Image src="../../asset/images/ic_help@2x.png"/>
                      </Button>
                    )}
                    {!userInfo && (
                      <Button
                        className="custom img-Button"
                        openType="getUserInfo"
                        onGetUserInfo={this.getUserInfo.bind(this)}
                        data-type={ASSIST_PACKET}
                      >
                        <Image src="../../asset/images/ic_help@2x.png"/>
                      </Button>
                    )}
                  </View>
                </View>
              </View>
            )}

            {showStatus === ASSIST_SUCCESS && (
              <View className="bag init assist-success">
                <Text className="top-tip">恭喜你帮开成功</Text>
                <View className="main">
                  <View className="close" onClick={this.closePacket.bind(this)}>
                    <Image src="../../asset/images/ic_close@2x.png" />
                  </View>
                  <Image
                    className="main-bg"
                    src="../../asset/images/ic_redpocket_ok@2x.png"
                    mode="widthFix"
                  />
                  <View className="success-tip">
                    <Image src={decodeURIComponent(sharePacket.avatar)} />
                    <Text>送你3个现金红包</Text>
                  </View>
                  <View className="tip">
                    邀请<Text>3个</Text>好友，你可获得<Text>3个</Text>红包，最高可得<Text>88元！</Text>
                  </View>
                  <Button className="custom" openType="share" data-type="assist">
                    邀请好友帮我开红包
                  </Button>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}
