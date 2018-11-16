import Taro from '@tarojs/taro-h5';
import Nerv, { PureComponent } from "nervjs";
import { View, Text, Image, Button, Form } from '@tarojs/components';
import { connect } from "@tarojs/redux-h5";
import { formatPrice } from '../../../utils';
import { formatDate } from '../../../utils/timeFormat';
import pageWithData from '../../../common/PageWithData';
import { Loading } from '../../../components';
import action from '../../../utils/action';
import emptyImage from '../../../asset/images/empty_order_list.png';
import './index.scss';

export default @pageWithData('order')
@connect(({ order }) => ({
  ...order
}))
class extends PureComponent {
  config = {
    enablePullDownRefresh: true
  };
  onReachBottom() {
    const { dispatch } = this.props;
    dispatch(this.mappingAction('loadMore'));
  }
  onPullDownRefresh() {
    const { dispatch } = this.props;
    dispatch(this.mappingAction('init')).then(_ => {
      Taro.stopPullDownRefresh();
    });
  }
  saveFormID(e) {
    this.props.dispatch(action('app/submitForm', e.detail.formId));
  }
  backHome() {
    Taro.switchTab({
      url: '/pages/index/index'
    });
  }
  showOrder(orderNo) {
    Taro.navigateTo({
      url: '/pages/mine/order/detail/index?orderNo=' + orderNo
    });
  }
  render() {
    const { list, loading } = this.props;

    return <View className="order">
        {loading ? <Loading height="100vh" /> : <block>
            {list.length > 0 && <View className="body">
                <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                  {list && list.map(item => {
              return <Button onClick={this.showOrder.bind(this, item.orderNo)} className="order" key={item.id} formType={this.saveFormID.bind(this)}>
                          <View className="infomation">
                            <Image className="image" lazyLoad mode="aspectFill" src={item.imageUrl} />
                            <View className="right-part">
                              <Text className="title">{item.productName}</Text>
                              <Text className="original-price">￥{formatPrice(item.salePrice)} 专柜价格</Text>
                              <View className="brand">
                                <Text className="iconfont">{item.brand}</Text>
                                <Text className="quality-goods">正品</Text>
                              </View>
                              <Text className="status">{item.expressStatus === 1 ? '等待申请' : item.expressStatus === 2 ? '待发货' : '已发货'}</Text>
                            </View>
                          </View>
                          <View className="bottom">
                            <Text className="order-id">中奖时间：{formatDate(item.createdAt)}</Text>
                            <Text className="deliver" data-orderid="{{item.tid}}">{item.expressStatus === 1 ? '申请发货' : '订单详情'}</Text>
                          </View>
                          <View className="orderBorder" />
                        </Button>;
            })}
                </Form>
              </View>}
            {list.length === 0 && <View className="empty">
                <Image className="tip-image" src={emptyImage} />
                <Text className="tip-text">您还未中奖，再接再厉</Text>
                <Button onClick={this.backHome.bind(this)} className="tip-button" hoverClass="button-hover">马上赢口红</Button>
              </View>}
          </block>}
      </View>;
  }
}