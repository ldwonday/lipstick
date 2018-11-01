import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import { Loading, Empty } from '../../../../components'
import { formatDate } from '../../../../utils/timeFormat'
import EmptyImage from '../../../../asset/images/img-emptydetail.png'
import './index.scss'
import pageWithData from '../../../../common/PageWithData'

@pageWithData('profitDetail')
@connect(({ profitDetail }) => ({
  ...profitDetail,
}))
export default class extends PureComponent {
  config = {
    navigationBarTitleText: '收益明细',
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(this.mappingAction('loadMore'))
  }
  render() {
    const { list, loading } = this.props

    const newList = {}
    list.forEach(item => {
      const title = formatDate(item.createdAt, 'yyyy年MM月')
      if (!newList[title]) {
        newList[title] = []
      }
      newList[title].push(item)
    })

    const titleList = Object.keys(newList)

    return (
      <View className="profit-detail">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            {titleList.length === 0 && (
              <Empty image={EmptyImage} tip="暂无收支明细" desc="好友助力，分享有赏！" />
            )}
            {titleList &&
              titleList.length > 0 &&
              titleList.map(item => {
                return (
                  <block key={item}>
                    <View slot="title" className="title">{item}</View>
                    <View slot="content">
                      {newList[item] &&
                        newList[item].map(i => {
                          const { itemName, type, amount, createdAt } = i
                          return (
                            <block key={i}>
                              <View className="item">
                                <View className="top">
                                  <View className="desc">{itemName}</View>
                                  <View className={`amount${type === 2 ? '' : ' add'}`}>{`${type === 2 ? '-' : '+'}`}{amount}</View>
                                </View>
                                <View className="bottom">{formatDate(createdAt)}</View>
                              </View>
                              <View className="line1px" />
                            </block>
                          )
                        })}
                    </View>
                  </block>
                )
              })}
          </block>
        )}
      </View>
    )
  }
}
