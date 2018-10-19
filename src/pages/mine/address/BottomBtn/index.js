import { View, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { setStorageEditAddress } from '../../../../utils'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  handleEdit() {
    setStorageEditAddress(this.props.data)
    this.props.onEdit()
  }
  render() {
    const { btnText, onBtnClick } = this.props
    return (
      <View className="add-btn" onClick={onBtnClick}>
        <Text>{btnText}</Text>
      </View>
    )
  }
}
