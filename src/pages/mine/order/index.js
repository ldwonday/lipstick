import { View, ScrollView, Button, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { Loading } from '../../../components'
import OrderItem from './OrderItem'
import Tab from './Tab'
import action from '../../../utils/action'
import config from '../../../config'
import './index.scss'

const effectName = name => `order/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ order }) => ({
  order,
}))
export default class extends PureComponent {
  config = {
    enablePullDownRefresh: true,
  }
  state = {
    loading: true,
    current: 0,
    tabList: [{ title: '未完成', key: 0 }, { title: '已完成', key: 1 }],
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
    dispatch(mappingAction('loadMore', this.state.current))
  }
  onPullDownRefresh = () => {
    const { dispatch } = this.props
    dispatch(mappingAction('init')).then(_ => {
      Taro.stopPullDownRefresh()
    })
  }
  handleClick(index) {
    this.setState({
      current: index,
    })
  }
  handleIndex() {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  reportForm(e) {
    const { id } = e.currentTarget.dataset
    const url = `/pages/call/index?recordNo=${id}&notShowHome=1`
    Taro.navigateTo({ url })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const {
      order: { finished, notFinish },
    } = this.props

    const { tabList, current, loading } = this.state

    return (
      <View className="order">
        <Tab current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          {loading ? (
            <Loading height="80vh" />
          ) : (
            tabList.map(item => {
              return (
                item.key === current && (
                  <block key={item.key}>
                    {item.key === 1 &&
                      finished.items.length > 0 && (
                        <ScrollView scrollY onScrollToLower={this.onReachBottom}>
                          {finished.items.map((cur, index) => (
                            <Form
                              key={cur.recordNo}
                              onSubmit={this.reportForm.bind(this)}
                              reportSubmit
                              data-id={cur.recordNo}
                            >
                              <Button className="custom" formType="submit">
                                <OrderItem data={cur} />
                              </Button>
                            </Form>
                          ))}
                        </ScrollView>
                      )}
                    {item.key === 1 &&
                      finished.items.length === 0 && <View className="no-data">暂无数据</View>}

                    {item.key === 0 &&
                      notFinish.items.length > 0 && (
                        <ScrollView scrollY onScrollToLower={this.onReachBottom}>
                          {notFinish.items.map((cur, index) => (
                            <Form
                              key={cur.recordNo}
                              onSubmit={this.reportForm.bind(this)}
                              reportSubmit
                              data-id={cur.recordNo}
                            >
                              <Button className="custom" formType="submit">
                                <OrderItem data={cur} />
                              </Button>
                            </Form>
                          ))}
                        </ScrollView>
                      )}
                    {item.key === 0 &&
                      notFinish.items.length === 0 && <View className="no-data">暂无数据</View>}
                  </block>
              ))
            })
          )}
        </Tab>
        <View className="more" onClick={this.handleIndex.bind(this)}>
          发现更多商品
        </View>
      </View>
    )
  }
}
