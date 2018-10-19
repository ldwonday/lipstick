/* global APP_NAME */
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
    console.log(111, e)
  },
})
const store = dvaApp.getStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/detail/index',
      'pages/order/confirm/index',
      'pages/order/detail/index',
      'pages/detail/comment/index',
      'pages/mine/index',
      'pages/mine/order/index',
      'pages/mine/profit/index',
      'pages/mine/profit/detail/index',
      'pages/mine/address/index',
      'pages/mine/address/edit/index',
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
          iconPath: './asset/images/btn-home-default.png',
          selectedIconPath: './asset/images/btn-home-selected.png',
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './asset/images/btn-mine-default.png',
          selectedIconPath: './asset/images/btn-mine-selected.png',
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
