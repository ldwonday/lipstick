import { View, Tabbar, TabbarContainer, TabbarPanel } from '@tarojs/components';
import TaroRouter from '@tarojs/router';
import Taro from '@tarojs/taro-h5';
import { Component } from "@tarojs/taro-h5";
import Nerv from "nervjs";
import { Provider } from "@tarojs/redux-h5";
import '@tarojs/async-await';

import dva from './dva';
import models from './model';
import action from './utils/action';
import './app.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    dispatch(action('sys/error', e));
  }
});
const store = dvaApp.getStore();

class App extends Component {
  state = {
    __tabs: {
      backgroundColor: '#fff',
      selectedColor: '#FF5C21',
      color: '#999',
      list: [{
        pagePath: 'pages/index/index',
        text: '首页',
        "iconPath": require("././asset/images/ic_shop_normal@2x.png"),
        "selectedIconPath": require("././asset/images/ic_shop_pressed@2x.png")
      }, {
        pagePath: 'pages/mine/index',
        text: '我的',
        "iconPath": require("././asset/images/ic_my_normal@2x.png"),
        "selectedIconPath": require("././asset/images/ic_my_pressed@2x.png")
      }]
    }
  };


  componentDidMount = () => {
    dvaApp.dispatch(action('app/init'));
  };

  render() {
    return <Provider store={store}>
                
                <TabbarContainer>
                  <TabbarPanel>
                    <TaroRouter.Router />
                  </TabbarPanel>
                  <Tabbar conf={this.state.__tabs} homePage="pages/index/index" router={Taro} />
                </TabbarContainer>
              </Provider>;
  }

  componentWillMount() {
    Taro.initTabBarApis(this, Taro);
  }

}

Taro.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});
TaroRouter.initRouter([["/pages/index/index", () => import( /* webpackChunkName: "index_index" */"./pages/index/index")], ["/pages/detail/index", () => import( /* webpackChunkName: "detail_index" */"./pages/detail/index")], ["/pages/paySuccess/index", () => import( /* webpackChunkName: "paySuccess_index" */"./pages/paySuccess/index")], ["/pages/call/index", () => import( /* webpackChunkName: "call_index" */"./pages/call/index")], ["/pages/share/index", () => import( /* webpackChunkName: "share_index" */"./pages/share/index")], ["/pages/mine/index", () => import( /* webpackChunkName: "mine_index" */"./pages/mine/index")], ["/pages/mine/order/index", () => import( /* webpackChunkName: "mine_order_index" */"./pages/mine/order/index")]], Taro);
Nerv.render(dvaApp.start(<App />), document.getElementById('app'));