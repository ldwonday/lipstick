import Taro from '@tarojs/taro-h5';
import { View, Button, Image, Text } from '@tarojs/components';
import Nerv, { PureComponent } from "nervjs";
import './index.scss';

const qrcode = PUB_IMAGE + 'qrcode.jpg';
export default class extends PureComponent {
  tapQRCode() {
    Taro.previewImage({
      urls: [qrcode]
    });
  }
  render() {
    return <View className="body">
        <View className="infomation">
          <Image lazyLoad onClick={this.tapQRCode.bind(this)} className="qrcode" src={qrcode} />
          <Text className="tip">小主们，扫码关注"我要赢口红"微信公众号\r\n
            获取更多口红信息与游戏服务
          </Text>
          <View className="sectionBorder" />
          <Button className="section bar" hoverClass="hover" openType="contact">
            <Text className="title">联系在线客服</Text>
          </Button>
        </View>
      </View>;
  }
}