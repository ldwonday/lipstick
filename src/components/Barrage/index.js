import { View, Image, Text } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  state = {
    curIndex: 0,
    anim: null,
  }
  animation = null
  componentDidMount = () => {
    this.animation = Taro.createAnimation()
    this.animationFun()
    this.timer = setInterval(() => {
      this.animationFun()
    }, 4000)
  }
  componentWillUnmount = () => {
    this.timer && clearInterval(this.timer)
  }
  animationFun() {
    const { curIndex } = this.state
    const { data = [] } = this.props
    let index = curIndex === data.length - 1 ? 0 : curIndex
    this.animation
      .opacity(0)
      .translateY(5)
      .step({ duration: 0 })
    this.setState(
      {
        anim: this.animation.export(),
        curIndex: ++index,
      },
      () => {
        setTimeout(() => {
          this.animation
            .opacity(1)
            .translateY(0)
            .step({ duration: 500, timingFunction: 'linear' })
          this.setState({
            anim: this.animation.export(),
          })
        })
        setTimeout(() => {
          this.animation
            .opacity(0)
            .translateY(-5)
            .step({ duration: 500, timingFunction: 'linear' })
          this.setState({
            anim: this.animation.export(),
          })
        }, 3000)
      }
    )
  }
  render() {
    const { anim, curIndex } = this.state
    const { data = [], position = { left: '10rpx', top: '30rpx' } } = this.props
    return (
      <View className="barrage" style={position} animation={anim}>
        {data.map((item, i) => {
          const { image, nickName, text } = item
          return (
            curIndex === i && (
              <View className="item" key={i}>
                <View className="head">
                  <Image src={image} />
                </View>
                <View className="content">
                  <Text>{nickName}</Text>
                  <Text>{text}集赞成功</Text>
                </View>
              </View>
            )
          )
        })}
      </View>
    )
  }
}
