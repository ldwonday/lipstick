import { View, Button, Text, Image, Form } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import closeBtn from '../../asset/images/close_btn.jpg'
import avatar from '../../asset/images/avatar.png'
import presentColor from '../../asset/images/present_color.png'
import presentGrey from '../../asset/images/present_grey.png'
import './index.scss'

export default class extends PureComponent {
  handleOnTouchMove(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  render() {
    const { isShow, shareList = [], configViews = {}, shareCode, onClose, onSaveForm } = this.props
    console.log(isShow)

    const shareListArray = shareList && shareList.concat(new Array(parseInt(configViews.share_list_num || 6) - shareList.length).fill(''))

    const hasShareLength = (shareList && shareList.filter(item => item.sk_id).length) || 0
    return (
      <block>
        {isShow && (
          <View className="dialog dialog-share" onTouchMove={this.handleOnTouchMove.bind(this)}>
            <View className="dialog-box">
              <Image
                onClick={onClose}
                className="close"
                mode="aspectFill"
                src={closeBtn}
              />
              <Text className="share-title">分享有礼</Text>
              <View className="share-blocks">
                {shareListArray &&
                  shareListArray.map((item, index) => {
                    return (
                      <View className="item" key={index}>
                        <Form onSubmit={onSaveForm} reportSubmit="true">
                          {item.sk_id && (
                            <View className="inner">
                              <Text className="name">{item.user_nickname}</Text>
                              <Image src={item.user_img} className="avatar" />
                              <View className="coin-num active">
                                <Text className="iconfont icon-jinbi" />+{configViews.reward_coin_num}
                              </View>
                              {!item.sk_status && <Button className="grab">领取</Button>}
                              {item.sk_status && <View className="has-grab">已领取</View>}
                            </View>
                          )}
                          {!item.sk_id && (
                            <Button
                              className="inner"
                              openType="share"
                              data-code={shareCode}
                              formType="submit"
                            >
                              <Text className="name">
                                第{index === 0 ? '一' : index === 1 ? '二' : index === 2 ? '三' : index === 3 ? '四' : index === 4 ? '五' : index === 5 ? '六' : ''}个好友</Text>
                              <Image src={avatar} className="avatar" />
                              <View className="coin-num">
                                <Text className="iconfont icon-jinbi" />+{configViews.reward_coin_num}
                              </View>
                              <Button className="share">分享</Button>
                            </Button>
                          )}
                        </Form>
                      </View>
                    )
                  })}
              </View>
              <View className="share-bottom">
                <View className="left">
                  <View className="progress">
                    <View className="inner" style={{ width: `${(hasShareLength / 6) * 100}%` }} />
                    <Text>{hasShareLength}/6</Text>
                  </View>
                  <View className="tip">TA人点击分享，可收获游戏币(每天都可以哟)</View>
                </View>
                <View className="right">
                  <Image src={hasShareLength === 6 ? presentColor : presentGrey} />
                </View>
              </View>
            </View>
          </View>
        )}
      </block>
    )
  }
}
