import { View } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../../../components'
import { setStorageEditAddress } from '../../../../utils'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  handleEdit(e) {
    e.stopPropagation()
    setStorageEditAddress(this.props.data)
    this.props.onEdit()
  }
  handleSetDefault(isDefault, e) {
    e.stopPropagation()
    if (!isDefault) {
      this.props.onSetDefault()
    }
  }
  render() {
    const { name, phone, address, province, city, region, isDefault } = this.props.data
    return (
      <View className="address-item" onClick={this.props.onClick}>
        <View className="top">
          <View className="left">
            <View className="default" onClick={this.handleSetDefault.bind(this, isDefault)}>
              {isDefault && <Iconfont type="gouxuan02" size={42} color="#FF312A" />}
              {!isDefault && <Iconfont type="gouxuan01" size={42} color="#9B9B9B" />}
            </View>
            <View className="name">{name}</View>
            <View className="phone">{phone}</View>
          </View>
          <View className="edit" onClick={this.handleEdit.bind(this)}>编辑</View>
        </View>
        <View className="detail">{`${province}${city}${region}${address}`}</View>
      </View>
    )
  }
}
