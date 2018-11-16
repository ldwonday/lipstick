import Taro from '@tarojs/taro-h5';
import { WebView } from '@tarojs/components';
import Nerv, { PureComponent } from "nervjs";
import './index.scss';

export default class extends PureComponent {
  render() {
    const { url } = this.$router.params;

    return <WebView src={decodeURIComponent(url) + '#wechat_redirect'} />;
  }
}