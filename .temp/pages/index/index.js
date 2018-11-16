import Taro from '@tarojs/taro-h5';
import { View, Form, Button, Image, Text, OfficialAccount } from '@tarojs/components';
import { connect } from "@tarojs/redux-h5";
import Nerv, { PureComponent } from "nervjs";
import action from '../../utils/action';
import Behaviors from '../../utils/CommonBehavior';
import { Loading, ModalShare } from '../../components';
import pageWithData from '../../common/PageWithData';
import { formatCoin, formatPrice, isAndroid } from '../../utils';
import outStock from '../../asset/images/out_stock.png';
import lessCoins from '../../asset/images/less_coins.png';
import closeBtn from '../../asset/images/close_btn.jpg';
import presentShare from '../../asset/images/present_share.png';
import myTip from '../../asset/images/my-tip.png';
import './index.scss';

let scrollerTimer;

export default @pageWithData('home')
@connect(({ app, home, user }) => ({
  ...app,
  ...home,
  ...user
}))
class extends PureComponent {
  config = {
    enablePullDownRefresh: true
  };
  static behaviors = [Behaviors];
  state = {
    inspirationalTip: '闯过三关，口红拿回家',
    isTouching: false,
    showDialogLessCoins: false,
    showDialogTopup: false,
    showDialogLipstick: false,
    showDialogShare: false,
    lipstickChoosen: {}
  };
  onPullDownRefresh = () => {
    const { dispatch } = this.props;
    dispatch(this.mappingAction('list')).then(_ => {
      Taro.stopPullDownRefresh();
    });
  };
  onShareAppMessage = e => {
    const shareCode = e.target.dataset.code;
    const { configViews } = this.props;
    const path = `/pages/index/index${shareCode ? `?shareCode=${shareCode}` : ''}`;
    return {
      title: `${configViews.share_title || '快帮我获得赢取大牌口红的机会，就差一步了！'}`,
      path,
      imageUrl: `${configViews.share_image || 'https://api.lipstick.lemiao.xyz/images/app.jpg'}`
    };
  };
  onPageScroll(e) {
    this.setState({
      isTouching: true
    });
    clearTimeout(scrollerTimer);
    scrollerTimer = setTimeout(() => {
      this.setState({
        isTouching: false
      });
    }, 300);
  }
  saveFormID(e) {
    this.props.dispatch(action('app/submitForm', e.detail.formId));
  }
  muteMusic() {
    var muted = !this.props.muted;
    this.props.dispatch(action('app/changeMuted', muted ? '1' : null));
  }
  showTabBar() {
    const { showDialogLessCoins, showDialogLipstick, showDialogTopup, showDialogShare } = this.state;
    !showDialogLessCoins && !showDialogLipstick && !showDialogTopup && !showDialogShare && Taro.showTabBar();
  }
  closeDialogLessMoney() {
    this.setState({
      showDialogLessCoins: false
    }, this.showTabBar);
  }
  closeLipstick() {
    this.setState({
      showDialogLipstick: false
    }, this.showTabBar);
  }
  closeDialogTopup() {
    this.setState({
      showDialogTopup: false
    }, this.showTabBar);
  }
  closeDialogShare() {
    this.setState({
      showDialogShare: false
    }, this.showTabBar);
  }
  popUpLipstick(e) {
    this.setState({
      showDialogLipstick: true,
      lipstickChoosen: this.props.lipsticks[e.target.dataset.index]
    });
    Taro.hideTabBar();
  }
  popUpDialogTopup() {
    this.setState({
      showDialogLipstick: false,
      showDialogLessCoins: false,
      showDialogTopup: true
    });
    Taro.hideTabBar();
  }
  popUpDialogShare() {
    this.setState({
      showDialogShare: true
    });
    this.props.dispatch(this.mappingAction('shareList'));
    Taro.hideTabBar();
  }
  bannerTapped(a) {
    console.log(a);
    Taro.navigateTo({
      url: '/pages/webview/index?url=' + encodeURIComponent(a.target.dataset.url)
    });
  }
  enterHelp(a) {
    Taro.navigateTo({
      url: '/pages/webview/index?url=' + encodeURIComponent(this.props.configViews.qa_url)
    });
  }
  iOSHelper(a) {
    Taro.navigateTo({
      url: '/pages/webview/index?url=' + encodeURIComponent(this.props.configViews.ios_hint_url)
    });
  }
  startPlay(e) {
    const { balance } = this.props;
    if (parseFloat(balance) < parseFloat(e.target.dataset.price)) {
      this.setState({
        showDialogLipstick: false,
        showDialogLessCoins: true,
        showDialogTopup: false
      });
    }
  }
  topUpCoins(e) {
    console.log(e);
    const productId = e.detail.target.dataset.id;
    this.props.dispatch(this.mappingAction('commit', {
      productId,
      buyType: 1,
      formId: e.detail.formId,
      shareCode: ''
    })).then(() => {
      this.setState({
        showDialogTopup: false
      }, this.showTabBar);
    });
  }
  handleOnTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  onGetUserInfo(e) {
    const type = e.currentTarget.dataset.type;
    if (!this.props.userInfo) {
      this.$scope.saveUserInfo(e.detail.userInfo, this[type](e));
    } else {
      this[type](e);
    }
  }
  gameTrial(a) {
    Taro.navigateTo({
      url: '../game/index?trial=1'
    });
  }
  render() {
    const {
      isShowShare,
      system = 'android',
      muted,
      balance,
      payList,
      configViews,
      shareCode,
      shareList,
      lipsticks,
      loading
    } = this.props;
    const {
      inspirationalTip,
      isTouching,
      showDialogLessCoins,
      showDialogTopup,
      showDialogLipstick,
      showDialogShare,
      lipstickChoosen
    } = this.state;

    return <block>
        {loading ? <Loading height="100vh" /> : <View className="products">
            <View className="container">
              <OfficialAccount />
              <View className="top">
                <Text className="inspirational-tip">{configViews.list_tip || inspirationalTip}</Text>
                <Button onClick={this.muteMusic.bind(this)} className={`music ${muted ? 'music-off' : ''}`}>
                  <Text className={`iconfont ${muted ? 'icon-mn_shengyinwu_fill' : 'icon-mn_shengyin_fill'}`} />
                </Button>
              </View>
              <View className="banner">
                <Image onClick={this.bannerTapped.bind(this)} className={`slide-image`} data-url={configViews.tuwen_url} mode="aspectFill" src={configViews.list_banner} />
              </View>
              <View className="middle">
                {isAndroid(system) && <block>
                    <Text className="balance">
                      <Text className="iconfont icon-yue" />
                      {balance}枚
                    </Text>
                    <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                      <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="popUpDialogTopup" className="top-up" formType="submit" hoverClass="hover" openType="getUserInfo">
                        点击购买游戏币
                      </Button>
                    </Form>
                  </block>}
                {!isAndroid(system) && <Text onClick={this.enterHelp.bind(this)} className="balance">闯关说明</Text>}
                <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                  <Button open onClick={this.enterHelp.bind(this)} className="question" formType="submit">
                    <Text className="iconfont icon-shuoming" />
                  </Button>
                </Form>
              </View>
              {lipsticks.length < 1 && loading && <View className="lipsticks-out-stock">
                    <View className="tip">
                      <Image className="icon" src={outStock} />
                      <Text className="Text">口红换新 敬请期待</Text>
                    </View>
                  </View>}
              <View className="lipsticks-list">
                <Form onSubmit="gameStart" reportSubmit="true">
                  {lipsticks && lipsticks.map((item, index) => {
                return <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="popUpLipstick" className="lipstick" data-id={item.id} data-index={index} formType="submit" openType="getUserInfo" key={index}>
                          <View className="lipstick-info">
                            <Image mode="aspectFit" src={item.mainImageUrl} />
                            <Text className="lipstick-title">{item.title}</Text>
                            <Text className="lipstick-color">{item.color}</Text>
                            <Text className="lipstick-original-price">￥{formatPrice(item.salePrice)} 专柜价</Text>
                          </View>
                          {isAndroid(system) && <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                              <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="startPlay" catchtap="disable" className="lipstick-button" data-item={item.id} data-price={item.game_price} formType="submit" hoverClass="hover" openType="getUserInfo">
                                {formatCoin(item.gamePrice)}枚币 赢口红
                              </Button>
                            </Form>}
                          {!isAndroid(system) && <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                              <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="popUpLipstick" catchtap="disable" className="lipstick-button" data-id={item.id} formType="submit" hoverClass="hover" openType="getUserInfo">
                                想要这支
                              </Button>
                            </Form>}
                        </Button>;
              })}
                </Form>
              </View>
            </View>
            {showDialogLessCoins && <View className="dialog dialog-less-coins" onTouchMove={this.handleOnTouchMove.bind(this)}>
                <View className="dialog-box">
                  <Image onClick={this.closeDialogLessMoney.bind(this)} className="close" mode="aspectFill" src={closeBtn} />
                  <Image className="icon" mode="aspectFill" src={lessCoins} />
                  <Text className="title">小主，您的游戏币不足</Text>
                  <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                    <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="popUpDialogTopup" className="buy" formType="submit" hoverClass="hover" openType="getUserInfo">
                      购买游戏币
                    </Button>
                  </Form>
                </View>
              </View>}
            {showDialogLipstick && <View className="dialog dialog-lipstick" onTouchMove={this.handleOnTouchMove.bind(this)}>
                <View className="dialog-box">
                  <Image onClick={this.closeLipstick.bind(this)} className="close" mode="aspectFill" src={closeBtn} />
                  <View className="lipstick-info">
                    <Image mode="aspectFit" src={lipstickChoosen.mainImageUrl} />
                    <Text className="lipstick-title">{lipstickChoosen.name}</Text>
                    <Text className="lipstick-subtitle">{lipstickChoosen.title}</Text>
                    <Text className="lipstick-original-price">￥{formatPrice(lipstickChoosen.salePrice)} 专柜价</Text>
                    <View className="lipstick-border" />
                    <View className="lipstick-color-code" style={{ background: lipstickChoosen.colorCode }}></View>
                    <Text className="lipstick-color">{lipstickChoosen.color}</Text>
                  </View>
                  {isAndroid(system) && <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                      <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="startPlay" className="pay" data-item={lipstickChoosen.id} data-price={lipstickChoosen.gamePrice} formType="submit" hoverClass="hover" openType="getUserInfo">
                        {formatCoin(lipstickChoosen.gamePrice)}枚币 赢口红
                      </Button>
                    </Form>}
                  {!isAndroid(system) && <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
                      <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="iOSHelper" className="pay" formType="submit" hoverClass="hover" openType="getUserInfo">
                        想要这支
                      </Button>
                    </Form>}
                </View>
              </View>}
            {showDialogTopup && <View className="dialog dialog-topup" onTouchMove={this.handleOnTouchMove.bind(this)}>
                <View className="dialog-box">
                  <Image onClick={this.closeDialogTopup.bind(this)} className="close" mode="aspectFill" src={closeBtn} />
                  <Image className="share-img" onClick={this.popUpDialogShare.bind(this)} mode="aspectFill" src={presentShare} />
                  <Text className="topup-title">购买游戏币</Text>
                  <Text className="topup-balance">
                    <Text className="iconfont icon-yue" />
                    <Text className="balance-title">我的游戏币</Text>
                    <Text className="balance-value">{balance}枚</Text>
                  </Text>
                  <View className="topup-blocks">
                    {payList && payList.map(item => {
                return <Form onSubmit={this.topUpCoins.bind(this)} reportSubmit="true" key={item.id}>
                            <Button className="pay" data-id={item.id} formType="submit" hoverClass="hover">
                              <Text className="pay-coins">{item.coinNum}枚</Text>
                              <Text className="pay-price">￥{formatPrice(item.payNum)}</Text>
                            </Button>
                          </Form>;
              })}
                  </View>
                </View>
              </View>}
            <ModalShare isShow={showDialogShare} shareCode={shareCode} shareList={shareList} onClose={this.closeDialogShare.bind(this)} onSaveForm={this.saveFormID.bind(this)} configViews={configViews} />
            {isShowShare && <View className="my-tip">
                <Image src={myTip} />
              </View>}
            <Form onSubmit={this.saveFormID.bind(this)} reportSubmit="true">
              <Button onGetUserInfo={this.onGetUserInfo.bind(this)} data-type="gameTrial" className={`trial ${isTouching ? 'deactive' : ''}`} formType="submit" openType="getUserInfo">
                <Text className="iconfont icon-youxi" />
                <Text className="trial-title">体验游戏</Text>
              </Button>
            </Form>
          </View>}
      </block>;
  }
}