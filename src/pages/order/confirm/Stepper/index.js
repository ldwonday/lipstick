import { View, Button, Input } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  state = {
    value: 1,
  }
  componentDidMount() {
    this.setState({
      value: this.props.value || 1,
    })
  }
  handleChange(isAdd) {
    const value = this.state.value
    const newValue = isAdd ? value + 1 : value - 1
    this.setState({
      value: newValue,
    })
    this.props.onChange(newValue)
  }
  render() {
    const { value } = this.state
    const { min = 1, max = 99 } = this.props

    return (
      <View className="stepper">
        <Button className="sub" disabled={value === min} onClick={this.handleChange.bind(this, false)}>-</Button>
        <View className="num">{value}</View>
        <Button className="add" disabled={value === max} onClick={this.handleChange.bind(this, true)}>+</Button>
      </View>
    )
  }
}
