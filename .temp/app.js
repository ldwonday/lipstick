import { Component } from "@tarojs/taro-h5";
/* global APP_NAME */
import Nerv from "nervjs";
import { Provider } from "@tarojs/redux-h5";
import '@tarojs/async-await';

import dva from './dva';
import models from './model';
import action from './utils/action';
import './app.scss';

import { View, Tabbar, TabbarContainer, TabbarPanel } from '@tarojs/components';
import Taro from '@tarojs/taro-h5';
import { Router } from '@tarojs/router';
Taro.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});
{
  require('taro-ui/dist/h5/css/index.css');
}

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    console.log(111, e);
  }
});
const store = dvaApp.getStore();

class App extends Component {
  state = {
    __tabs: {
      color: '#909090',
      selectedColor: '#000000',
      borderStyle: 'black',
      list: [{
        pagePath: 'pages/index/index',
        text: '开始游戏',
        "iconPath": require("././asset/images/tabs/home.png"),
        "selectedIconPath": require("././asset/images/tabs/home-selected.png")
      }, {
        pagePath: 'pages/mine/index',
        text: '我的',
        "iconPath": require("././asset/images/tabs/me.png"),
        "selectedIconPath": require("././asset/images/tabs/me-selected.png")
      }]
    }
  };

  config = {
    pages: ['pages/index/index', 'pages/mine/index', 'pages/mine/service/index', 'pages/mine/order/index', 'pages/mine/order/detail/index', 'pages/webview/index'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'black'
    },
    tabBar: { color: '#909090', selectedColor: '#000000', borderStyle: 'black', list: [{ pagePath: 'pages/index/index', text: '开始游戏', "iconPath": require("././asset/images/tabs/home.png"),
        "selectedIconPath": require("././asset/images/tabs/home-selected.png")
      }, { pagePath: 'pages/mine/index', text: '我的', "iconPath": require("././asset/images/tabs/me.png"),
        "selectedIconPath": require("././asset/images/tabs/me-selected.png")
      }] }
  };

  componentDidMount = () => {
    dvaApp.dispatch(action('app/init'));
  };

  render() {
    return <Provider store={store}>
                
                <TabbarContainer>
                  <TabbarPanel>
                    <Router routes={[['/pages/index/index', require('./pages/index/index').default], ['/pages/mine/index', require('./pages/mine/index').default], ['/pages/mine/service/index', require('./pages/mine/service/index').default], ['/pages/mine/order/index', require('./pages/mine/order/index').default], ['/pages/mine/order/detail/index', require('./pages/mine/order/detail/index').default], ['/pages/webview/index', require('./pages/webview/index').default]]} />
                  </TabbarPanel>
                  <Tabbar conf={this.state.__tabs} homePage="/pages/index/index" router={Taro} />
                </TabbarContainer>
              </Provider>;
  }

  componentWillMount() {
    Taro.initTabBarApis(this, Taro);
  }

}

Nerv.render(dvaApp.start(<App />), document.getElementById('app'));