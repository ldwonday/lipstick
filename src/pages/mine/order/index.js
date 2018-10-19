import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import pageWithData from '../../../common/PageWithData'
import { Loading, CustomModal } from '../../../components'
import OrderItem from './OrderItem'
import action from '../../../utils/action'
import './index.scss'

@pageWithData('order')
@connect(({ order }) => ({
  ...order,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '我购买的商品',
    enablePullDownRefresh: true,
  }
  state = {
    isShowModal: false,
  }
  onReachBottom() {
    const { dispatch } = this.props
    dispatch(this.mappingAction('loadMore'))
  }
  onPullDownRefresh() {
    const { dispatch } = this.props
    dispatch(this.mappingAction('init')).then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  handleIndex() {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  handleDetail(orderNo, formId) {
    const url = `/pages/order/detail/index?orderNo=${orderNo}`
    Taro.navigateTo({ url })
    this.props.dispatch(action('app/submitForm', formId))
  }
  changeModalState(status) {
    this.setState({
      isShowModal: status,
    })
  }
  render() {
    const { list, loading } = this.props

    const { isShowModal } = this.state

    return (
      <View className="order">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            {list.map(cur => (
              <OrderItem
                key={cur}
                data={cur}
                onContact={this.changeModalState.bind(this, true)}
                onDetail={this.handleDetail.bind(this)}
              />
            ))}
            <CustomModal
              isShow={isShowModal}
              title="温馨提示"
              openType="contact"
              btnText="立刻加微信"
              onClose={this.changeModalState.bind(this, false)}
            >
              <View className="modal-content">
                <Text>进入客服消息回复</Text>
                <Text className="modal-red-text">"微信"</Text>
                <Text>即可获取卖家微信</Text>
              </View>
            </CustomModal>
          </block>
        )}
      </View>
    )
  }
}
