import Taro from '@tarojs/taro-h5';
import { View } from '@tarojs/components';
import { Component } from "@tarojs/taro-h5";
import Nerv from "nervjs";
import './index.scss';

export default class _TaroComponentClass extends Component {
  switchTab(url) {
    Taro.switchTab({ url });
  }

  navigateTo(url) {
    Taro.navigateTo({ url });
  }

  render() {
    const { title, padding, titleColor } = this.props;
    const s = {
      padding: '20rpx'
    };
    return <View className="card">
        {title ? <View className="header">
            <View className="indicator" />
            <View className="title" style={{ color: titleColor }}>
              {title}
            </View>
          </View> : null}
        <View className="body" style={padding ? s : null}>
          {this.props.children}
        </View>
      </View>;
  }
}