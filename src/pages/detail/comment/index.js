import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { Loading } from '../../../components'
import MessageItem from '../MessageItem'
import './index.scss'
import pageWithData from '../../../common/PageWithData'

@pageWithData('comment')
@connect(({ comment }) => ({
  ...comment,
}))
export default class extends PureComponent {
  config = {
    enablePullDownRefresh: true,
    navigationBarTitleText: '商品评价',
  }
  onPullDownRefresh = () => {
    this.props.dispatch(this.mappingAction('init', this.$router.params)).then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(this.mappingAction('loadMore'))
  }
  render() {
    const { loading, list, isLoadMore } = this.props

    return (
      <View>
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <View className="comments">
            {list.map(item => (
              <block>
                <View className="line1px" />
                <MessageItem key={item} data={item} />
              </block>
            ))}
            {isLoadMore && <Loading height="150rpx" />}
          </View>
        )}
      </View>
    )
  }
}
