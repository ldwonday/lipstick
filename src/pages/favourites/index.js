import { View, Image, Button, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import config from '../../config'
import action from '../../utils/action'
import { NavBar } from '../../components'
import './index.scss'

const effectName = name => `favourites/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ favourites, user, loading }) => ({
  favourites,
  user,
}))
export default class extends Component {
  componentDidMount = async () => {
    this.props.dispatch(mappingAction('init'))
  }
  onShareAppMessage = e => {
    const { list } = this.props.favourites
    const { id } = e.target.dataset
    if (id) {
      const cur = list.find(item => item.nId === id)
      return {
        title: cur.title,
        path: `/pages/detail/index?id=${id}`,
        imageUrl: cur.cover,
      }
    }
    return Taro.getApp().shareMessage()
  }
  async del(e) {
    const { id } = e.currentTarget.dataset
    this.props.dispatch(mappingAction('remove', id))
  }
  render() {
    const {
      favourites: { list },
      user: { balance },
    } = this.props

    const adId = `adunit-${config.ad.fav}`

    return (
      <block>
        <View className="container">
          <View className="ad">
            <ad unitId={adId} />
          </View>
          {list &&
            list.length > 0 && (
              <View className="content">
                {list.map(item => {
                  return (
                    <View className="list" key={item.nId}>
                      <Navigator
                        openType="navigate"
                        url={'/pages/detail/index?id=' + item.nId + '&page=0'}
                      >
                        <View className="left">
                          <Image src={item.cover} />
                        </View>
                        <View className="right">
                          <View className="top">
                            <View className="title">{item.title}</View>
                            <View className="time">收藏时间：{item.saveTime}</View>
                          </View>
                        </View>
                      </Navigator>
                      <View className="bottom">
                        <Button className="del" onClick={this.del.bind(this)} data-id={item.nId}>删除</Button>
                        <Button className="share" openType="share" data-id={item.nId}>分享</Button>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          {list && list.length === 0 && <View className="nofav">暂无收藏</View>}
          <NavBar />
        </View>
      </block>
    )
  }
}
