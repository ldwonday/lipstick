import Taro from '@tarojs/taro-h5';
import { View, Image } from '@tarojs/components';
import Nerv, { PureComponent } from "nervjs";
import './index.scss';

export default class extends PureComponent {
  render() {
    const { avatarUrl } = this.props;
    return <View className="avatar-tip">
        <Image src={avatarUrl} />
        {this.props.children}
      </View>;
  }
}