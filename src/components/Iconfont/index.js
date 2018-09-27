import { PureComponent } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export default class Iconfont extends PureComponent {
  static externalClasses = ['extra-class']
  render() {
    const { size = 1, type = '', color = '#fff' } = this.props
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
