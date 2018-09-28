import { View, Form, Button } from '@tarojs/components'
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
  isLoadMore: loading.effects[effectName('loadMore')],
}))
export default class extends PureComponent {
  state = {
    loading: true,
  }
  config = {
    enablePullDownRefresh: true,
  }
  componentDidMount = () => {
    this.props.dispatch(mappingAction('init')).then(_ => {
      this.setState({
        loading: false,
      })
    })
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
    const url = `/pages/detail/index?id=${id}`
    Taro.navigateTo({ url })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const {
      isLoadMore,
      home: { list },
    } = this.props

    const { loading } = this.state

    return (
      <block>
        <Card title="精选福利">
          {loading ? (
            <Loading height="100vh" />
          ) : (
            <block>
              {list &&
                list.map(item => (
                  <Form
                    key={item.pid}
                    onSubmit={this.reportForm.bind(this)}
                    reportSubmit
                    data-id={item.pid}
                  >
                    <Button className="custom" formType="submit">
                      <ProductItem data={item} />
                    </Button>
                  </Form>
                ))}
            </block>
          )}
          {isLoadMore && <Loading height="150rpx" />}
        </Card>
        {!loading && <View className="tip">更多福利 每周更新^_^</View>}
      </block>
    )
  }
}
