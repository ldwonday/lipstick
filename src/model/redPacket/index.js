import modelExtend from 'dva-model-extend'
import action from '../../utils/action'
import { model } from '../common'
import { packetGet, packetExtra, packetGrab, packetAssist } from './service'

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
      const { data } = yield call(packetGet, redPacket.sharePacket.packetNo)
      yield put(action('save', { packet: data }))
    },
    *grab({ payload }, { call, put }) {
      yield call(packetGrab, { id: payload })
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
