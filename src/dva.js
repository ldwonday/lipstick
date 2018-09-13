import { create } from 'dva-core'
import { createLogger } from 'redux-logger'
import createLoading from 'dva-loading'

let App
let store
let dispatch

function createApp(opt) {
  opt.onAction = [/*createLogger()*/]
  App = create(opt)
  App.use(createLoading({}))

  if (!global.registered) opt.models.forEach(model => App.model(model))
  global.registered = true
  App.start()

  store = App._store
  App.getStore = () => store

  dispatch = store.dispatch

  App.dispatch = dispatch
  return App
}

export default {
  createApp,
  getDispatch() {
    return App.dispatch
  },
}
