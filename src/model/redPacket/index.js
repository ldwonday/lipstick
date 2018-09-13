import modelExtend from 'dva-model-extend'
import action from '../../utils/action'
import { model } from '../common'
import { showWxLoading, hideWxLoading, getNavHeight } from '../../utils'
import { packetGet, packetGrabList, packetExtra, packetGrab, packetAssist } from './service'
import { ASSIST_SUCCESS, NONE } from './const'

export default modelExtend(model, {
  namespace: 'redPacket',
  state: {
    sharePacket: {},
    packet: {},
  },
  reducers: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put(action('get'))
    },
    *get({ payload }, { call, put, select }) {
      const redPacket = yield select(state => state.redPacket)
      const { data } = yield call(
        packetGet,
        redPacket && redPacket.sharePacket && redPacket.sharePacket.packetNo
      )
      yield put(action('save', { packet: data }))
    },
    *grab({ payload }, { call, put }) {
      yield call(packetGrab, { id: payload })
    },
    *open({ payload }, { call, put }) {
      showWxLoading()
      const { data } = yield call(packetGet)
      yield put(action('save', { ...data, isClickPacket: true }))
      hideWxLoading()
    },
    *assist({ payload }, { call, put, select }) {
      const redPacket = yield select(state => state.redPacket)
      yield call(packetAssist, redPacket && redPacket.sharePacket && redPacket.sharePacket.packetNo)
    },
    *extra({ payload }, { call, put }) {
      const res = yield call(packetExtra)
      yield put(
        action('save', {
          packet: {
            assistRecords: [],
            canGrap: false,
            detailViews: [],
            recordView: {
              packetNo: res.data,
              status: 2,
            },
          },
        })
      )
    },
  },
})
