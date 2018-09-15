import { Component } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import _ from 'lodash'
import classNames from 'classnames'
import './index.scss'

export default class Iconfont extends Component {
  static externalClasses = ['extra-class']
  render() {
    const { size = 1, type = '', color } = this.props
    let Size = `${size}rpx`
    const c = classNames('iconfont', `icon-${type}`, 'extra-class')

    const s = {
      fontSize: Size,
      lineHeight: Size,
      minWidth: Size,
      display: 'inline-block',
      color,
    }

    return <Text className={c} style={s} />
  }
}
