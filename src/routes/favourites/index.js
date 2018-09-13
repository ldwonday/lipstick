import { View, Image, Button, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import config from '../../config'
import action from '../../utils/action'
import { TopBar, Container, NavBar } from '../../components'
import './index.scss'

const effectName = name => `favourites/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ favourites, user, loading }) => ({
  ...favourites,
  user,
}))
export default class extends Component {
  componentDidMount = async () => {
    this.props.dispatch(mappingAction('init'))
  }
  onShareAppMessage = e => {
    const { id } = e.target.dataset
    if (id) {
      const cur = this.props.list.find(item => item.nId === id)
      return {
        title: cur.title,
        path: `/routes/detail/index?id=${id}`,
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
      list,
      user: { balance },
    } = this.props

    const adId = `adunit-${config.ad.fav}`

    return (
      <View>
        <TopBar isShowBack={false} balance={balance} />
        <Container>
          <View className="ad">
            <ad unitId={adId} />
          </View>
          <View className="content">
            {list &&
              list.map(item => {
                return (
                  <View className="list" key={item.nId}>
                    <Navigator
                      openType="navigate"
                      url={'/routes/detail/index?id=' + item.nId + '&page=0'}
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
          {list && list.length === 0 && <View className="nofav">暂无收藏</View>}
          <NavBar />
        </Container>
      </View>
    )
  }
}
