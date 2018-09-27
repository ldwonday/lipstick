import { View, Button } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { isShow, btnText, btnType = 'red', openType, onClose } = this.props
    return (
      <block>
        {isShow && (
          <View className="custom-modal">
            <View className="bg" onClick={onClose} />
            <View className="inner">
              <View className="content">{this.props.children}</View>
              <View className="button-group">
                <Button openType={openType} className={btnType} onClick={onClose}>
                  {btnText}
                </Button>
              </View>
            </View>
          </View>
        )}
      </block>
    )
  }
}
