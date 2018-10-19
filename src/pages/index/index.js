import { View, Form, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import action from '../../utils/action'
import { Loading } from '../../components'
import pageWithData from '../../common/PageWithData'
import ListItem from './ListItem'
import TitleShareImage from '../../asset/images/img-title-share.png'
import './index.scss'

@pageWithData('home')
@connect(({ home, user }) => ({
  home,
  userInfo: user.userInfo,
}))
export default class extends PureComponent {
  config = {
    enablePullDownRefresh: true,
    navigationBarTitleText: '商品列表',
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(this.mappingAction('loadMore'))
  }
  onPullDownRefresh = () => {
    const { dispatch } = this.props
    dispatch(this.mappingAction('list')).then(_ => {
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
      loading,
    } = this.props

    return (
      <block>
        <View className="top-title">
          <View className="title">精选福利</View>
          <View className="right-bar"><Image src={TitleShareImage} /></View>
        </View>
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <View className="products">
            {list &&
              list.map(item => (
                <Form
                  key={item.pid}
                  onSubmit={this.reportForm.bind(this)}
                  reportSubmit
                  data-id={item.pid}
                >
                  <Button className="custom" formType="submit">
                    <ListItem data={item} />
                  </Button>
                </Form>
              ))}
          </View>
        )}
        {isLoadMore && <Loading height="150rpx" />}
      </block>
    )
  }
}
