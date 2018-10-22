import { View, Text, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../../../components'
import BottomBtn from '../BottomBtn'
import pageWithData from '../../../../common/PageWithData'
import { setStorageEditAddress, getStorageEditAddress } from '../../../../utils'
import './index.scss'

@pageWithData('addressEdit')
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '我的地址',
  }
  state = {
    detail: {},
  }
  async componentDidMount() {
    const res = await getStorageEditAddress()
    this.setState({
      detail: res.data || {},
    })
  }
  componentWillUnmount() {
    setStorageEditAddress(null)
  }
  handleSave() {
    this.props.dispatch(this.mappingAction('addOrUpdate', this.state.detail))
  }
  handleRegionChange(e) {
    const [province, city, region] = e.detail.value
    this.setState({
      detail: {
        ...this.state.detail,
        province,
        city,
        region,
      },
    })
  }
  handleChange(type, e) {
    this.setState({
      detail: {
        ...this.state.detail,
        [type]: e.detail.value,
      },
    })
  }
  render() {
    const {
      detail: { name, phone, province, city, region, address },
    } = this.state

    return (
      <View className="address-edit">
        <View className="item">
          <View className="label">收货人</View>
          <View className="content">
            <Input
              placeholder="请填写收货人姓名"
              onInput={this.handleChange.bind(this, 'name')}
              value={name}
              placeholderClass="placeholder"
            />
          </View>
        </View>
        <View className="line1px" />
        <View className="item">
          <View className="label">手机号码</View>
          <View className="content">
            <Text className="pre">+86</Text>
            <Input
              maxLength={11}
              placeholder="请输入号码"
              value={phone}
              onInput={this.handleChange.bind(this, 'phone')}
              placeholderClass="placeholder"
            />
          </View>
        </View>
        <View className="line1px" />
        <View className="item">
          <View className="label">所在地区</View>
          <View className="content">
            <Picker
              mode="region"
              value={[province, city, region]}
              onChange={this.handleRegionChange.bind(this)}
            >
              {!province && (
                <View className="picker-placeholder">请选择<Iconfont type="previewright" color="#888" size={30} /></View>
              )}
              {province && <View>{`${province} ${city} ${region}`}</View>}
            </Picker>
          </View>
        </View>
        <View className="line1px" />
        <View className="item">
          <View className="label">详细地址</View>
          <View className="content">
            <Textarea
              placeholder="街道、小区、楼牌号等"
              value={address}
              autoHeight
              onInput={this.handleChange.bind(this, 'address')}
              placeholderClass="placeholder"
            />
          </View>
        </View>
        <BottomBtn btnText="保存" onBtnClick={this.handleSave} />
      </View>
    )
  }
}
