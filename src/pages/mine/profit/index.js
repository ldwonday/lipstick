import { View, Form, Button, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import pageWithData from '../../../common/PageWithData'
import { Loading } from '../../../components'
import './index.scss'

@pageWithData('profit')
@connect(({ profit }) => ({
  ...profit,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '我的收益',
    usingComponents: {
      'van-notify': '../../../components/vant-weapp/dist/notify/index',
    },
  }
  state = {
    amount: '',
  }
  handleCashAll() {
    this.setState({
      amount: this.props.balance,
    })
  }
  handleInput(e) {
    this.setState({
      amount: e.detail.value,
    })
  }
  handleFormSubmit(e) {
    const { amount } = e.detail.value
    const formId = e.detail.formId
    this.props.dispatch(this.mappingAction('withdraw', { amount, formId }))
  }
  handleGoDetail() {
    Taro.navigateTo({
      url: '/pages/mine/profit/detail/index',
    })
  }
  render() {
    const { balance, loading } = this.props
    const { amount } = this.state

    return (
      <View className="profit">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            <View className="top">
              <View className="left">
                <View>账户余额</View>
                <View className="balance">￥{balance}</View>
              </View>
              <Button className="right" onClick={this.handleGoDetail}>收支明细</Button>
            </View>
            <View className="bottom">
              <View className="title">提款金额</View>
              <Form onSubmit={this.handleFormSubmit.bind(this)} reportSubmit>
                <View className="center">
                  <View className="c-top">
                    <View className="unit">￥</View>
                    <Input
                      placeholder="点击输入提款金额"
                      placeholderClass="placeholder"
                      value={amount}
                      name="amount"
                      type="number"
                      onInput={this.handleInput.bind(this)}
                      maxLength={5}
                    />
                    <View className="all" onClick={this.handleCashAll.bind(this)}>
                      全部提现
                    </View>
                  </View>
                  <View className="tip">提现到微信钱包，1-5个工作日到账</View>
                </View>
                <Button formType="submit" className="red">
                  立即提现
                </Button>
              </Form>
            </View>
            <van-notify id="custom-selector" />
          </block>
        )}
      </View>
    )
  }
}
