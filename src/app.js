import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import Index from './pages/index'
import dva from './dva'
import models from './model'
import action from './utils/action'
import './app.scss'

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    dispatch(action('sys/error', e))
  },
})
const store = dvaApp.getStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/detail/index',
      'pages/paySuccess/index',
      'pages/call/index',
      'pages/share/index',
      'pages/mine/index',
      'pages/mine/order/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      backgroundColor: '#fff',
      selectedColor: '#FF5C21',
      color: '#999',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: './asset/images/ic_shop_normal@2x.png',
          selectedIconPath: './asset/images/ic_shop_pressed@2x.png',
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './asset/images/ic_my_normal@2x.png',
          selectedIconPath: './asset/images/ic_my_pressed@2x.png',
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
