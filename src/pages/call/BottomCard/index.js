import { View, Text, Button, Form, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import Behaviors from '../../../utils/CommonBehavior'
import { AvatarTip, CardContainer, Iconfont } from '../../../components'
import './index.scss'

export default class extends PureComponent {
  static behaviors = [Behaviors]
  static defaultProps = {
    data: {},
  }
  handleGetUserInfo(e) {
    const { onCallZan, onNewCall, onChangeProduct } = this.props
    const { type } = e.currentTarget.dataset
    this.$scope.saveUserInfo(e.detail.userInfo, () => {
      type === '1' && onCallZan()
      type === '2' && onNewCall()
      type === '3' && onChangeProduct()
    })
  }
  render() {
    const {
      userInfo,
      data: { images, avatarUrl, hasNum, needNum, self, called },
      onSharePYQ,
      onCallZan,
      onNewCall,
      onChangeProduct,
      onReportForm,
    } = this.props

    return (
      <CardContainer className="card-call">
        <View className="top">
          <AvatarTip avatarUrl={avatarUrl}>
            {self &&
              hasNum === 0 && (
                <block>
                  <Text className="red-text">{needNum}</Text>
                  个好友点赞就可以免费领商品啦^_^
                </block>
              )}
            {self &&
              hasNum !== 0 &&
              hasNum < needNum && (
                <block>
                  还差
                  <Text className="red-text">{needNum - hasNum}</Text>
                  个赞就可以免费领商品了，加油
                </block>
              )}
            {self && hasNum === needNum && <block>恭喜你，集赞成功！立刻去兑换商品吧</block>}

            {!self && hasNum === needNum && <block>我已完成集赞免费领商品啦，你也快去发起吧</block>}

            {!self &&
              hasNum < needNum &&
              called && <block>谢谢你帮我点赞，你也发起一个免费领商品吧^_^</block>}

            {!self &&
              hasNum < needNum &&
              !called && (
                <block>
                  还差
                  <Text style={{ color: '#FF5C21' }}>{needNum - hasNum}</Text>
                  个赞就可以免费领商品了，求助攻
                </block>
              )}
          </AvatarTip>
          <Form
            onSubmit={onReportForm}
            reportSubmit
          >
            <View className="btn-group">
              {self &&
                hasNum < needNum && (
                  <block>
                    <Button className="custom" openType="share" formType="submit">
                      分享给好友
                    </Button>
                    <Button className="custom white" formType="submit" onClick={onSharePYQ}>
                      分享到朋友圈
                    </Button>
                  </block>
                )}
              {self &&
                hasNum === needNum && (
                  <block>
                    {userInfo && (
                      <Button className="custom" formType="submit" onClick={onChangeProduct}>
                        兑换商品
                      </Button>
                    )}
                    {!userInfo && (
                      <Button
                        openType="getUserInfo"
                        className="custom"
                        formType="submit"
                        onGetUserInfo={this.handleGetUserInfo.bind(this)}
                        data-type="3"
                      >
                        兑换商品
                      </Button>
                    )}
                  </block>
                )}
              {!self &&
                !called &&
                hasNum < needNum && (
                  <block>
                    {userInfo && (
                      <Button className="custom f zan" formType="submit" onClick={onCallZan}>
                        <Iconfont type="ic_like" size={48} />
                        为TA点赞
                      </Button>
                    )}
                    {!userInfo && (
                      <Button
                        className="custom f"
                        formType="submit"
                        openType="getUserInfo"
                        onGetUserInfo={this.handleGetUserInfo.bind(this)}
                        data-type="1"
                      >
                        <Iconfont type="ic_like" size={46} />
                        为TA点赞
                      </Button>
                    )}
                  </block>
                )}
              {!self &&
                (called || hasNum === needNum) && (
                  <block>
                    {userInfo && (
                      <Button formType="submit" className="custom" onClick={onNewCall}>
                        我也要发起
                        {hasNum === needNum ? ' 免费领商品' : ''}
                      </Button>
                    )}
                    {!userInfo && (
                      <Button
                        openType="getUserInfo"
                        formType="submit"
                        onGetUserInfo={this.handleGetUserInfo.bind(this)}
                        className="custom"
                        data-type="2"
                      >
                        我也要发起
                      </Button>
                    )}
                    {hasNum < needNum && (
                      <Button formType="submit" className="custom white" openType="share">
                        帮TA分享
                      </Button>
                    )}
                  </block>
                )}
            </View>
          </Form>
          {self && hasNum === 0 && <View className="tip">立刻分享给好友帮你点赞吧</View>}
          {((self && hasNum !== 0 && (hasNum < needNum || hasNum === needNum)) ||
            (!self && (hasNum === needNum || called))) && (
            <View className="tip">
              已有<Text>{hasNum}</Text>人为{self ? '你' : 'TA'}点赞
            </View>
          )}

          {!self && !called && hasNum < needNum && <View className="tip">为TA点赞即可助攻啦～</View>}
        </View>
        <View className="call-list">
          {needNum.map((item, i) => {
            return (
              <View key={i} class="warp">
                {i < hasNum && <Image src={images[i]} />}
              </View>
            )
          })}
        </View>
      </CardContainer>
    )
  }
}
