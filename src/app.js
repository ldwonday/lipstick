import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import Index from './pages/index'
import dva from './dva'
import models from './model'
import action from './utils/action'
import './app.scss'
import {
  showModal,
  getStorageSyncLoginResult,
  getStorageSynctUserInfo,
  hideWxLoading,
  showWxLoading,
} from './utils'
import { AUTHORIZE_REJECT } from './utils/constant'

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
      'pages/cash/index',
      'pages/favourites/index',
      'pages/survey/index',
      'pages/survey/detail/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#dd312f',
      navigationBarTitleText: '每天趣闻',
      navigationBarTextStyle: 'white',
    },
    plugins: {
      tencentvideo: {
        version: '1.1.8',
        provider: 'wxa75efa648b60994b',
      },
    },
  }

  byGetUserInfo = (e, cb) => {
    showWxLoading()
    let userInfo = e.detail.userInfo
    if (userInfo) {
      dvaApp.dispatch(action('app/saveUser')).then(_ => {
        cb && cb()
      })
    } else {
      hideWxLoading()
    }
  }

  shareMessage = cb => {
    let title = ''
    const userInfo = getStorageSynctUserInfo()
    if (userInfo && userInfo.nickName) {
      title = `${userInfo.nickName || ''}@你，点开看点开看↓↓↓`
    } else {
      title = '@所有人，点开看点开看↓↓↓'
    }

    const loginResult = getStorageSyncLoginResult()
    const path = `/pages/index/index${(loginResult && loginResult.shareCode) ? `?shareCode=${loginResult.shareCode}` : ''}`
    console.log(path)
    return {
      title,
      path,
      success: cb || (() => {}),
    }
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
