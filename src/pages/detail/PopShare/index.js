import { View, Image, Text, Button } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../../components'
import BtnImage from '../../../asset/images/btn-sharenow.png'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { isShow, onClose } = this.props
    return (
      isShow && (
        <View className="pop-share">
          <View className="bg" onClick={onClose} />
          <View className="inner">
            <View className="close" onClick={onClose}>
              <Iconfont size={28} color="#4A4A4A" type="close" />
            </View>
            <View className="title">
              每邀请一位好友购买商品你都将获得<Text>100元</Text>奖励
            </View>
            <Button className="custom btn-share" openType="share" onClick={onClose}>
              <Image src={BtnImage} />
            </Button>
          </View>
        </View>
      )
    )
  }
}
