import Taro from '@tarojs/taro-h5';
import { View } from '@tarojs/components';
import Nerv, { PureComponent } from "nervjs";
import './index.scss';

export default class extends PureComponent {
  render() {
    return <View className="card-container">{this.props.children}</View>;
  }
}