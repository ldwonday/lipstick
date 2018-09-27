import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import action from '../../utils/action'
import { Card, Loading } from '../../components'
import ProductItem from './ProductItem'
import './index.scss'

const effectName = name => `home/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ home, user, loading }) => ({
  home,
  userInfo: user.userInfo,
  isLoad: loading.effects[effectName('list')],
  isLoadMore: loading.effects[effectName('loadMore')],
}))
export default class extends PureComponent {
  static defaultProps = {
    isLoad: true,
  }
  config = {
    enablePullDownRefresh: true,
  }
  componentDidMount = () => {
    this.props.dispatch(mappingAction('list'))
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(mappingAction('loadMore'))
  }
  onPullDownRefresh = () => {
    const { dispatch } = this.props
    dispatch(mappingAction('list')).then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  onShareAppMessage = e => {
    const info = this.props.userInfo
    return {
      title: `${(info && info.nickName) || ''}邀你一起免费拿福利`,
      path: `/pages/index/index`,
    }
  }
  reportForm(e) {
    const { id } = e.currentTarget.dataset
    const url = `/pages/detail/index?id=${id}&page=${this.props.article.page}`
    Taro.navigateTo({ url })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const {
      isLoad,
      isLoadMore,
      home: { list },
    } = this.props

    return (
      <block>
        <Card title="精选福利">
          {isLoad ? (
            <Loading height="70vh" />
          ) : (
            <block>
              {list &&
                list.map(item => (
                  <ProductItem
                    key={item.pid}
                    data={item}
                    to={`/pages/detail/index?id=${item.pid}`}
                  />
                ))}
            </block>
          )}
          {isLoadMore && <Loading height="100rpx" />}
        </Card>
        <View className="tip">更多福利 每周更新^_^</View>
      </block>
    )
  }
}
