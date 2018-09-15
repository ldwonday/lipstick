import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { Iconfont } from '../'
import './index.scss'
import action from '../../utils/action'

const effectName = name => `app/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)

@connect(({ app }) => ({
  app,
}))
export default class extends Component {
  close() {
    this.props.dispatch(mappingAction('closeAddTopTip'))
  }
  render() {
    const { app: { isShowTopAddTip } } = this.props
    return isShowTopAddTip && (
      <View className="too-add-tip">
        <View>【添加到我的小程序】，使用更方便</View>
        <Iconfont extra-class="shouzhi" size={54} type="shouzhi" />
        <View onClick={this.close.bind(this)}><Iconfont size={36} type="guanbi" /></View>
      </View>
    )
  }
}
