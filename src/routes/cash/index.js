import { View, Image, Button, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import action from '../../utils/action'
import { TopBar, Container, Loading } from '../../components'
import './index.scss'

const effectName = name => `cash/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ cash, user, loading }) => ({
  ...cash,
  ...user,
  isLoading: loading.effects['cash/init'],
  isLoadMore: loading.effects[effectName('loadMore')],
}))
export default class extends Component {
  componentDidMount = async () => {
    this.props.dispatch(mappingAction('init'))
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(mappingAction('loadMore'))
  }
  onShareAppMessage = Taro.getApp().shareMessage
  async formSubmit(e) {
    const formId = e.detail.formId
    this.props.dispatch(
      mappingAction('withDraw', {
        formId,
        amount: this.props.balance,
      })
    )
  }
  render() {
    const { isLoading, list, balance, withdrawAmount } = this.props
    return (
      <View>
        <TopBar isShowBack />
        <Container>
          {isLoading ? (
            <Loading height="calc(100vh - 90rpx)" content="加载中..." />
          ) : (
            <block>
              <View className="top">
                <Image src="../../asset/images/ic_coin@2x.png" />
                <View className="balance">余额</View>
                <View className="amount">￥{balance}</View>
                <Form onSubmit={this.formSubmit.bind(this)} reportSubmit>
                  <Button disabled={balance < withdrawAmount} formType="submit" type="primary">
                    确定提现
                  </Button>
                </Form>
                <View className="tip">
                  满{withdrawAmount}元可提现
                </View>
              </View>
              <View className="detail">明细记录</View>
              <View className="list">
                {list &&
                  list.map((item, index) => {
                    return (
                      <View className="item" key={index}>
                        <View className="left">
                          <Image src={item.asAvatarUrl} />
                        </View>
                        <View className="right">
                          <View className="main">
                            <View className="title">{item.assistorName}</View>
                            <View className="time">{item.assistDate}</View>
                          </View>
                          <View className="money">+{item.amount}</View>
                        </View>
                      </View>
                    )
                  })}
              </View>
            </block>
          )}
        </Container>
      </View>
    )
  }
}
