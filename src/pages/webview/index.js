import { WebView } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  render() {
    const { url } = this.$router.params

    return (
      <WebView src={decodeURIComponent(url) + '#wechat_redirect'} />
    )
  }
}
