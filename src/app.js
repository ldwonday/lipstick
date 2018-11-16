/* global APP_NAME */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import Index from './pages/index'
import dva from './dva'
import models from './model'
import action from './utils/action'
import './app.scss'

if (process.env.TARO_ENV === 'weapp') {
  require('taro-ui/dist/weapp/css/index.css')
} else if (process.env.TARO_ENV === 'h5') {
  require('taro-ui/dist/h5/css/index.css')
}

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    console.log(111, e)
  },
})
const store = dvaApp.getStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/mine/index',
      'pages/mine/service/index',
      'pages/mine/order/index',
      'pages/mine/order/detail/index',
      'pages/webview/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      color: '#909090',
      selectedColor: '#000000',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '开始游戏',
          iconPath: './asset/images/tabs/home.png',
          selectedIconPath: './asset/images/tabs/home-selected.png',
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './asset/images/tabs/me.png',
          selectedIconPath: './asset/images/tabs/me-selected.png',
        },
      ],
    },
  }

  componentDidMount = () => {
    dvaApp.dispatch(action('app/init'))
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(dvaApp.start(<App />), document.getElementById('app'))
