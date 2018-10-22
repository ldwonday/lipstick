import { View, Image, Form, Button, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont, ProductItem } from '../../../../components'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  reportForm(e) {
    const { id } = e.currentTarget.dataset
    this.props.onDetail(id, e.detail.formId)
  }
  render() {
    const {
      data: { orderNo, status, amount, productName, imageUrl, count },
      onContact,
    } = this.props

    return (
      <View className="order-item">
        <Form
          key={orderNo}
          onSubmit={this.reportForm.bind(this)}
          reportSubmit
          data-id={orderNo}
        >
          <Button className="custom item" formType="submit">
            <ProductItem price={amount} name={productName} image={imageUrl} count={count} />
          </Button>
        </Form>
        <View className="line1px" />
        <View className="bottom">
          <View className="state">
            <Iconfont type={status ? 'gouxuan02' : 'daifukuanb'} size={40} color="#FF4F2A" />
            <Text>{status ? '付款成功' : '待支付'}</Text>
          </View>
          <View className="concat">
            <Button onClick={onContact}>联系卖家</Button>
          </View>
        </View>
      </View>
    )
  }
}
